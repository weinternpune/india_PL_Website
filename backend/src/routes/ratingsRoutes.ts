import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { WorkerRating } from '../types/index.js';
import { computeWorkerRatingStats } from '../services/calculationsService.js';

export const ratingsRoutes = Router();

/**
 * GET /ratings
 */
ratingsRoutes.get('/', (req: Request, res: Response): void => {
  const { workerId, bookingId } = req.query;
  let list = store.getRatings();

  if (workerId && typeof workerId === 'string') {
    list = list.filter((r) => r.workerId === workerId);
  }

  if (bookingId && typeof bookingId === 'string') {
    list = list.filter((r) => r.bookingId === bookingId);
  }

  res.json(list);
});

/**
 * GET /ratings/worker/:workerId
 */
ratingsRoutes.get('/worker/:workerId', (req: Request, res: Response): void => {
  const ratings = store.getRatings().filter((r) => r.workerId === req.params.workerId);
  const stats = computeWorkerRatingStats(ratings, req.params.workerId);

  res.json({
    ...stats,
    ratings,
  });
});

/**
 * POST /ratings
 * Customer submits a new rating
 */
ratingsRoutes.post('/', (req: Request, res: Response): void => {
  const { bookingId, customerId, customerName, workerId, rating, review } = req.body;

  if (!workerId || !rating) {
    res.status(400).json({ error: 'Bad Request', message: 'Worker ID and numeric rating (1-5) are required.' });
    return;
  }

  const numRating = Math.max(1, Math.min(5, Number(rating)));

  const newRating: WorkerRating = {
    id: `RAT-${Date.now().toString().slice(-4)}`,
    bookingId: bookingId || `#${Date.now().toString().slice(-4)}`,
    customerId: customerId || 'CUST-101',
    customerName: customerName || 'Verified Customer',
    workerId,
    rating: numRating,
    review: review || '',
    createdAt: new Date().toISOString(),
  };

  const saved = store.addRating(newRating);

  // Recalculate worker rating
  const worker = store.getWorkerById(workerId);
  if (worker) {
    const allWorkerRatings = store.getRatings().filter((r) => r.workerId === workerId);
    const stats = computeWorkerRatingStats(allWorkerRatings, workerId);
    worker.rating = stats.averageRating;
    worker.ratingCount = stats.ratingCount;
    store.saveWorker(worker);
  }

  res.status(201).json(saved);
});
