import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { Worker } from '../types/index.js';
import { computeWorkerRatingStats } from '../services/calculationsService.js';

export const workersRoutes = Router();

/**
 * GET /workers
 * Lists all service professionals with dynamic ratings computed from customer reviews
 */
workersRoutes.get('/', (req: Request, res: Response): void => {
  let list = store.getWorkers();
  const ratings = store.getRatings();

  // Attach real dynamically computed ratings
  list = list.map((w) => {
    const stats = computeWorkerRatingStats(ratings, w.workerId);
    return {
      ...w,
      rating: stats.averageRating,
      ratingCount: stats.ratingCount,
    };
  });

  const { availability, status, verificationStatus, search, category } = req.query;

  if (availability && typeof availability === 'string' && availability !== 'All') {
    list = list.filter((w) => w.availability === availability);
  }

  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter((w) => w.status === status);
  }

  if (verificationStatus && typeof verificationStatus === 'string' && verificationStatus !== 'All') {
    list = list.filter((w) => w.verificationStatus === verificationStatus);
  }

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter((w) => w.categories.includes(category as any));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.workerId.toLowerCase().includes(q) ||
        w.phone.includes(q) ||
        w.locationName.toLowerCase().includes(q) ||
        w.services.some((s) => s.toLowerCase().includes(q))
    );
  }

  res.json(list);
});

/**
 * GET /workers/:id
 */
workersRoutes.get('/:id', (req: Request, res: Response): void => {
  const worker = store.getWorkerById(req.params.id);
  if (!worker) {
    res.status(404).json({ error: 'Not Found', message: `Worker ${req.params.id} not found.` });
    return;
  }

  const ratings = store.getRatings().filter((r) => r.workerId === worker.workerId);
  const stats = computeWorkerRatingStats(ratings, worker.workerId);

  res.json({
    ...worker,
    rating: stats.averageRating,
    ratingCount: stats.ratingCount,
    ratings,
  });
});

/**
 * POST /workers
 * Registers new pro applicant
 */
workersRoutes.post('/', (req: Request, res: Response): void => {
  const data = req.body || {};

  const workerId = data.workerId || `WRK-${Math.floor(200 + Math.random() * 800)}`;
  const newWorker: Worker = {
    workerId,
    name: data.name || 'New Service Professional',
    phone: data.phone || '+91 98765 00000',
    email: data.email || `${workerId.toLowerCase()}@indiapl.pro`,
    profileImage:
      data.profileImage ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    services: data.services || ['Residential Cleaning'],
    categories: data.categories || ['Cleaning'],
    latitude: data.latitude || 20.2961,
    longitude: data.longitude || 85.8245,
    locationName: data.locationName || 'Bhubaneswar Hub',
    availability: data.availability || 'Offline',
    status: data.status || 'Pending Verification',
    verificationStatus: data.verificationStatus || 'Pending',
    rating: 0,
    ratingCount: 0,
    completedJobs: 0,
    cancellationCount: 0,
    experienceYears: data.experienceYears || 2,
    documents: data.documents || [],
    joinedDate: new Date().toISOString().slice(0, 10),
    recentBookingIds: [],
    bankDetails: data.bankDetails || {
      accountNumber: 'XXXX-XXXX-0000',
      ifscCode: 'SBIN0001000',
      bankName: 'State Bank of India',
      accountHolder: data.name || 'Pro Name',
      lifetimeEarnings: 0,
    },
  };

  const saved = store.saveWorker(newWorker);

  store.addNotification({
    id: `notif_${Date.now()}`,
    title: 'New Pro Applicant',
    message: `${saved.name} submitted KYC documents for onboarding verification.`,
    type: 'worker',
    read: false,
    timestamp: 'Just now',
    link: `/admin/workers/${saved.workerId}`,
  });

  res.status(201).json(saved);
});

/**
 * PUT /workers/:id
 */
workersRoutes.put('/:id', (req: Request, res: Response): void => {
  const existing = store.getWorkerById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Not Found', message: `Worker ${req.params.id} not found.` });
    return;
  }

  const updated: Worker = {
    ...existing,
    ...req.body,
    workerId: existing.workerId, // Immutable ID
  };

  const saved = store.saveWorker(updated);
  res.json(saved);
});

/**
 * PATCH /workers/:id/toggle-availability
 */
workersRoutes.patch('/:id/toggle-availability', (req: Request, res: Response): void => {
  const worker = store.getWorkerById(req.params.id);
  if (!worker) {
    res.status(404).json({ error: 'Not Found', message: `Worker ${req.params.id} not found.` });
    return;
  }

  const nextAv: Record<string, 'Available' | 'Busy' | 'Offline'> = {
    Available: 'Busy',
    Busy: 'Offline',
    Offline: 'Available',
  };

  worker.availability = nextAv[worker.availability] || 'Available';
  store.saveWorker(worker);
  res.json(worker);
});

/**
 * POST /workers/:id/approve
 */
workersRoutes.post('/:id/approve', (req: Request, res: Response): void => {
  const worker = store.getWorkerById(req.params.id);
  if (!worker) {
    res.status(404).json({ error: 'Not Found', message: `Worker ${req.params.id} not found.` });
    return;
  }

  worker.verificationStatus = 'Verified';
  worker.status = 'Active';
  worker.availability = 'Available';
  if (worker.documents) {
    worker.documents = worker.documents.map((d) => ({ ...d, verified: true }));
  }

  store.saveWorker(worker);

  store.addNotification({
    id: `notif_${Date.now()}`,
    title: 'Worker Verified',
    message: `${worker.name} (${worker.workerId}) verified and activated into live fleet.`,
    type: 'worker',
    read: false,
    timestamp: 'Just now',
    link: `/admin/workers/${worker.workerId}`,
  });

  res.json(worker);
});

/**
 * POST /workers/:id/reject
 */
workersRoutes.post('/:id/reject', (req: Request, res: Response): void => {
  const worker = store.getWorkerById(req.params.id);
  if (!worker) {
    res.status(404).json({ error: 'Not Found', message: `Worker ${req.params.id} not found.` });
    return;
  }

  worker.verificationStatus = 'Rejected';
  worker.status = 'Suspended';
  worker.availability = 'Offline';

  store.saveWorker(worker);
  res.json(worker);
});
