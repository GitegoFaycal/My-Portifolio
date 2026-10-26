// Normalise VITE_API_URL: trim, drop trailing slash, and add https:// if the scheme was left out
// (otherwise the browser would treat "example.vercel.app" as a relative path on the website itself).
export const API_BASE = (() => {
  const raw = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
})();
const TOKEN_KEY = 'portfolio_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

/** Turns a stored path like /uploads/x.jpg into a full URL for the current API base. */
export function assetUrl(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${API_BASE}${path}`;
}

async function request(path, { method = 'GET', body, auth = false, formData } = {}) {
  const headers = {};
  if (!formData) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData ? formData : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  if (!isJson && res.ok) {
    throw new Error(
      API_BASE
        ? `The API at ${API_BASE} did not return JSON. Check that VITE_API_URL points to the backend.`
        : 'VITE_API_URL is not set, so the website cannot reach the backend. Set it to your backend URL and redeploy.'
    );
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  getPortfolio: () => request('/api/portfolio'),
  getSection: (section) => request(`/api/portfolio/${section}`),
  saveSection: (section, value) => request(`/api/portfolio/${section}`, { method: 'PUT', body: value, auth: true }),

  login: (username, password) => request('/api/auth/login', { method: 'POST', body: { username, password } }),
  me: () => request('/api/auth/me', { auth: true }),
  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/password', { method: 'PUT', body: { currentPassword, newPassword }, auth: true }),

  sendMessage: (payload) => request('/api/messages', { method: 'POST', body: payload }),
  getMessages: () => request('/api/messages', { auth: true }),
  markMessage: (id, read) => request(`/api/messages/${id}`, { method: 'PATCH', body: { read }, auth: true }),
  deleteMessage: (id) => request(`/api/messages/${id}`, { method: 'DELETE', auth: true }),

  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/upload', { method: 'POST', formData, auth: true });
  },
};
