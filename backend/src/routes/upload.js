import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { saveUpload } from '../store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
};

// Vercel serverless functions accept request bodies up to 4.5 MB.
const MAX_SIZE = 4 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    cb(new Error('Only JPG, PNG, WEBP, GIF images or PDF files are allowed'));
  },
});

router.post('/', requireAuth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 4 MB)' : err.message;
      return res.status(400).json({ error: message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
      const ext = ALLOWED[req.file.mimetype] || path.extname(req.file.originalname).toLowerCase();
      const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
      const url = await saveUpload(req.file, filename);
      res.status(201).json({ url });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
});

export default router;
