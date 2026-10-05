import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { NotificationItem } from '../types/index.js';

export const notificationsRoutes = Router();

/**
 * GET /notifications
 */
notificationsRoutes.get('/', (req: Request, res: Response): void => {
  const notifs = store.getNotifications();
  res.json(notifs);
});

/**
 * POST /notifications
 */
notificationsRoutes.post('/', (req: Request, res: Response): void => {
  const data = req.body || {};
  const notif: NotificationItem = {
    id: `notif_${Date.now()}`,
    title: data.title || 'System Notification',
    message: data.message || 'Notification details',
    type: data.type || 'system',
    read: false,
    timestamp: 'Just now',
    link: data.link,
  };

  const saved = store.addNotification(notif);
  res.status(201).json(saved);
});

/**
 * PATCH /notifications/:id/read
 */
notificationsRoutes.patch('/:id/read', (req: Request, res: Response): void => {
  const updated = store.markNotificationAsRead(req.params.id);
  if (!updated) {
    res.status(404).json({ error: 'Not Found', message: `Notification ${req.params.id} not found.` });
    return;
  }
  res.json({ success: true, message: 'Notification marked as read.' });
});

/**
 * DELETE /notifications
 */
notificationsRoutes.delete('/', (req: Request, res: Response): void => {
  store.clearAllNotifications();
  res.json({ success: true, message: 'All notifications cleared.' });
});
