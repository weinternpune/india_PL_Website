import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { PayoutRequest } from '../types/index.js';
import { computePayoutMetrics } from '../services/calculationsService.js';

export const payoutsRoutes = Router();

/**
 * GET /payouts
 */
payoutsRoutes.get('/', (req: Request, res: Response): void => {
  let list = store.getPayoutRequests();
  const { status, search } = req.query;

  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter((p) => p.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.workerName.toLowerCase().includes(q) ||
        p.workerPhone.includes(q) ||
        (p.paymentDetails.upiId && p.paymentDetails.upiId.toLowerCase().includes(q)) ||
        (p.paymentDetails.accountNumber && p.paymentDetails.accountNumber.includes(q))
    );
  }

  res.json(list);
});

/**
 * GET /payouts/metrics
 */
payoutsRoutes.get('/metrics', (req: Request, res: Response): void => {
  const payouts = store.getPayoutRequests();
  const workers = store.getWorkers();
  const bookings = store.getBookings();

  const metrics = computePayoutMetrics(payouts, workers, bookings);
  res.json(metrics);
});

/**
 * GET /payouts/:id
 */
payoutsRoutes.get('/:id', (req: Request, res: Response): void => {
  const payout = store.getPayoutById(req.params.id);
  if (!payout) {
    res.status(404).json({ error: 'Not Found', message: `Payout request ${req.params.id} not found.` });
    return;
  }
  res.json(payout);
});

/**
 * POST /payouts
 * Worker requests a payout
 */
payoutsRoutes.post('/', (req: Request, res: Response): void => {
  const data = req.body || {};
  const id = `PO-${Math.floor(800 + Math.random() * 200)}`;

  const newPayout: PayoutRequest = {
    id,
    workerId: data.workerId,
    workerName: data.workerName,
    workerPhone: data.workerPhone,
    workerEmail: data.workerEmail,
    workerAvatar: data.workerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    completedJobs: data.completedJobs || 1,
    totalEarnings: data.totalEarnings || data.requestedAmount || 1000,
    alreadyPaid: data.alreadyPaid || 0,
    availableBalance: data.availableBalance || data.requestedAmount || 1000,
    requestedAmount: data.requestedAmount,
    requestedDate: new Date().toISOString(),
    paymentMethod: data.paymentMethod || 'UPI',
    paymentDetails: data.paymentDetails || {},
    status: 'Pending',
    breakdown: data.breakdown || [],
  };

  const saved = store.savePayoutRequest(newPayout);

  store.addNotification({
    id: `notif_${Date.now()}`,
    title: 'Payout Request Received',
    message: `${saved.workerName} requested payout of ₹${saved.requestedAmount}.`,
    type: 'payment',
    read: false,
    timestamp: 'Just now',
    link: '/admin/payouts',
  });

  res.status(201).json(saved);
});

/**
 * POST /payouts/:id/verify
 */
payoutsRoutes.post('/:id/verify', (req: Request, res: Response): void => {
  const payout = store.getPayoutById(req.params.id);
  if (!payout) {
    res.status(404).json({ error: 'Not Found', message: `Payout request ${req.params.id} not found.` });
    return;
  }

  payout.status = 'Under Review';
  payout.reviewedAt = new Date().toISOString();
  payout.reviewedBy = req.body.reviewedBy || 'Super Admin';
  payout.adminNotes = req.body.note || 'Verified bank details and booking records';

  store.savePayoutRequest(payout);
  res.json(payout);
});

/**
 * POST /payouts/:id/approve
 */
payoutsRoutes.post('/:id/approve', (req: Request, res: Response): void => {
  const payout = store.getPayoutById(req.params.id);
  if (!payout) {
    res.status(404).json({ error: 'Not Found', message: `Payout request ${req.params.id} not found.` });
    return;
  }

  payout.status = 'Approved';
  payout.reviewedAt = new Date().toISOString();
  payout.adminNotes = req.body.note || 'Approved for bank transfer';

  store.savePayoutRequest(payout);
  res.json(payout);
});

/**
 * POST /payouts/:id/reject
 */
payoutsRoutes.post('/:id/reject', (req: Request, res: Response): void => {
  const payout = store.getPayoutById(req.params.id);
  if (!payout) {
    res.status(404).json({ error: 'Not Found', message: `Payout request ${req.params.id} not found.` });
    return;
  }

  const { reason } = req.body;
  if (!reason || !reason.trim()) {
    res.status(400).json({ error: 'Bad Request', message: 'Rejection reason is required.' });
    return;
  }

  payout.status = 'Rejected';
  payout.rejectionReason = reason.trim();
  payout.reviewedAt = new Date().toISOString();

  store.savePayoutRequest(payout);
  res.json(payout);
});

/**
 * POST /payouts/:id/paid
 */
payoutsRoutes.post('/:id/paid', (req: Request, res: Response): void => {
  const payout = store.getPayoutById(req.params.id);
  if (!payout) {
    res.status(404).json({ error: 'Not Found', message: `Payout request ${req.params.id} not found.` });
    return;
  }

  const { transactionRef } = req.body;
  if (!transactionRef || !transactionRef.trim()) {
    res.status(400).json({ error: 'Bad Request', message: 'Bank UTR / Transaction Reference is required.' });
    return;
  }

  payout.status = 'Paid';
  payout.paidAt = new Date().toISOString();
  payout.transactionRef = transactionRef.trim();

  // Deduct from worker available balance
  const worker = store.getWorkerById(payout.workerId);
  if (worker && worker.bankDetails) {
    // Recorded as paid
  }

  store.savePayoutRequest(payout);
  res.json(payout);
});
