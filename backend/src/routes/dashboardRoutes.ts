import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import {
  computeDashboardMetrics,
  computeChartDays,
} from '../services/calculationsService.js';

export const dashboardRoutes = Router();

/**
 * GET /dashboard/metrics
 * Dynamic dashboard metrics calculated in real-time
 */
dashboardRoutes.get('/metrics', (req: Request, res: Response): void => {
  const bookings = store.getBookings();
  const workers = store.getWorkers();
  const customers = store.getCustomers();

  const metrics = computeDashboardMetrics(bookings, workers, customers);
  res.json(metrics);
});

/**
 * GET /dashboard/chart-trends
 * Daily booking volume & GMV distribution for Sun - Sat
 */
dashboardRoutes.get('/chart-trends', (req: Request, res: Response): void => {
  const bookings = store.getBookings();
  const chartDays = computeChartDays(bookings);
  res.json(chartDays);
});
