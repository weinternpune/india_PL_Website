import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { bookingsRoutes } from './routes/bookingsRoutes.js';
import { workersRoutes } from './routes/workersRoutes.js';
import { customersRoutes } from './routes/customersRoutes.js';
import { servicesRoutes } from './routes/servicesRoutes.js';
import { notificationsRoutes } from './routes/notificationsRoutes.js';
import { reportsRoutes } from './routes/reportsRoutes.js';
import { payoutsRoutes } from './routes/payoutsRoutes.js';
import { ratingsRoutes } from './routes/ratingsRoutes.js';

const app = express();

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        config.corsOrigins.includes('*') ||
        config.corsOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly permissive CORS
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ==========================================
// 2. BODY PARSING & LOGGING
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req: Request, _res: Response, next) => {
  const start = Date.now();
  const { method, url } = req;
  _res.on('finish', () => {
    const duration = Date.now() - start;
    if (url !== '/health') {
      console.log(`[${new Date().toISOString()}] ${method} ${url} ${_res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// ==========================================
// 3. HEALTH & ROOT ENDPOINTS
// ==========================================
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'INDIA P.L. Operations & Dispatch Backend',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to INDIA P.L. Operations API Engine',
    version: '1.0.0',
    documentation: 'See README.md for endpoint specifications',
    endpoints: {
      auth: '/auth/admin/login',
      dashboard: '/dashboard/metrics',
      chartTrends: '/dashboard/chart-trends',
      bookings: '/bookings',
      workers: '/workers',
      customers: '/customers',
      services: '/services',
      notifications: '/notifications',
      reports: '/reports',
      payouts: '/payouts',
      ratings: '/ratings',
      health: '/health',
    },
  });
});

// ==========================================
// 4. API ROUTE MOUNTING
// ==========================================
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/workers', workersRoutes);
app.use('/customers', customersRoutes);
app.use('/services', servicesRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/reports', reportsRoutes);
app.use('/payouts', payoutsRoutes);
app.use('/ratings', ratingsRoutes);

// ==========================================
// 5. 404 CATCH-ALL HANDLER
// ==========================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. Route not found on INDIA P.L. Backend.`,
  });
});

// ==========================================
// 6. GLOBAL ERROR HANDLER
// ==========================================
app.use(errorHandler);

// ==========================================
// 7. START SERVER
// ==========================================
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 INDIA P.L. Backend Server running on port ${config.port}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API Base URL: http://localhost:${config.port}`);
    console.log(`📡 CORS allowed for: ${config.corsOrigins.join(', ')}`);
    console.log(`💚 Health Check: http://localhost:${config.port}/health`);
    console.log(`=======================================================`);
  });
}

export default app;
