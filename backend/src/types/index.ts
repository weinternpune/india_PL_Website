export type ServiceCategory =
  | 'Cleaning'
  | 'Laundry'
  | 'Repair'
  | 'Household Help'
  | 'Technician'
  | 'Manpower';

export type BookingStatus =
  | 'Pending'
  | 'Finding Worker'
  | 'Worker Notified'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type WorkerAvailability = 'Available' | 'Busy' | 'Offline';
export type WorkerStatus = 'Active' | 'Pending Verification' | 'Suspended';
export type VerificationStatus = 'Verified' | 'Pending' | 'Rejected';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations Manager' | 'Dispatch Lead';
  avatar: string;
  phone: string;
  password?: string;
}

export interface WorkerDocument {
  id: string;
  name: string;
  type: 'Aadhaar Card' | 'PAN Card' | 'Police Clearance' | 'Skill Certificate' | 'Address Proof';
  documentNumber: string;
  verified: boolean;
  uploadedAt: string;
}

export interface WorkerRating {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  workerId: string;
  rating: number; // 1 to 5
  review?: string;
  createdAt: string;
}

export interface WorkerBankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolder: string;
  upiId?: string;
  lifetimeEarnings?: number;
}

export interface Worker {
  workerId: string;
  name: string;
  phone: string;
  email: string;
  profileImage: string;
  services: string[];
  categories: ServiceCategory[];
  latitude: number;
  longitude: number;
  locationName: string;
  availability: WorkerAvailability;
  status: WorkerStatus;
  verificationStatus: VerificationStatus;
  rating: number;
  ratingCount: number;
  ratings?: WorkerRating[];
  completedJobs: number;
  cancellationCount: number;
  experienceYears: number;
  documents: WorkerDocument[];
  joinedDate: string;
  recentBookingIds: string[];
  bankDetails?: WorkerBankDetails;
}

export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface Customer {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  location: string;
  addresses: CustomerAddress[];
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  status: 'Active' | 'Inactive';
  image: string;
  includedItems?: string[];
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingHistoryEntry {
  status: BookingStatus;
  timestamp: string;
  note: string;
}

export interface DispatchLogEntry {
  attemptNumber: number;
  workerId: string;
  workerName: string;
  distanceKm: number;
  action: 'Notified' | 'Accepted' | 'Rejected' | 'Timed Out';
  timestamp: string;
}

export interface Booking {
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  selectedServices: { name: string; price: number; session?: string }[];
  customerLocation: LocationCoordinates;
  date: string;
  timeSlot: string;
  estimatedDuration: string;
  subtotal: number;
  convenienceFee: number;
  totalAmount: number;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedWorkerPhone?: string;
  assignedWorkerAvatar?: string;
  assignedWorkerRating?: number;
  workerLocation?: { latitude: number; longitude: number };
  workerDistance?: number;
  status: BookingStatus;
  paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Wallet' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  history: BookingHistoryEntry[];
  dispatchLog: DispatchLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'worker' | 'payment' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface DashboardMetrics {
  totalBookings: number;
  todayBookings: number;
  activeWorkers: number;
  totalCustomers: number;
  gmv: number;
  cancellationRate: number;
}

export interface ChartDay {
  day: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | string;
  bookings: number;
  gmv: number;
}

export interface CategoryBreakdownItem {
  name: string;
  share: number;
  amount: string;
  rawAmount: number;
  count: number;
}

export interface ReportsData {
  timeRange: '7d' | '30d' | '90d';
  weeklyTrend: {
    label: string;
    bookings: number;
    revenue: number;
    completed: number;
    cancelled: number;
  }[];
  categoryBreakdown: CategoryBreakdownItem[];
  metrics: DashboardMetrics;
}

export type PayoutStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid';

export interface PayoutBookingItem {
  bookingId: string;
  serviceName: string;
  completedDate: string;
  customerAmount: number;
  workerEarning: number;
}

export interface PayoutRequest {
  id: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerEmail: string;
  workerAvatar: string;
  completedJobs: number;
  totalEarnings: number;
  alreadyPaid: number;
  availableBalance: number;
  requestedAmount: number;
  requestedDate: string;
  paymentMethod: 'UPI' | 'Direct Bank Transfer' | 'IMPS';
  paymentDetails: {
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    accountHolder?: string;
  };
  status: PayoutStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  paidAt?: string;
  rejectionReason?: string;
  transactionRef?: string;
  adminNotes?: string;
  updatedAt?: string;
  breakdown: PayoutBookingItem[];
}

export interface PayoutMetrics {
  totalPendingPayouts: number;
  pendingRequestsCount: number;
  pendingCount: number;
  pendingAmount: number;
  underReviewCount: number;
  underReviewAmount: number;
  paidThisMonth: number;
  totalWorkerEarnings: number;
}
