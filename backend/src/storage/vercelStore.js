// Production storage for Vercel: Upstash Redis for content, Vercel Blob for uploaded files.
// Both are added from the Vercel dashboard (Storage tab) which injects the env vars used below.
import { Redis } from '@upstash/redis';
import { put } from '@vercel/blob';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis = new Redis({ url, token });
const PREFIX = process.env.REDIS_PREFIX || 'portfolio:';

export async function get(key, fallback) {
  const value = await redis.get(PREFIX + key);
  return value === null || value === undefined ? fallback : value;
}

export async function set(key, value) {
  await redis.set(PREFIX + key, value);
}

export async function saveUpload(file, filename) {
  const blob = await put(`uploads/${filename}`, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
    addRandomSuffix: false,
  });
  return blob.url;
}

export const name = 'vercel';
