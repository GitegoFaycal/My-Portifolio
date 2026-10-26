import express from 'express';
import cors from 'cors';
import { UPLOADS_DIR, storageName } from './store.js';
import authRoutes, { ensureAdmin } from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import messageRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Copy .env.example to .env and set it.');
}

const app = express();

const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / server-to-server requests (no Origin header), listed origins, and Vercel preview URLs.
      if (!origin || origins.includes(origin) || origins.includes('*')) return cb(null, true);
      if (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && /\.vercel\.app$/.test(new URL(origin).hostname)) return cb(null, true);
      cb(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);
app.use(express.json({ limit: '2mb' }));

// Files bundled with the backend (local uploads in development, seed images in production).
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '1d' }));

// Make sure the admin account exists before handling any request (runs once per process).
const ready = ensureAdmin().catch((err) => {
  console.error('Failed to initialise admin account', err);
  throw err;
});
app.use((_req, _res, next) => {
  ready.then(() => next(), next);
});

app.get('/api/health', (_req, res) => res.json({ ok: true, storage: storageName }));
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.message?.includes('CORS') ? 403 : 500).json({ error: err.message || 'Something went wrong' });
});

export default app;
