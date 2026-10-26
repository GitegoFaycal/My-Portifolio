import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { UPLOADS_DIR, DATA_DIR } from './store.js';
import authRoutes, { ensureAdmin } from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import messageRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env and set it.');
  process.exit(1);
}

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: origins }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '1d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

ensureAdmin().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
