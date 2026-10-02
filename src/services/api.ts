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
  ReportsData,
} from '../types';
import {
  computeDashboardMetrics,
  computeChartDays,
  computeWeeklyTrend,
  computeCategoryBreakdown,
} from './dataCalculations';

/**
 * Global Configuration for Backend API Integration.
 * Configure VITE_API_BASE_URL in your .env file or call api.setBaseUrl('https://your-api.com/api/v1')
 */
let API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
let USE_MOCK_FALLBACK =
  !API_BASE_URL || (import.meta.env.VITE_USE_MOCK_FALLBACK as string) === 'true';

export const isBackendConnected = () => Boolean(API_BASE_URL && !USE_MOCK_FALLBACK);
export const getApiBaseUrl = () => API_BASE_URL;

export const configureApi = (config: { baseUrl?: string; useMockFallback?: boolean }) => {
  if (config.baseUrl !== undefined) API_BASE_URL = config.baseUrl;
  if (config.useMockFallback !== undefined) USE_MOCK_FALLBACK = config.useMockFallback;
};

// Generic HTTP fetch wrapper with JWT / Auth header injection
async function http<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('india_pl_auth_token');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedMessage = response.statusText;
    try {
      const json = JSON.parse(errorBody);
      parsedMessage = json.message || json.error || parsedMessage;
    } catch {
      if (errorBody) parsedMessage = errorBody;
    }
    throw new Error(`API Error [${response.status}]: ${parsedMessage}`);
  }

  return response.json();
}

/**
 * Unified Dynamic API Service.
 * Automatically delegates to backend HTTP endpoints when configured,
 * or serves from dynamic local state with calculation engine.
 */
export const api = {
  setBaseUrl: (url: string) => {
    API_BASE_URL = url;
    USE_MOCK_FALLBACK = !url;
  },

  // Auth Endpoints
  auth: {
    login: async (identifier: string, pass: string): Promise<{ user: AdminUser; token: string }> => {
      if (!isBackendConnected()) {
        const user: AdminUser = {
          id: 'admin_001',
          name: 'Priyanka Sahu',
          email: identifier.includes('@') ? identifier : 'admin@indiapl.com',
          role: 'Super Admin',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
          phone: identifier.includes('+') ? identifier : '+91 98765 00001',
        };
        const token = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('india_pl_auth_token', token);
        return { user, token };
      }
      return http<{ user: AdminUser; token: string }>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password: pass }),
      });
    },

    logout: async (): Promise<void> => {
      localStorage.removeItem('india_pl_auth_token');
      if (isBackendConnected()) {
        await http('/auth/admin/logout', { method: 'POST' }).catch(() => {});
      }
    },
  },

  // Dashboard Endpoints
  dashboard: {
    getMetrics: async (
      bookingsFallback?: Booking[],
      workersFallback?: Worker[],
      customersFallback?: Customer[]
    ): Promise<DashboardMetrics> => {
      if (!isBackendConnected()) {
        return computeDashboardMetrics(
          bookingsFallback || [],
          workersFallback || [],
          customersFallback || []
        );
      }
      return http<DashboardMetrics>('/dashboard/metrics');
    },

    getChartTrends: async (bookingsFallback?: Booking[]): Promise<ChartDay[]> => {
      if (!isBackendConnected()) {
        return computeChartDays(bookingsFallback || []);
      }
      return http<ChartDay[]>('/dashboard/chart-trends');
    },
  },

  // Bookings Endpoints
  bookings: {
    getAll: async (params?: Record<string, string>): Promise<Booking[]> => {
      if (!isBackendConnected()) {
        return []; // Caller will use local fallback
      }
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return http<Booking[]>(`/bookings${query}`);
    },

    getById: async (bookingId: string): Promise<Booking> => {
      return http<Booking>(`/bookings/${encodeURIComponent(bookingId)}`);
    },

    create: async (data: Partial<Booking>): Promise<Booking> => {
      return http<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    updateStatus: async (bookingId: string, status: BookingStatus): Promise<Booking> => {
      return http<Booking>(`/bookings/${encodeURIComponent(bookingId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    autoDispatch: async (
      bookingId: string
    ): Promise<{ success: boolean; message: string; worker?: Worker; distance?: number }> => {
      return http(`/bookings/${encodeURIComponent(bookingId)}/auto-dispatch`, {
        method: 'POST',
      });
    },

    simulateWorkerResponse: async (
      bookingId: string,
      accepted: boolean
    ): Promise<{ success: boolean }> => {
      return http(`/bookings/${encodeURIComponent(bookingId)}/worker-response`, {
        method: 'POST',
        body: JSON.stringify({ accepted }),
      });
    },
  },

  // Workers / Pros Endpoints
  workers: {
    getAll: async (params?: Record<string, string>): Promise<Worker[]> => {
      if (!isBackendConnected()) {
        return [];
      }
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return http<Worker[]>(`/workers${query}`);
    },

    getById: async (workerId: string): Promise<Worker> => {
      return http<Worker>(`/workers/${encodeURIComponent(workerId)}`);
    },

    update: async (worker: Worker): Promise<Worker> => {
      return http<Worker>(`/workers/${encodeURIComponent(worker.workerId)}`, {
        method: 'PUT',
        body: JSON.stringify(worker),
      });
    },

    toggleAvailability: async (workerId: string): Promise<Worker> => {
      return http<Worker>(`/workers/${encodeURIComponent(workerId)}/toggle-availability`, {
        method: 'PATCH',
      });
    },

    approve: async (workerId: string): Promise<Worker> => {
      return http<Worker>(`/workers/${encodeURIComponent(workerId)}/approve`, {
        method: 'POST',
      });
    },

    reject: async (workerId: string): Promise<Worker> => {
      return http<Worker>(`/workers/${encodeURIComponent(workerId)}/reject`, {
        method: 'POST',
      });
    },
  },

  // Customers Endpoints
  customers: {
    getAll: async (): Promise<Customer[]> => {
      if (!isBackendConnected()) {
        return [];
      }
      return http<Customer[]>('/customers');
    },

    getById: async (customerId: string): Promise<Customer> => {
      return http<Customer>(`/customers/${encodeURIComponent(customerId)}`);
    },
  },

  // Services Catalog Endpoints
  services: {
    getAll: async (): Promise<ServiceItem[]> => {
      if (!isBackendConnected()) {
        return [];
      }
      return http<ServiceItem[]>('/services');
    },

    create: async (data: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceItem> => {
      return http<ServiceItem>('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (service: ServiceItem): Promise<ServiceItem> => {
      return http<ServiceItem>(`/services/${encodeURIComponent(service.id)}`, {
        method: 'PUT',
        body: JSON.stringify(service),
      });
    },

    delete: async (serviceId: string): Promise<void> => {
      return http<void>(`/services/${encodeURIComponent(serviceId)}`, {
        method: 'DELETE',
      });
    },
  },

  // Notifications Endpoints
  notifications: {
    getAll: async (): Promise<NotificationItem[]> => {
      if (!isBackendConnected()) {
        return [];
      }
      return http<NotificationItem[]>('/notifications');
    },

    markAsRead: async (id: string): Promise<void> => {
      return http<void>(`/notifications/${encodeURIComponent(id)}/read`, {
        method: 'PATCH',
      });
    },

    clearAll: async (): Promise<void> => {
      return http<void>('/notifications', {
        method: 'DELETE',
      });
    },
  },

  // Reports Analytics Endpoints
  reports: {
    getReportData: async (
      timeRange: '7d' | '30d' | '90d',
      bookingsFallback?: Booking[],
      workersFallback?: Worker[],
      customersFallback?: Customer[]
    ): Promise<ReportsData> => {
      if (!isBackendConnected()) {
        const metrics = computeDashboardMetrics(
          bookingsFallback || [],
          workersFallback || [],
          customersFallback || []
        );
        const weeklyTrend = computeWeeklyTrend(bookingsFallback || []);
        const categoryBreakdown = computeCategoryBreakdown(bookingsFallback || []);

        return {
          timeRange,
          weeklyTrend,
          categoryBreakdown,
          metrics,
        };
      }
      return http<ReportsData>(`/reports?range=${timeRange}`);
    },
  },
};
