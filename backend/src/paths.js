import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.join(__dirname, '..');
export const DATA_DIR = path.join(ROOT_DIR, 'data');
export const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
