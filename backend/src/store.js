import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, '..', 'data');
export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

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

// Simple JSON-file persistence with a write queue so concurrent saves never interleave.
let writeChain = Promise.resolve();

async function readJson(file, fallback) {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    throw err;
  }
}

function writeJson(file, value) {
  writeChain = writeChain.then(async () => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
    await fs.rename(tmp, file);
  });
  return writeChain;
}

export const getPortfolio = () => readJson(PORTFOLIO_FILE, {});

export async function updateSection(section, value) {
  const data = await getPortfolio();
  data[section] = value;
  await writeJson(PORTFOLIO_FILE, data);
  return data[section];
}

export const getMessages = () => readJson(MESSAGES_FILE, []);

export async function addMessage(message) {
  const list = await getMessages();
  list.unshift(message);
  await writeJson(MESSAGES_FILE, list);
  return message;
}

export async function updateMessage(id, patch) {
  const list = await getMessages();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  await writeJson(MESSAGES_FILE, list);
  return list[idx];
}

export async function deleteMessage(id) {
  const list = await getMessages();
  const next = list.filter((m) => m.id !== id);
  if (next.length === list.length) return false;
  await writeJson(MESSAGES_FILE, next);
  return true;
}

export const getAuth = () => readJson(AUTH_FILE, null);
export const saveAuth = (value) => writeJson(AUTH_FILE, value);
