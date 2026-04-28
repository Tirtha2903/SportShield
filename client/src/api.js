import axios from 'axios';

// In production (Vercel), set VITE_API_URL to your deployed backend URL.
// Example: https://your-sportshield-api.railway.app
// In local dev, falls back to '/api' which Vite proxies to localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

// ── Demo / Mock data (shown when backend is unreachable) ──────
const MOCK_ASSETS = [
  {
    _id: 'mock-1',
    title: 'FIFA World Cup Highlights 2024',
    assetType: 'video',
    organization: 'FIFA Media',
    status: 'active',
    fingerprint: 'sha256-4a9c2ef1b83d7a01',
    tags: ['football', 'world-cup', 'official'],
    originalUrl: 'https://www.fifa.com',
    description: 'Official match highlights reel for the 2024 World Cup tournament.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    _id: 'mock-2',
    title: 'NBA Finals Game 7 Photo Pack',
    assetType: 'image',
    organization: 'NBA Photos',
    status: 'flagged',
    fingerprint: 'sha256-7b3c1de09a45f82c',
    tags: ['basketball', 'nba', 'finals'],
    originalUrl: 'https://www.nba.com',
    description: 'High-resolution photography from Game 7 of the NBA Finals.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    _id: 'mock-3',
    title: 'Wimbledon 2024 Official Logo',
    assetType: 'image',
    organization: 'AELTC',
    status: 'verified',
    fingerprint: 'sha256-c91e4d072b5a8f33',
    tags: ['tennis', 'wimbledon', 'logo'],
    originalUrl: 'https://www.wimbledon.com',
    description: 'Official event branding assets for Wimbledon 2024.',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    _id: 'mock-4',
    title: 'Premier League Match Day Audio',
    assetType: 'audio',
    organization: 'Premier League',
    status: 'active',
    fingerprint: 'sha256-d02f5c9b1e7a4631',
    tags: ['football', 'premier-league', 'audio'],
    originalUrl: 'https://www.premierleague.com',
    description: 'Licensed commentary and ambient match audio.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: 'mock-5',
    title: 'Olympics Paris 2024 Press Kit',
    assetType: 'document',
    organization: 'IOC',
    status: 'archived',
    fingerprint: 'sha256-ef830b2c6d91a547',
    tags: ['olympics', 'paris', 'press'],
    originalUrl: 'https://www.olympics.com',
    description: 'Complete press and media kit for Paris 2024 Olympic Games.',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
];

const MOCK_FLAGS = [
  {
    _id: 'flag-1',
    asset: { _id: 'mock-2', title: 'NBA Finals Game 7 Photo Pack', assetType: 'image' },
    suspectedUrl: 'https://example-blog.com/nba-stolen-photos',
    reportedBy: 'Legal Team',
    severity: 'high',
    resolvedStatus: 'confirmed',
    notes: 'Unauthorized use detected on third-party sports blog without licensing.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    _id: 'flag-2',
    asset: { _id: 'mock-1', title: 'FIFA World Cup Highlights 2024', assetType: 'video' },
    suspectedUrl: 'https://piracy-site.net/fifa-highlights',
    reportedBy: 'Auto-Scanner',
    severity: 'high',
    resolvedStatus: 'pending',
    notes: 'Full highlight video reuploaded without permission.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    _id: 'flag-3',
    asset: { _id: 'mock-3', title: 'Wimbledon 2024 Official Logo', assetType: 'image' },
    suspectedUrl: 'https://sports-merch.shop/wimbledon-logo-tshirt',
    reportedBy: 'Community Report',
    severity: 'medium',
    resolvedStatus: 'pending',
    notes: 'Logo used on unlicensed merchandise store.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    _id: 'flag-4',
    asset: { _id: 'mock-4', title: 'Premier League Match Day Audio', assetType: 'audio' },
    suspectedUrl: 'https://random-podcast.fm/pl-audio',
    reportedBy: 'Rights Holder',
    severity: 'low',
    resolvedStatus: 'dismissed',
    notes: 'Short clip used under fair-use commentary — dismissed.',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

const MOCK_ASSET_STATS = {
  total: 5,
  active: 2,
  flagged: 1,
  verified: 1,
  archived: 1,
};

const MOCK_FLAG_STATS = {
  total: 4,
  pending: 2,
  confirmed: 1,
  dismissed: 1,
};

// Helper: wrap an API call and fall back to mock data on failure
async function withFallback(apiFn, mockData) {
  try {
    const res = await apiFn();
    return res;
  } catch {
    // Return in the same shape as axios response
    return { data: mockData };
  }
}

// ── Assets ──────────────────────────────────────────────────
export const getAssets     = ()         => withFallback(() => api.get('/assets'),              MOCK_ASSETS);
export const getAsset      = (id)       => withFallback(() => api.get(`/assets/${id}`),        MOCK_ASSETS.find(a => a._id === id) ?? null);
export const createAsset   = (data)     => api.post('/assets', data);
export const updateAsset   = (id, data) => api.put(`/assets/${id}`, data);
export const deleteAsset   = (id)       => api.delete(`/assets/${id}`);
export const getAssetStats = ()         => withFallback(() => api.get('/assets/stats/summary'), MOCK_ASSET_STATS);

// ── Flags ────────────────────────────────────────────────────
export const getFlags      = ()         => withFallback(() => api.get('/flags'),               MOCK_FLAGS);
export const createFlag    = (data)     => api.post('/flags', data);
export const updateFlag    = (id, data) => api.put(`/flags/${id}`, data);
export const deleteFlag    = (id)       => api.delete(`/flags/${id}`);
export const getFlagStats  = ()         => withFallback(() => api.get('/flags/stats/summary'), MOCK_FLAG_STATS);

export default api;
