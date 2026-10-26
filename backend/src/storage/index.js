// Picks the storage backend:
//  - "vercel": when Upstash Redis + Vercel Blob env vars exist (production on Vercel)
//  - "file":   JSON files on disk (local development)
// Override with STORAGE=file|vercel.

const hasRedis = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
);
// Vercel sets BLOB_READ_WRITE_TOKEN (static token) and/or BLOB_STORE_ID (OIDC) when a Blob store is connected.
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

let mode = process.env.STORAGE;
if (!mode) mode = hasRedis && hasBlob ? 'vercel' : 'file';

if (mode === 'vercel') {
  if (!hasRedis) throw new Error('STORAGE=vercel needs UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL / KV_REST_API_TOKEN)');
  if (!hasBlob) throw new Error('STORAGE=vercel needs a connected Vercel Blob store (BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID)');
}

// On Vercel the filesystem is read-only, so file storage cannot work there.
// Instead of crashing with EROFS, explain what is missing on every request.
let storage;
if (mode === 'vercel') {
  storage = await import('./vercelStore.js');
} else if (process.env.VERCEL) {
  const missing = [
    !hasRedis && 'Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN)',
    !hasBlob && 'a PUBLIC Vercel Blob store (BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID)',
  ].filter(Boolean);
  const message = `Storage is not configured on Vercel. In the Vercel dashboard open this project → Storage → Create Database and connect: ${missing.join(' and ')}. Then redeploy.`;
  console.error(message);
  const fail = () => Promise.reject(Object.assign(new Error(message), { status: 503 }));
  storage = { get: fail, set: fail, saveUpload: fail, name: 'not-configured' };
} else {
  storage = await import('./fileStore.js');
}

export const { get, set, saveUpload, name } = storage;
