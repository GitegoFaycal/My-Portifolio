// Pushes the content of data/portfolio.json to a deployed backend (e.g. on Vercel),
// where content lives in Redis and is only seeded from the JSON file on the very first run.
//
// Usage (from the backend folder, works in PowerShell, cmd and bash):
//   node scripts/sync-content.mjs --api-url=https://<your-backend>.vercel.app --username=admin --password=...
//   node scripts/sync-content.mjs --sections=about,skills      # only some sections
//   node scripts/sync-content.mjs --dry-run                     # show what would change
//
// Instead of the flags you can set API_URL, ADMIN_USERNAME and ADMIN_PASSWORD in the
// environment; the username and password fall back to the values in .env. The profile photo,
// CV link, projects and settings that were changed from the dashboard are kept.

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const flag = a.replace(/^--/, '');
    const eq = flag.indexOf('=');
    return eq === -1 ? [flag, true] : [flag.slice(0, eq), flag.slice(eq + 1)];
  })
);

const rawUrl = args['api-url'] || process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
const API_URL = (/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`).replace(/\/+$/, '');
const username = args.username || process.env.ADMIN_USERNAME;
const password = args.password || process.env.ADMIN_PASSWORD;
if (!username || !password) {
  console.error('Pass --username=... --password=... (or set ADMIN_USERNAME / ADMIN_PASSWORD in the environment or .env).');
  process.exit(1);
}

const DEFAULT_SECTIONS = ['profile', 'about', 'skills', 'experience', 'education', 'certifications'];
const sections = (args.sections ? args.sections.split(',') : DEFAULT_SECTIONS).map((s) => s.trim()).filter(Boolean);
const dryRun = 'dry-run' in args;

const seed = JSON.parse(await readFile(path.join(here, '..', 'data', 'portfolio.json'), 'utf8'));

async function call(route, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${route}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${method} ${route} -> ${res.status}: ${data?.error || 'request failed'}`);
  return data;
}

console.log(`Target: ${API_URL}`);
const { token } = await call('/api/auth/login', { method: 'POST', body: { username, password } });
const current = await call('/api/portfolio');

for (const section of sections) {
  if (!(section in seed)) {
    console.warn(`- ${section}: not in portfolio.json, skipped`);
    continue;
  }
  let value = seed[section];
  if (section === 'profile') {
    // Keep uploads made from the dashboard.
    value = { ...value, photo: current.profile?.photo || value.photo, resumeUrl: current.profile?.resumeUrl || value.resumeUrl };
  }
  const unchanged = JSON.stringify(current[section]) === JSON.stringify(value);
  if (unchanged) {
    console.log(`- ${section}: already up to date`);
    continue;
  }
  if (dryRun) {
    console.log(`- ${section}: would update`);
    continue;
  }
  await call(`/api/portfolio/${section}`, { method: 'PUT', body: value, token });
  console.log(`- ${section}: updated`);
}
console.log(dryRun ? 'Dry run finished.' : 'Done.');
