import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAuth, saveAuth } from '../store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Creates data/auth.json from the .env credentials on first run.
export async function ensureAdmin() {
  const existing = await getAuth();
  if (existing) return;
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  await saveAuth({ username, passwordHash });
  console.log(`Admin account created for "${username}" from .env`);
}

function signToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const auth = await getAuth();
  const ok = auth && auth.username === username && (await bcrypt.compare(password, auth.passwordHash));
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' });
  res.json({ token: signToken(auth.username), user: { username: auth.username } });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.user.username } });
});

router.put('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  const auth = await getAuth();
  if (!(await bcrypt.compare(currentPassword, auth.passwordHash))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  auth.passwordHash = await bcrypt.hash(newPassword, 10);
  await saveAuth(auth);
  res.json({ ok: true });
});

export default router;
