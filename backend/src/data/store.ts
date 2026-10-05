import fs from 'fs';
import path from 'path';
import {
  AdminUser,
  Worker,
  Customer,
  ServiceItem,
  Booking,
  WorkerRating,
  PayoutRequest,
  NotificationItem,
} from '../types/index.js';
import {
  initialAdminUser,
  initialWorkers,
  initialCustomers,
  initialServices,
  initialBookings,
  initialRatings,
  initialPayoutRequests,
  initialNotifications,
} from './initialData.js';
import { config } from '../config/env.js';

interface DatabaseSchema {
  adminUser: AdminUser;
  workers: Worker[];
  customers: Customer[];
  services: ServiceItem[];
  bookings: Booking[];
  ratings: WorkerRating[];
  payoutRequests: PayoutRequest[];
  notifications: NotificationItem[];
}

class Store {
  private data: DatabaseSchema;
  private filePath: string;

  constructor() {
    this.filePath = config.dataFilePath;
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        console.log(`[Database] Loaded persistent data from ${this.filePath}`);
        return {
          adminUser: parsed.adminUser || initialAdminUser,
          workers: parsed.workers || initialWorkers,
          customers: parsed.customers || initialCustomers,
          services: parsed.services || initialServices,
          bookings: parsed.bookings || initialBookings,
          ratings: parsed.ratings || initialRatings,
          payoutRequests: parsed.payoutRequests || initialPayoutRequests,
          notifications: parsed.notifications || initialNotifications,
        };
      }
    } catch (err) {
      console.warn(`[Database] Could not read ${this.filePath}, initializing fresh store.`, err);
    }

    const freshData: DatabaseSchema = {
      adminUser: initialAdminUser,
      workers: initialWorkers,
      customers: initialCustomers,
      services: initialServices,
      bookings: initialBookings,
      ratings: initialRatings,
      payoutRequests: initialPayoutRequests,
      notifications: initialNotifications,
    };

    this.saveData(freshData);
    return freshData;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`[Database] Failed to write database to ${this.filePath}`, err);
    }
  }

  public persist(): void {
    this.saveData(this.data);
  }

  // --- Admin ---
  public getAdmin(): AdminUser {
    return this.data.adminUser;
  }

  public updateAdmin(updates: Partial<AdminUser>): AdminUser {
    this.data.adminUser = { ...this.data.adminUser, ...updates };
    this.persist();
    return this.data.adminUser;
  }

  // --- Workers ---
  public getWorkers(): Worker[] {
    return this.data.workers;
  }

  public getWorkerById(id: string): Worker | undefined {
    return this.data.workers.find((w) => w.workerId === id);
  }

  public setWorkers(workers: Worker[]): void {
    this.data.workers = workers;
    this.persist();
  }

  public saveWorker(worker: Worker): Worker {
    const idx = this.data.workers.findIndex((w) => w.workerId === worker.workerId);
    if (idx >= 0) {
      this.data.workers[idx] = worker;
    } else {
      this.data.workers.push(worker);
    }
    this.persist();
    return worker;
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.data.customers.find((c) => c.customerId === id);
  }

  public saveCustomer(customer: Customer): Customer {
    const idx = this.data.customers.findIndex((c) => c.customerId === customer.customerId);
    if (idx >= 0) {
      this.data.customers[idx] = customer;
    } else {
      this.data.customers.push(customer);
    }
    this.persist();
    return customer;
  }

  // --- Services ---
  public getServices(): ServiceItem[] {
    return this.data.services;
  }

  public getServiceById(id: string): ServiceItem | undefined {
    return this.data.services.find((s) => s.id === id);
  }

  public saveService(service: ServiceItem): ServiceItem {
    const idx = this.data.services.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      this.data.services[idx] = service;
    } else {
      this.data.services.unshift(service);
    }
    this.persist();
    return service;
  }

  public deleteService(id: string): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Bookings ---
  public getBookings(): Booking[] {
    return this.data.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.data.bookings.find((b) => b.bookingId === id);
  }

  public saveBooking(booking: Booking): Booking {
    const idx = this.data.bookings.findIndex((b) => b.bookingId === booking.bookingId);
    if (idx >= 0) {
      this.data.bookings[idx] = booking;
    } else {
      this.data.bookings.unshift(booking);
    }
    this.persist();
    return booking;
  }

  // --- Ratings ---
  public getRatings(): WorkerRating[] {
    return this.data.ratings;
  }

  public addRating(rating: WorkerRating): WorkerRating {
    this.data.ratings.unshift(rating);
    this.persist();
    return rating;
  }

  // --- Payouts ---
  public getPayoutRequests(): PayoutRequest[] {
    return this.data.payoutRequests;
  }

  public getPayoutById(id: string): PayoutRequest | undefined {
    return this.data.payoutRequests.find((p) => p.id === id);
  }

  public savePayoutRequest(payout: PayoutRequest): PayoutRequest {
    const idx = this.data.payoutRequests.findIndex((p) => p.id === payout.id);
    if (idx >= 0) {
      this.data.payoutRequests[idx] = payout;
    } else {
      this.data.payoutRequests.unshift(payout);
    }
    this.persist();
    return payout;
  }

  // --- Notifications ---
  public getNotifications(): NotificationItem[] {
    return this.data.notifications;
  }

  public addNotification(notification: NotificationItem): NotificationItem {
    this.data.notifications.unshift(notification);
    this.persist();
    return notification;
  }

  public markNotificationAsRead(id: string): boolean {
    const n = this.data.notifications.find((notif) => notif.id === id);
    if (n) {
      n.read = true;
      this.persist();
      return true;
    }
    return false;
  }

  public clearAllNotifications(): void {
    this.data.notifications = [];
    this.persist();
  }

  // Reset to initial state
  public resetData(): void {
    this.data = {
      adminUser: initialAdminUser,
      workers: initialWorkers,
      customers: initialCustomers,
      services: initialServices,
      bookings: initialBookings,
      ratings: initialRatings,
      payoutRequests: initialPayoutRequests,
      notifications: initialNotifications,
    };
    this.persist();
  }
}

export const store = new Store();
