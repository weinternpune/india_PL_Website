import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { Customer } from '../types/index.js';

export const customersRoutes = Router();

/**
 * GET /customers
 */
customersRoutes.get('/', (req: Request, res: Response): void => {
  let list = store.getCustomers();
  const bookings = store.getBookings();

  // Attach dynamically calculated total bookings and spend
  list = list.map((c) => {
    const custBookings = bookings.filter((b) => b.customerId === c.customerId);
    const completed = custBookings.filter((b) => b.status === 'Completed').length;
    const cancelled = custBookings.filter((b) => b.status === 'Cancelled').length;
    const spent = custBookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      ...c,
      totalBookings: custBookings.length || c.totalBookings,
      completedBookings: completed || c.completedBookings,
      cancelledBookings: cancelled || c.cancelledBookings,
      totalSpent: spent || c.totalSpent,
    };
  });

  const { search } = req.query;
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.customerId.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

/**
 * GET /customers/:id
 */
customersRoutes.get('/:id', (req: Request, res: Response): void => {
  const customer = store.getCustomerById(req.params.id);
  if (!customer) {
    res.status(404).json({ error: 'Not Found', message: `Customer ${req.params.id} not found.` });
    return;
  }

  const customerBookings = store
    .getBookings()
    .filter((b) => b.customerId === customer.customerId);

  res.json({
    ...customer,
    bookings: customerBookings,
  });
});

/**
 * POST /customers
 */
customersRoutes.post('/', (req: Request, res: Response): void => {
  const data = req.body || {};
  const customerId = data.customerId || `CUST-${Math.floor(100 + Math.random() * 900)}`;

  const newCustomer: Customer = {
    customerId,
    name: data.name || 'Customer Name',
    phone: data.phone || '+91 98765 00000',
    email: data.email || `${customerId.toLowerCase()}@example.com`,
    avatar:
      data.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    isPremium: Boolean(data.isPremium),
    location: data.location || 'Bhubaneswar, Odisha',
    addresses: data.addresses || [],
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    status: data.status || 'Active',
    joinDate: new Date().toISOString().slice(0, 10),
  };

  const saved = store.saveCustomer(newCustomer);
  res.status(201).json(saved);
});

/**
 * PUT /customers/:id
 */
customersRoutes.put('/:id', (req: Request, res: Response): void => {
  const existing = store.getCustomerById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Not Found', message: `Customer ${req.params.id} not found.` });
    return;
  }

  const updated: Customer = {
    ...existing,
    ...req.body,
    customerId: existing.customerId,
  };

  const saved = store.saveCustomer(updated);
  res.json(saved);
});
