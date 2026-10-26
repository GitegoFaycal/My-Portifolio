import * as storage from './storage/index.js';
import seed from '../data/portfolio.json' with { type: 'json' };

export { DATA_DIR, UPLOADS_DIR } from './paths.js';
export const storageName = storage.name;

export const SECTIONS = [
  'profile',
  'about',
  'skills',
  'experience',
  'education',
  'certifications',
  'projects',
  'settings',
];

// Content. On a fresh store (e.g. first deploy) it is seeded from data/portfolio.json.
export async function getPortfolio() {
  const data = await storage.get('portfolio', null);
  if (data) return data;
  await storage.set('portfolio', seed);
  return seed;
}

export async function updateSection(section, value) {
  const data = await getPortfolio();
  data[section] = value;
  await storage.set('portfolio', data);
  return data[section];
}

// Contact-form messages
export const getMessages = () => storage.get('messages', []);

export async function addMessage(message) {
  const list = await getMessages();
  list.unshift(message);
  await storage.set('messages', list);
  return message;
}

export async function updateMessage(id, patch) {
  const list = await getMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  await storage.set('messages', list);
  return list[idx];
}

export async function deleteMessage(id) {
  const list = await getMessages();
  const next = list.filter((m) => m.id !== id);
  if (next.length === list.length) return false;
  await storage.set('messages', next);
  return true;
}

// Admin credentials
export const getAuth = () => storage.get('auth', null);
export const saveAuth = (value) => storage.set('auth', value);

// Uploaded files: returns the URL to store in the content
export const saveUpload = (file, filename) => storage.saveUpload(file, filename);
