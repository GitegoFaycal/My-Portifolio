// Picks the storage backend:
//  - "vercel": when Upstash Redis + Vercel Blob env vars exist (production on Vercel)
//  - "file":   JSON files on disk (local development)
// Override with STORAGE=file|vercel.

const hasRedis = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
);
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

let mode = process.env.STORAGE;
if (!mode) mode = hasRedis && hasBlob ? 'vercel' : 'file';

if (mode === 'vercel') {
  if (!hasRedis) throw new Error('STORAGE=vercel needs UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL / KV_REST_API_TOKEN)');
  if (!hasBlob) throw new Error('STORAGE=vercel needs BLOB_READ_WRITE_TOKEN');
}

const storage = mode === 'vercel' ? await import('./vercelStore.js') : await import('./fileStore.js');

export const { get, set, saveUpload, name } = storage;
