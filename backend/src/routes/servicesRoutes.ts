import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { ServiceItem } from '../types/index.js';

export const servicesRoutes = Router();

/**
 * GET /services
 */
servicesRoutes.get('/', (req: Request, res: Response): void => {
  const list = store.getServices();
  res.json(list);
});

/**
 * GET /services/:id
 */
servicesRoutes.get('/:id', (req: Request, res: Response): void => {
  const service = store.getServiceById(req.params.id);
  if (!service) {
    res.status(404).json({ error: 'Not Found', message: `Service ${req.params.id} not found.` });
    return;
  }
  res.json(service);
});

/**
 * POST /services
 */
servicesRoutes.post('/', (req: Request, res: Response): void => {
  const data = req.body || {};

  if (!data.name || !data.price) {
    res.status(400).json({ error: 'Bad Request', message: 'Service name and price are required.' });
    return;
  }

  const id = `SRV-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();

  const newService: ServiceItem = {
    id,
    name: data.name,
    category: data.category || 'Cleaning',
    description: data.description || 'Standardized professional service.',
    price: parseFloat(data.price),
    originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
    durationMinutes: parseInt(data.durationMinutes, 10) || 120,
    status: data.status || 'Active',
    image:
      data.image ||
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    includedItems: data.includedItems || ['Professional service delivery', 'Standard tools & materials'],
    features: data.features || ['Verified Pro', 'Quality Guarantee'],
    createdAt: now,
    updatedAt: now,
  };

  const saved = store.saveService(newService);

  store.addNotification({
    id: `notif_${Date.now()}`,
    title: 'New Service Created',
    message: `${saved.name} added to the active service catalog at ₹${saved.price}.`,
    type: 'system',
    read: false,
    timestamp: 'Just now',
    link: '/admin/services',
  });

  res.status(201).json(saved);
});

/**
 * PUT /services/:id
 */
servicesRoutes.put('/:id', (req: Request, res: Response): void => {
  const existing = store.getServiceById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Not Found', message: `Service ${req.params.id} not found.` });
    return;
  }

  const updated: ServiceItem = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  const saved = store.saveService(updated);
  res.json(saved);
});

/**
 * DELETE /services/:id
 */
servicesRoutes.delete('/:id', (req: Request, res: Response): void => {
  const deleted = store.deleteService(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Not Found', message: `Service ${req.params.id} not found.` });
    return;
  }
  res.json({ success: true, message: `Service ${req.params.id} deleted successfully.` });
});
