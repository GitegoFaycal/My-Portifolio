import { Router } from 'express';
import crypto from 'crypto';
import { getMessages, addMessage, updateMessage, deleteMessage } from '../store.js';
import { requireAuth } from '../middleware/auth.js';
import { notifyNewMessage } from '../mailer.js';

const router = Router();

// Public: contact form submissions
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }
  const saved = await addMessage({
    id: crypto.randomUUID(),
    name: name.trim().slice(0, 120),
    email: email.trim().slice(0, 200),
    subject: (subject || '').trim().slice(0, 200),
    message: message.trim().slice(0, 5000),
    read: false,
    createdAt: new Date().toISOString(),
  });
  // Forward the message to the owner's email. The message is already in the inbox,
  // so an email failure is logged but does not fail the request.
  let emailed = false;
  try {
    emailed = await notifyNewMessage(saved);
  } catch (err) {
    console.error('Could not email contact message:', err.message);
  }
  res.status(201).json({ ok: true, id: saved.id, emailed });
});

// Admin: inbox
router.get('/', requireAuth, async (_req, res) => {
  res.json(await getMessages());
});

router.patch('/:id', requireAuth, async (req, res) => {
  const updated = await updateMessage(req.params.id, { read: Boolean(req.body?.read) });
  if (!updated) return res.status(404).json({ error: 'Message not found' });
  res.json(updated);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const ok = await deleteMessage(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Message not found' });
  res.json({ ok: true });
});

export default router;
