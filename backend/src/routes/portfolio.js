import { Router } from 'express';
import { getPortfolio, updateSection, SECTIONS } from '../store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  res.json(await getPortfolio());
});

router.get('/:section', async (req, res) => {
  const { section } = req.params;
  if (!SECTIONS.includes(section)) return res.status(404).json({ error: 'Unknown section' });
  const data = await getPortfolio();
  res.json(data[section] ?? null);
});

router.put('/:section', requireAuth, async (req, res) => {
  const { section } = req.params;
  if (!SECTIONS.includes(section)) return res.status(404).json({ error: 'Unknown section' });
  if (req.body === undefined || req.body === null) {
    return res.status(400).json({ error: 'Request body is required' });
  }
  const saved = await updateSection(section, req.body);
  res.json(saved);
});

export default router;
