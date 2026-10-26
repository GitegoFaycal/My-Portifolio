// Local development storage: one JSON file per key inside backend/data/.
import fs from 'fs/promises';
import path from 'path';
import { DATA_DIR, UPLOADS_DIR } from '../paths.js';

let writeChain = Promise.resolve();

const fileFor = (key) => path.join(DATA_DIR, `${key}.json`);

export async function get(key, fallback) {
  try {
    return JSON.parse(await fs.readFile(fileFor(key), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    throw err;
  }
}

export function set(key, value) {
  writeChain = writeChain.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const file = fileFor(key);
    await fs.writeFile(`${file}.tmp`, JSON.stringify(value, null, 2) + '\n', 'utf8');
    await fs.rename(`${file}.tmp`, file);
  });
  return writeChain;
}

export async function saveUpload(file, filename) {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, filename), file.buffer);
  return `/uploads/${filename}`;
}

export const name = 'file';
