import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminUser,
  Booking,
  BookingStatus,
  Customer,
  DashboardMetrics,
  NotificationItem,
  ServiceItem,
  Worker,
  ChartDay,
  CategoryBreakdownItem,
  WorkerRating,
  PayoutRequest,
  PayoutMetrics,
  PayoutStatus,
} from '../types';
import {
  initialAdminUser,
  initialBookings,
  initialCustomers,
  initialMetrics,
  initialNotifications,
  initialServices,
  initialWorkers,
  initialRatings,
  initialPayoutRequests,
} from '../data/mockData';
import {
  findNearestAvailableWorker,
  findNearestAvailableWorkers,
} from '../services/gpsService';
import { api, isBackendConnected, getApiBaseUrl } from '../services/api';
import {
  computeDashboardMetrics,
  computeChartDays,
  computeWeeklyTrend,
  computeCategoryBreakdown,
} from '../services/dataCalculations';

interface AppContextType {
  // Auth
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, pass: string) => boolean;
  logout: () => void;

  // Bookings
  bookings: Booking[];
  getBookingById: (id: string) => Booking | undefined;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  autoDispatchWorker: (bookingId: string) => { success: boolean; message: string; worker?: Worker; distance?: number };
  simulateWorkerResponse: (bookingId: string, accepted: boolean) => void;
  createNewBooking: (data: Partial<Booking>) => Booking;

  // Workers
  workers: Worker[];
  getWorkerById: (id: string) => Worker | undefined;
  approveWorker: (workerId: string) => void;
  rejectWorker: (workerId: string) => void;
  toggleWorkerAvailability: (workerId: string) => void;
  updateWorker: (worker: Worker) => void;
  addNewWorker: (workerData: Partial<Worker>) => Worker;

  // Dynamic Ratings & Reviews
  ratings: WorkerRating[];
  getWorkerRatings: (workerId: string) => WorkerRating[];
  getWorkerRatingStats: (workerId: string) => { averageRating: number; totalReviews: number; formattedRating: string };
  addWorkerRating: (rating: Omit<WorkerRating, 'id' | 'createdAt'>) => WorkerRating;

  // Worker Payouts System
  payoutRequests: PayoutRequest[];
  payoutMetrics: PayoutMetrics;
  getPayoutRequestById: (id: string) => PayoutRequest | undefined;
  verifyPayout: (id: string, notes?: string) => void;
  approvePayout: (id: string, notes?: string) => void;
  rejectPayout: (id: string, rejectionReason: string) => void;
  markPayoutPaid: (id: string, transactionReference: string, notes?: string) => void;
  calculateWorkerEarnings: (workerId: string) => { lifetimeEarnings: number; paidEarnings: number; pendingEarnings: number; availableBalance: number };

  // Customers
  customers: Customer[];
  getCustomerById: (id: string) => Customer | undefined;

  // Services
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>) => ServiceItem;
  updateService: (service: ServiceItem) => void;
  deleteService: (serviceId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Metrics & Dynamic Live Charts
  metrics: DashboardMetrics;
  chartDays: ChartDay[];
  weeklyTrend: { label: string; bookings: number; revenue: number; completed: number; cancelled: number }[];
  categoryBreakdown: CategoryBreakdownItem[];

  // Backend Integration State
  isBackendConnected: boolean;
  apiBaseUrl: string;
  refreshFromBackend: () => Promise<void>;
  isLoading: boolean;

  // Dev tools
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ADMIN_AUTH: 'india_pl_admin_auth',
  BOOKINGS: 'india_pl_bookings',
  WORKERS: 'india_pl_workers',
  CUSTOMERS: 'india_pl_customers',
  SERVICES: 'india_pl_services',
  NOTIFICATIONS: 'india_pl_notifications',
  RATINGS: 'india_pl_ratings',
  PAYOUTS: 'india_pl_payout_requests',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return saved ? JSON.parse(saved) : initialAdminUser;
  });

  // Data states initialized with localStorage fallback to mockData
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKERS);
    return saved ? JSON.parse(saved) : initialWorkers;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [ratings, setRatings] = useState<WorkerRating[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RATINGS);
    return saved ? JSON.parse(saved) : initialRatings;
  });

  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
    return saved ? JSON.parse(saved) : initialPayoutRequests;
  });

  // Sync with LocalStorage
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  const [isLoading, setIsLoading] = useState(false);

  // Derived Dynamic Analytics computed in real-time from active dataset
  const metrics = computeDashboardMetrics(bookings, workers, customers);
  const chartDays = computeChartDays(bookings);
  const weeklyTrend = computeWeeklyTrend(bookings);
  const categoryBreakdown = computeCategoryBreakdown(bookings);

  // Derived Payout Metrics computed dynamically
  const payoutMetrics: PayoutMetrics = React.useMemo(() => {
    const pendingOnlyList = payoutRequests.filter((p) => p.status === 'Pending');
    const underReviewList = payoutRequests.filter((p) => p.status === 'Under Review');

    const pendingCount = pendingOnlyList.length;
    const pendingAmount = pendingOnlyList.reduce((sum, p) => sum + p.requestedAmount, 0);

    const underReviewCount = underReviewList.length;
    const underReviewAmount = underReviewList.reduce((sum, p) => sum + p.requestedAmount, 0);

    const totalPendingPayouts = pendingAmount + underReviewAmount;
    const pendingRequestsCount = pendingCount + underReviewCount;

    const paidList = payoutRequests.filter((p) => p.status === 'Paid');
    const paidThisMonth = paidList.reduce((sum, p) => sum + p.requestedAmount, 0);

    const workersBaselineEarnings = workers.reduce(
      (sum, w) => sum + (w.bankDetails?.lifetimeEarnings || 18500),
      0
    );
    const completedBookingsEarnings = bookings
      .filter((b) => b.status === 'Completed')
      .reduce((sum, b) => sum + Math.round(b.totalAmount * 0.75), 0);

    const totalWorkerEarnings = workersBaselineEarnings + completedBookingsEarnings;

    return {
      totalPendingPayouts,
      pendingRequestsCount,
      pendingCount,
      pendingAmount,
      underReviewCount,
      underReviewAmount,
      paidThisMonth,
      totalWorkerEarnings,
    };
  }, [payoutRequests, workers, bookings]);

  // Sync with remote backend API if configured
  const refreshFromBackend = async () => {
    if (!isBackendConnected()) return;
    setIsLoading(true);
    try {
      const [remoteBookings, remoteWorkers, remoteCustomers, remoteServices, remoteNotifs] =
        await Promise.all([
          api.bookings.getAll().catch(() => []),
          api.workers.getAll().catch(() => []),
          api.customers.getAll().catch(() => []),
          api.services.getAll().catch(() => []),
          api.notifications.getAll().catch(() => []),
        ]);
      if (remoteBookings.length) setBookings(remoteBookings);
      if (remoteWorkers.length) setWorkers(remoteWorkers);
      if (remoteCustomers.length) setCustomers(remoteCustomers);
      if (remoteServices.length) setServices(remoteServices);
      if (remoteNotifs.length) setNotifications(remoteNotifs);
    } catch (err) {
      console.warn('Backend sync failed, continuing with active local dynamic store:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isBackendConnected()) {
      refreshFromBackend();
    }
  }, []);

  // Auth Methods
  const login = (identifier: string, _pass: string) => {
    // Allows clean demo login
    const user: AdminUser = {
      ...initialAdminUser,
      email: identifier.includes('@') ? identifier : 'admin@indiapl.com',
      phone: identifier.includes('+') ? identifier : initialAdminUser.phone,
    };
    setAdminUser(user);
    return true;
  };

  const logout = () => {
    setAdminUser(null);
  };

  // Notification Methods
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      read: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Booking Methods
  const getBookingById = (id: string) => {
    const cleanId = id.startsWith('#') ? id : `#${id}`;
    return bookings.find((b) => b.bookingId === cleanId || b.bookingId === id);
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId) {
          const newHistory = [
            ...b.history,
            {
              status,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Status manually updated to ${status} by Admin`,
            },
          ];
          return { ...b, status, history: newHistory, updatedAt: new Date().toISOString() };
        }
        return b;
      })
    );
  };

  // PART 6 & 14: Automatic GPS Worker Assignment
  const autoDispatchWorker = (bookingId: string) => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }

    const customerLat = booking.customerLocation.latitude;
    const customerLng = booking.customerLocation.longitude;

    // Collect already attempted / rejected worker IDs
    const alreadyAttemptedIds = (booking.dispatchLog || []).map((log) => log.workerId);

    // Calculate nearest available worker
    const match = findNearestAvailableWorker(
      customerLat,
      customerLng,
      booking.serviceCategory || booking.serviceName,
      workers,
      alreadyAttemptedIds
    );

    if (!match) {
      // No suitable worker available
      setBookings((prev) =>
        prev.map((b) => {
          if (b.bookingId === bookingId) {
            return {
              ...b,
              status: 'Finding Worker',
              history: [
                ...b.history,
                {
                  status: 'Finding Worker',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: 'Auto GPS scan: No active, verified pro currently available in radius. Retrying queue...',
                },
              ],
            };
          }
          return b;
        })
      );

      addNotification({
        title: `Dispatch Alert: ${booking.bookingId}`,
        message: `No active available pros found near ${booking.customerLocation.city}. Booking placed on waitlist.`,
        type: 'booking',
        link: `/admin/bookings/${booking.bookingId}`,
      });

      return {
        success: false,
        message: 'No available verified professionals found near this location.',
      };
    }

    const { worker, distanceKm } = match;
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update booking state with selected nearest worker
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId) {
          const attemptNum = (b.dispatchLog?.length || 0) + 1;
          const updatedDispatchLog = [
            ...(b.dispatchLog || []),
            {
              attemptNumber: attemptNum,
              workerId: worker.workerId,
              workerName: worker.name,
              distanceKm: distanceKm,
              action: 'Notified' as const,
              timestamp: nowTimeStr,
            },
          ];

          const updatedHistory = [
            ...b.history,
            {
              status: 'Worker Notified' as const,
              timestamp: nowTimeStr,
              note: `Nearest available Pro ${worker.name} (${distanceKm} km away) automatically notified via GPS engine.`,
            },
          ];

          return {
            ...b,
            assignedWorkerId: worker.workerId,
            assignedWorkerName: worker.name,
            assignedWorkerPhone: worker.phone,
            assignedWorkerAvatar: worker.profileImage,
            assignedWorkerRating: worker.rating,
            workerDistance: distanceKm,
            workerLocation: { latitude: worker.latitude, longitude: worker.longitude },
            status: 'Worker Notified',
            dispatchLog: updatedDispatchLog,
            history: updatedHistory,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    addNotification({
      title: `Pro Notified for ${booking.bookingId}`,
      message: `${worker.name} (${distanceKm} km away) received job request for ${booking.serviceName}.`,
      type: 'worker',
      link: `/admin/bookings/${booking.bookingId}`,
    });

    return {
      success: true,
      message: `Assigned nearest Pro ${worker.name} (${distanceKm} km away). Job request sent.`,
      worker,
      distance: distanceKm,
    };
  };

  // Simulate Worker Accept or Reject (Flow from Part 6)
  const simulateWorkerResponse = (bookingId: string, accepted: boolean) => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return;

    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentWorker = workers.find((w) => w.workerId === booking.assignedWorkerId);
    const workerName = currentWorker?.name || booking.assignedWorkerName || 'Professional';

    if (accepted) {
      // Worker Accepted: Booking becomes Accepted / Assigned
      setBookings((prev) =>
        prev.map((b) => {
          if (b.bookingId === bookingId) {
            const updatedDispatchLog = (b.dispatchLog || []).map((log, idx, arr) =>
              idx === arr.length - 1 ? { ...log, action: 'Accepted' as const } : log
            );

            return {
              ...b,
              status: 'Accepted',
              history: [
                ...b.history,
                {
                  status: 'Accepted',
                  timestamp: nowTimeStr,
                  note: `${workerName} accepted the job request. Customer notified.`,
                },
              ],
              dispatchLog: updatedDispatchLog,
              updatedAt: new Date().toISOString(),
            };
          }
          return b;
        })
      );

      // Mark worker busy
      if (currentWorker) {
        setWorkers((prev) =>
          prev.map((w) =>
            w.workerId === currentWorker.workerId ? { ...w, availability: 'Busy' } : w
          )
        );
      }

      addNotification({
        title: `Booking ${booking.bookingId} Accepted!`,
        message: `${workerName} accepted booking from ${booking.customerName}.`,
        type: 'booking',
        link: `/admin/bookings/${booking.bookingId}`,
      });
    } else {
      // Worker Rejected: update dispatch log and cascade to next nearest worker
      const rejectedWorkerId = currentWorker?.workerId || booking.assignedWorkerId;

      setBookings((prev) =>
        prev.map((b) => {
          if (b.bookingId === bookingId) {
            const updatedDispatchLog = (b.dispatchLog || []).map((log, idx, arr) =>
              idx === arr.length - 1 ? { ...log, action: 'Rejected' as const } : log
            );

            return {
              ...b,
              status: 'Finding Worker',
              history: [
                ...b.history,
                {
                  status: 'Finding Worker',
                  timestamp: nowTimeStr,
                  note: `${workerName} declined request. Auto-searching next nearest available Pro...`,
                },
              ],
              dispatchLog: updatedDispatchLog,
            };
          }
          return b;
        })
      );

      addNotification({
        title: `Pro Declined ${booking.bookingId}`,
        message: `${workerName} declined job. Searching next suitable professional...`,
        type: 'worker',
        link: `/admin/bookings/${booking.bookingId}`,
      });

      // Automatically search and assign next nearest pro
      setTimeout(() => {
        const excludedIds = [
          ...(booking.dispatchLog || []).map((l) => l.workerId),
          rejectedWorkerId || '',
        ].filter(Boolean);

        const nextMatch = findNearestAvailableWorker(
          booking.customerLocation.latitude,
          booking.customerLocation.longitude,
          booking.serviceCategory || booking.serviceName,
          workers,
          excludedIds
        );

        if (nextMatch) {
          const nextWorker = nextMatch.worker;
          const nextDist = nextMatch.distanceKm;

          setBookings((prev) =>
            prev.map((b) => {
              if (b.bookingId === bookingId) {
                const nextAttemptNum = (b.dispatchLog?.length || 0) + 1;
                const nextDispatchLog = [
                  ...(b.dispatchLog || []),
                  {
                    attemptNumber: nextAttemptNum,
                    workerId: nextWorker.workerId,
                    workerName: nextWorker.name,
                    distanceKm: nextDist,
                    action: 'Notified' as const,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ];

                return {
                  ...b,
                  assignedWorkerId: nextWorker.workerId,
                  assignedWorkerName: nextWorker.name,
                  assignedWorkerPhone: nextWorker.phone,
                  assignedWorkerAvatar: nextWorker.profileImage,
                  assignedWorkerRating: nextWorker.rating,
                  workerDistance: nextDist,
                  workerLocation: { latitude: nextWorker.latitude, longitude: nextWorker.longitude },
                  status: 'Worker Notified',
                  dispatchLog: nextDispatchLog,
                  history: [
                    ...b.history,
                    {
                      status: 'Worker Notified',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      note: `Next nearest Pro ${nextWorker.name} (${nextDist} km) automatically notified.`,
                    },
                  ],
                };
              }
              return b;
            })
          );

          addNotification({
            title: `Reassigned ${booking.bookingId}`,
            message: `Sent to next nearest pro: ${nextWorker.name} (${nextDist} km away).`,
            type: 'booking',
            link: `/admin/bookings/${booking.bookingId}`,
          });
        }
      }, 600);
    }
  };

  const createNewBooking = (data: Partial<Booking>): Booking => {
    const nextId = `#${1000 + bookings.length + 1}`;
    const newBooking: Booking = {
      bookingId: nextId,
      customerId: data.customerId || 'CUST-101',
      customerName: data.customerName || 'Priya Sharma',
      customerPhone: data.customerPhone || '+91 98765 43210',
      customerEmail: data.customerEmail || 'priya.sharma@email.com',
      customerAvatar: data.customerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      serviceId: data.serviceId || 'srv_res_clean',
      serviceName: data.serviceName || 'Residential Cleaning',
      serviceCategory: data.serviceCategory || 'Cleaning',
      selectedServices: data.selectedServices || [{ name: 'Deep Dusting & Mopping', price: 297 }],
      customerLocation: data.customerLocation || {
        address: 'Plot No. 123, KIIT Road, Patia',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751024',
        latitude: 20.3540,
        longitude: 85.8175,
      },
      date: data.date || 'Today',
      timeSlot: data.timeSlot || '10:00 AM - 12:00 PM',
      estimatedDuration: data.estimatedDuration || '2 Hours',
      subtotal: data.subtotal || 297,
      convenienceFee: 25,
      totalAmount: (data.subtotal || 297) + 25,
      status: 'Pending',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      history: [
        {
          status: 'Pending',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Booking registered',
        },
      ],
      dispatchLog: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    addNotification({
      title: `New Booking ${newBooking.bookingId}`,
      message: `Created for ${newBooking.customerName} (${newBooking.serviceName})`,
      type: 'booking',
      link: `/admin/bookings/${newBooking.bookingId}`,
    });

    return newBooking;
  };

  // Worker Methods
  const getWorkerById = (id: string) => {
    return workers.find((w) => w.workerId === id);
  };

  const approveWorker = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.workerId === workerId) {
          return {
            ...w,
            status: 'Active',
            verificationStatus: 'Verified',
            availability: 'Available',
            documents: w.documents.map((d) => ({ ...d, verified: true })),
          };
        }
        return w;
      })
    );

    const worker = workers.find((w) => w.workerId === workerId);
    addNotification({
      title: 'Pro Application Approved',
      message: `${worker?.name || workerId} is now verified and active in the workforce.`,
      type: 'worker',
      link: '/admin/workers',
    });
  };

  const rejectWorker = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.workerId === workerId ? { ...w, verificationStatus: 'Rejected' } : w
      )
    );

    const worker = workers.find((w) => w.workerId === workerId);
    addNotification({
      title: 'Pro Application Rejected',
      message: `${worker?.name || workerId}'s application was declined.`,
      type: 'worker',
      link: '/admin/workers',
    });
  };

  const toggleWorkerAvailability = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.workerId === workerId) {
          const nextAvail = w.availability === 'Available' ? 'Offline' : 'Available';
          return { ...w, availability: nextAvail };
        }
        return w;
      })
    );
  };

  const updateWorker = (updatedWorker: Worker) => {
    setWorkers((prev) =>
      prev.map((w) => (w.workerId === updatedWorker.workerId ? updatedWorker : w))
    );
  };

  const addNewWorker = (workerData: Partial<Worker>): Worker => {
    const newWorkerId = `WRK-${200 + workers.length + 1}`;
    const newWorker: Worker = {
      workerId: newWorkerId,
      name: workerData.name || 'New Professional',
      phone: workerData.phone || '+91 98000 00000',
      email: workerData.email || 'pro@indiapl.pro',
      profileImage: workerData.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      services: workerData.services || ['Residential Cleaning'],
      categories: workerData.categories || ['Cleaning'],
      latitude: workerData.latitude || 20.3540,
      longitude: workerData.longitude || 85.8175,
      locationName: workerData.locationName || 'Bhubaneswar, Odisha',
      availability: workerData.availability || 'Available',
      status: workerData.status || 'Active',
      verificationStatus: workerData.verificationStatus || 'Verified',
      rating: 5.0,
      ratingCount: 1,
      completedJobs: 0,
      cancellationCount: 0,
      experienceYears: workerData.experienceYears || 2,
      documents: workerData.documents || [
        {
          id: `DOC-${Date.now()}`,
          name: 'Aadhaar Card',
          type: 'Aadhaar Card',
          documentNumber: 'XXXX-XXXX-1234',
          verified: true,
          uploadedAt: new Date().toISOString().slice(0, 10),
        },
      ],
      joinedDate: new Date().toISOString().slice(0, 10),
      recentBookingIds: [],
    };

    setWorkers((prev) => [newWorker, ...prev]);

    addNotification({
      title: 'New Pro Registered',
      message: `${newWorker.name} registered as a service professional.`,
      type: 'worker',
      link: '/admin/workers',
    });

    return newWorker;
  };

  // Customer Methods
  const getCustomerById = (id: string) => {
    return customers.find((c) => c.customerId === id);
  };

  // Services CRUD Methods
  const addService = (serviceData: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): ServiceItem => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setServices((prev) => [newService, ...prev]);

    addNotification({
      title: 'New Service Added',
      message: `${newService.name} added to the service catalog.`,
      type: 'system',
      link: '/admin/services',
    });

    return newService;
  };

  const updateService = (updatedService: ServiceItem) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === updatedService.id
          ? { ...updatedService, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const deleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  // Dynamic Worker Rating Methods
  const getWorkerRatings = (workerId: string): WorkerRating[] => {
    return ratings.filter((r) => r.workerId === workerId);
  };

  const getWorkerRatingStats = (workerId: string) => {
    const list = ratings.filter((r) => r.workerId === workerId);
    if (!list || list.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        formattedRating: 'No ratings yet',
      };
    }
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / list.length) * 10) / 10;
    return {
      averageRating: avg,
      totalReviews: list.length,
      formattedRating: `${avg.toFixed(1)} ★ (${list.length} review${list.length === 1 ? '' : 's'})`,
    };
  };

  const addWorkerRating = (ratingData: Omit<WorkerRating, 'id' | 'createdAt'>): WorkerRating => {
    const newRating: WorkerRating = {
      ...ratingData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRatings((prev) => [newRating, ...prev]);

    // Recalculate and update worker rating in workers state
    const workerList = ratings.filter((r) => r.workerId === ratingData.workerId).concat(newRating);
    const sum = workerList.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / workerList.length) * 10) / 10;

    setWorkers((prev) =>
      prev.map((w) =>
        w.workerId === ratingData.workerId
          ? { ...w, rating: avg, ratingCount: workerList.length }
          : w
      )
    );

    return newRating;
  };

  // Worker Payouts Management
  const calculateWorkerEarnings = (workerId: string) => {
    const worker = workers.find((w) => w.workerId === workerId);
    const baseline = worker?.bankDetails?.lifetimeEarnings || 16500;

    // Additional earnings from completed bookings
    const completedBookingEarnings = bookings
      .filter((b) => b.assignedWorkerId === workerId && b.status === 'Completed')
      .reduce((sum, b) => sum + Math.round(b.totalAmount * 0.75), 0);

    const lifetimeEarnings = baseline + completedBookingEarnings;

    // Sum paid
    const paidEarnings = payoutRequests
      .filter((p) => p.workerId === workerId && p.status === 'Paid')
      .reduce((sum, p) => sum + p.requestedAmount, 0);

    // Sum pending/under review/approved
    const pendingEarnings = payoutRequests
      .filter((p) => p.workerId === workerId && (p.status === 'Pending' || p.status === 'Under Review' || p.status === 'Approved'))
      .reduce((sum, p) => sum + p.requestedAmount, 0);

    const availableBalance = Math.max(0, lifetimeEarnings - paidEarnings - pendingEarnings);

    return {
      lifetimeEarnings,
      paidEarnings,
      pendingEarnings,
      availableBalance,
    };
  };

  const getPayoutRequestById = (id: string) => {
    return payoutRequests.find((p) => p.id === id);
  };

  const verifyPayout = (id: string, notes?: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Under Review' as PayoutStatus,
              adminNotes: notes || p.adminNotes,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );

    addNotification({
      title: 'Payout Under Review',
      message: `Payout request #${id} marked as Under Review.`,
      type: 'system',
      link: '/admin/payouts',
    });
  };

  const approvePayout = (id: string, notes?: string) => {
    const req = payoutRequests.find((p) => p.id === id);
    if (!req) return;

    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Approved' as PayoutStatus,
              adminNotes: notes || p.adminNotes,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );

    addNotification({
      title: 'Payout Approved',
      message: `Payout of ₹${req.requestedAmount.toLocaleString()} for ${req.workerName} was approved.`,
      type: 'worker',
      link: '/admin/payouts',
    });
  };

  const rejectPayout = (id: string, rejectionReason: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Rejected' as PayoutStatus,
              rejectionReason,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );

    const req = payoutRequests.find((p) => p.id === id);
    addNotification({
      title: 'Payout Rejected',
      message: `Payout request for ${req?.workerName || id} was rejected: ${rejectionReason}`,
      type: 'system',
      link: '/admin/payouts',
    });
  };

  const markPayoutPaid = (id: string, transactionReference: string, notes?: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Paid' as PayoutStatus,
              paidAt: new Date().toISOString(),
              transactionRef: transactionReference,
              adminNotes: notes || p.adminNotes,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );

    const req = payoutRequests.find((p) => p.id === id);
    addNotification({
      title: 'Payout Disbursed (Paid)',
      message: `Payout of ₹${req?.requestedAmount.toLocaleString()} successfully transferred to ${req?.workerName}. Ref: ${transactionReference}`,
      type: 'worker',
      link: '/admin/payouts',
    });
  };

  // Reset to default mock data
  const resetData = () => {
    setAdminUser(initialAdminUser);
    setBookings(initialBookings);
    setWorkers(initialWorkers);
    setCustomers(initialCustomers);
    setServices(initialServices);
    setNotifications(initialNotifications);
    setRatings(initialRatings);
    setPayoutRequests(initialPayoutRequests);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
        bookings,
        getBookingById,
        updateBookingStatus,
        autoDispatchWorker,
        simulateWorkerResponse,
        createNewBooking,
        workers,
        getWorkerById,
        approveWorker,
        rejectWorker,
        toggleWorkerAvailability,
        updateWorker,
        addNewWorker,
        ratings,
        getWorkerRatings,
        getWorkerRatingStats,
        addWorkerRating,
        payoutRequests,
        payoutMetrics,
        getPayoutRequestById,
        verifyPayout,
        approvePayout,
        rejectPayout,
        markPayoutPaid,
        calculateWorkerEarnings,
        customers,
        getCustomerById,
        services,
        addService,
        updateService,
        deleteService,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        clearAllNotifications,
        metrics,
        chartDays,
        weeklyTrend,
        categoryBreakdown,
        isBackendConnected: isBackendConnected(),
        apiBaseUrl: getApiBaseUrl(),
        refreshFromBackend,
        isLoading,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
