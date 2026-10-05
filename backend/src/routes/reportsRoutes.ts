import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import {
  computeDashboardMetrics,
  computeWeeklyTrend,
  computeCategoryBreakdown,
} from '../services/calculationsService.js';
import { ReportsData } from '../types/index.js';

export const reportsRoutes = Router();

/**
 * GET /reports?range=7d|30d|90d
 */
reportsRoutes.get('/', (req: Request, res: Response): void => {
  const timeRange = (req.query.range as '7d' | '30d' | '90d') || '7d';

  const bookings = store.getBookings();
  const workers = store.getWorkers();
  const customers = store.getCustomers();

  const metrics = computeDashboardMetrics(bookings, workers, customers);
  const weeklyTrend = computeWeeklyTrend(bookings);
  const categoryBreakdown = computeCategoryBreakdown(bookings);

  const report: ReportsData = {
    timeRange,
    weeklyTrend,
    categoryBreakdown,
    metrics,
  };

  res.json(report);
});
