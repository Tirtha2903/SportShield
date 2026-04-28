import axios from 'axios';

// In production (Vercel), set VITE_API_URL to your deployed backend URL.
// Example: https://your-sportshield-api.railway.app
// In local dev, falls back to '/api' which Vite proxies to localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Assets ──────────────────────────────────────────────────
export const getAssets    = ()        => api.get('/assets');
export const getAsset     = (id)      => api.get(`/assets/${id}`);
export const createAsset  = (data)    => api.post('/assets', data);
export const updateAsset  = (id, data)=> api.put(`/assets/${id}`, data);
export const deleteAsset  = (id)      => api.delete(`/assets/${id}`);
export const getAssetStats= ()        => api.get('/assets/stats/summary');

// ── Flags ────────────────────────────────────────────────────
export const getFlags     = ()        => api.get('/flags');
export const createFlag   = (data)    => api.post('/flags', data);
export const updateFlag   = (id, data)=> api.put(`/flags/${id}`, data);
export const deleteFlag   = (id)      => api.delete(`/flags/${id}`);
export const getFlagStats = ()        => api.get('/flags/stats/summary');

export default api;
