import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { Booking, BookingStatus } from '../types/index.js';
import { findNearestAvailableWorkers } from '../services/gpsService.js';

export const bookingsRoutes = Router();

/**
 * GET /bookings
 * Lists all customer bookings with optional filtering and search
 */
bookingsRoutes.get('/', (req: Request, res: Response): void => {
  let list = store.getBookings();

  const { status, search, limit, page } = req.query;

  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter((b) => b.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (b) =>
        b.bookingId.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        (b.assignedWorkerName && b.assignedWorkerName.toLowerCase().includes(q)) ||
        b.customerLocation.address.toLowerCase().includes(q)
    );
  }

  // Sort descending by creation date
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (limit && typeof limit === 'string') {
    const lim = parseInt(limit, 10);
    const p = page && typeof page === 'string' ? parseInt(page, 10) : 1;
    const start = (p - 1) * lim;
    list = list.slice(start, start + lim);
  }

  res.json(list);
});

/**
 * GET /bookings/:id
 */
bookingsRoutes.get('/:id', (req: Request, res: Response): void => {
  const booking = store.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Not Found', message: `Booking ${req.params.id} not found.` });
    return;
  }
  res.json(booking);
});

/**
 * POST /bookings
 * Creates a new booking from customer app or operations simulator
 */
bookingsRoutes.post('/', (req: Request, res: Response): void => {
  const data = req.body || {};

  const bookingId = data.bookingId || `#${Date.now().toString().slice(-4)}`;
  const nowStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newBooking: Booking = {
    bookingId,
    customerId: data.customerId || 'CUST-101',
    customerName: data.customerName || 'Anonymous Customer',
    customerPhone: data.customerPhone || '+91 98765 43210',
    customerEmail: data.customerEmail || 'customer@indiapl.com',
    customerAvatar:
      data.customerAvatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    serviceId: data.serviceId || 'SRV-01',
    serviceName: data.serviceName || 'Residential Cleaning',
    serviceCategory: data.serviceCategory || 'Cleaning',
    selectedServices: data.selectedServices || [{ name: data.serviceName || 'Residential Cleaning', price: data.totalAmount || 297 }],
    customerLocation: data.customerLocation || {
      latitude: 20.3180,
      longitude: 85.8270,
      address: 'Patia, Bhubaneswar',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751024',
    },
    date: data.date || `Today, ${nowStr.split(',')[0]}`,
    timeSlot: data.timeSlot || '10:00 AM - 01:00 PM',
    estimatedDuration: data.estimatedDuration || '3 Hours',
    subtotal: data.subtotal || data.totalAmount || 297,
    convenienceFee: data.convenienceFee || 19,
    totalAmount: data.totalAmount || 316,
    status: data.status || 'Pending',
    paymentMethod: data.paymentMethod || 'UPI',
    paymentStatus: data.paymentStatus || 'Pending',
    history: data.history || [
      { status: 'Pending', timestamp: nowStr, note: 'Booking registered' },
    ],
    dispatchLog: data.dispatchLog || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedWorkerId: data.assignedWorkerId,
    assignedWorkerName: data.assignedWorkerName,
    assignedWorkerPhone: data.assignedWorkerPhone,
    assignedWorkerAvatar: data.assignedWorkerAvatar,
    assignedWorkerRating: data.assignedWorkerRating,
    workerDistance: data.workerDistance,
  };

  const saved = store.saveBooking(newBooking);

  // Send admin notification
  store.addNotification({
    id: `notif_${Date.now()}`,
    title: `New Booking ${saved.bookingId}`,
    message: `${saved.customerName} booked ${saved.serviceName} at ${saved.customerLocation.city}.`,
    type: 'booking',
    read: false,
    timestamp: 'Just now',
    link: `/admin/bookings/${saved.bookingId}`,
  });

  res.status(201).json(saved);
});

/**
 * PATCH /bookings/:id/status
 */
bookingsRoutes.patch('/:id/status', (req: Request, res: Response): void => {
  const { status, note } = req.body;
  const booking = store.getBookingById(req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Not Found', message: `Booking ${req.params.id} not found.` });
    return;
  }

  if (!status) {
    res.status(400).json({ error: 'Bad Request', message: 'Status field is required.' });
    return;
  }

  const nowStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  booking.status = status as BookingStatus;
  booking.updatedAt = new Date().toISOString();
  booking.history.push({
    status: status as BookingStatus,
    timestamp: nowStr,
    note: note || `Status updated to ${status}`,
  });

  // If completed, update worker stats
  if (status === 'Completed' && booking.assignedWorkerId) {
    const worker = store.getWorkerById(booking.assignedWorkerId);
    if (worker) {
      worker.completedJobs += 1;
      worker.availability = 'Available';
      if (!worker.bankDetails) {
        worker.bankDetails = {
          accountNumber: 'XXXX-XXXX-0000',
          ifscCode: 'HDFC0001000',
          bankName: 'HDFC Bank',
          accountHolder: worker.name,
          lifetimeEarnings: Math.round(booking.totalAmount * 0.75),
        };
      } else {
        worker.bankDetails.lifetimeEarnings =
          (worker.bankDetails.lifetimeEarnings || 0) + Math.round(booking.totalAmount * 0.75);
      }
      store.saveWorker(worker);
    }
  }

  const updated = store.saveBooking(booking);
  res.json(updated);
});

/**
 * POST /bookings/:id/auto-dispatch
 * Automatic Haversine GPS Nearest Worker Assignment Engine
 */
bookingsRoutes.post('/:id/auto-dispatch', (req: Request, res: Response): void => {
  const booking = store.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Not Found', message: `Booking ${req.params.id} not found.` });
    return;
  }

  const workers = store.getWorkers();
  const customerLat = booking.customerLocation.latitude;
  const customerLng = booking.customerLocation.longitude;

  // Extract workers who already rejected this specific booking
  const rejectedWorkerIds = (booking.dispatchLog || [])
    .filter((log) => log.action === 'Rejected' || log.action === 'Timed Out')
    .map((log) => log.workerId);

  const candidates = findNearestAvailableWorkers(
    customerLat,
    customerLng,
    booking.serviceCategory || booking.serviceName,
    workers,
    rejectedWorkerIds
  );

  if (candidates.length === 0) {
    res.json({
      success: false,
      message: 'No available verified workers found within range for this category.',
    });
    return;
  }

  const nearest = candidates[0];
  const nowStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  booking.assignedWorkerId = nearest.worker.workerId;
  booking.assignedWorkerName = nearest.worker.name;
  booking.assignedWorkerPhone = nearest.worker.phone;
  booking.assignedWorkerAvatar = nearest.worker.profileImage;
  booking.assignedWorkerRating = nearest.worker.rating;
  booking.workerDistance = nearest.distanceKm;
  booking.status = 'Worker Notified';
  booking.updatedAt = new Date().toISOString();

  if (!booking.dispatchLog) booking.dispatchLog = [];
  booking.dispatchLog.push({
    attemptNumber: booking.dispatchLog.length + 1,
    workerId: nearest.worker.workerId,
    workerName: nearest.worker.name,
    distanceKm: nearest.distanceKm,
    action: 'Notified',
    timestamp: nowStr,
  });

  booking.history.push({
    status: 'Worker Notified',
    timestamp: nowStr,
    note: `Automated Haversine match: Assigned to ${nearest.worker.name} (${nearest.distanceKm} km away)`,
  });

  store.saveBooking(booking);

  res.json({
    success: true,
    message: `Nearest worker ${nearest.worker.name} (${nearest.distanceKm} km away) dispatched.`,
    worker: nearest.worker,
    distance: nearest.distanceKm,
    booking,
  });
});

/**
 * POST /bookings/:id/worker-response
 * Simulates worker accepting or declining the job prompt
 */
bookingsRoutes.post('/:id/worker-response', (req: Request, res: Response): void => {
  const { accepted } = req.body;
  const booking = store.getBookingById(req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Not Found', message: `Booking ${req.params.id} not found.` });
    return;
  }

  const nowStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (accepted) {
    booking.status = 'Accepted';
    booking.history.push({
      status: 'Accepted',
      timestamp: nowStr,
      note: `Professional ${booking.assignedWorkerName} accepted the booking.`,
    });

    if (booking.dispatchLog && booking.dispatchLog.length > 0) {
      booking.dispatchLog[booking.dispatchLog.length - 1].action = 'Accepted';
    }

    // Set worker to Busy
    if (booking.assignedWorkerId) {
      const worker = store.getWorkerById(booking.assignedWorkerId);
      if (worker) {
        worker.availability = 'Busy';
        store.saveWorker(worker);
      }
    }

    store.saveBooking(booking);

    res.json({
      success: true,
      message: `Worker ${booking.assignedWorkerName} accepted booking ${booking.bookingId}.`,
      booking,
    });
  } else {
    // Rejected: record refusal and automatically cascade to next nearest pro
    const declinedWorkerName = booking.assignedWorkerName;
    const declinedWorkerId = booking.assignedWorkerId;

    if (booking.dispatchLog && booking.dispatchLog.length > 0) {
      booking.dispatchLog[booking.dispatchLog.length - 1].action = 'Rejected';
    }

    booking.history.push({
      status: 'Finding Worker',
      timestamp: nowStr,
      note: `Worker ${declinedWorkerName} declined. Cascading to next nearest pro...`,
    });

    // Auto-cascade matching
    const workers = store.getWorkers();
    const rejectedIds = (booking.dispatchLog || []).map((l) => l.workerId);
    if (declinedWorkerId && !rejectedIds.includes(declinedWorkerId)) {
      rejectedIds.push(declinedWorkerId);
    }

    const nextCandidates = findNearestAvailableWorkers(
      booking.customerLocation.latitude,
      booking.customerLocation.longitude,
      booking.serviceCategory || booking.serviceName,
      workers,
      rejectedIds
    );

    if (nextCandidates.length > 0) {
      const next = nextCandidates[0];
      booking.assignedWorkerId = next.worker.workerId;
      booking.assignedWorkerName = next.worker.name;
      booking.assignedWorkerPhone = next.worker.phone;
      booking.assignedWorkerAvatar = next.worker.profileImage;
      booking.assignedWorkerRating = next.worker.rating;
      booking.workerDistance = next.distanceKm;
      booking.status = 'Worker Notified';

      booking.dispatchLog.push({
        attemptNumber: booking.dispatchLog.length + 1,
        workerId: next.worker.workerId,
        workerName: next.worker.name,
        distanceKm: next.distanceKm,
        action: 'Notified',
        timestamp: nowStr,
      });

      booking.history.push({
        status: 'Worker Notified',
        timestamp: nowStr,
        note: `Cascaded to 2nd nearest pro: ${next.worker.name} (${next.distanceKm} km away)`,
      });
    } else {
      booking.status = 'Finding Worker';
      booking.assignedWorkerId = undefined;
      booking.assignedWorkerName = undefined;
      booking.assignedWorkerPhone = undefined;
      booking.assignedWorkerAvatar = undefined;
      booking.workerDistance = undefined;
    }

    store.saveBooking(booking);

    res.json({
      success: true,
      message: `Worker declined. ${
        nextCandidates.length > 0
          ? `Automatically cascaded to ${booking.assignedWorkerName}.`
          : 'No more active candidates in range.'
      }`,
      booking,
    });
  }
});
