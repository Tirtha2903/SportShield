import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getFlags, getAssetStats, getFlagStats } from '../api';

export default function Dashboard() {
  const [assetStats, setAssetStats] = useState(null);
  const [flagStats,  setFlagStats]  = useState(null);
  const [recentAssets, setRecentAssets] = useState([]);
  const [recentFlags,  setRecentFlags]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [as, fs, a, f] = await Promise.all([
          getAssetStats(), getFlagStats(), getAssets(), getFlags(),
        ]);
        setAssetStats(as.data);
        setFlagStats(fs.data);
        setRecentAssets(a.data.slice(0, 5));
        setRecentFlags(f.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="loader"><div className="spinner" /> Loading dashboard…</div>
  );

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero-banner">
        <h1>Digital Asset Protection Dashboard</h1>
        <p>
          Monitor, track, and protect your official sports media assets across the internet.
          Register assets, flag unauthorized uses, and stay in control.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Assets</div>
          <div className="stat-value blue">{assetStats?.total ?? 0}</div>
          <div className="stat-icon">🖼️</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Active</div>
          <div className="stat-value green">{assetStats?.active ?? 0}</div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Flagged Assets</div>
          <div className="stat-value red">{assetStats?.flagged ?? 0}</div>
          <div className="stat-icon">🚩</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Pending Reports</div>
          <div className="stat-value amber">{flagStats?.pending ?? 0}</div>
          <div className="stat-icon">⏳</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Total Reports</div>
          <div className="stat-value purple">{flagStats?.total ?? 0}</div>
          <div className="stat-icon">📋</div>
        </div>
      </div>

      {/* Recent Assets */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header">
          <span className="section-title">🖼️ Recent Assets</span>
          <Link to="/assets" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="card">
          {recentAssets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🖼️</div>
              <p>No assets registered yet. <Link to="/assets" style={{ color: 'var(--accent-blue)' }}>Register your first asset →</Link></p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Organization</th>
                    <th>Status</th>
                    <th>Fingerprint</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssets.map(a => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 600 }}>{a.title}</td>
                      <td style={{ textTransform: 'capitalize' }}>{a.assetType}</td>
                      <td>{a.organization || '—'}</td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td><span className="fingerprint">{a.fingerprint?.slice(0, 12)}…</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Flags */}
      <div>
        <div className="section-header">
          <span className="section-title">🚩 Recent Flags</span>
          <Link to="/flags" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="card">
          {recentFlags.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚩</div>
              <p>No unauthorized use reports yet.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Suspected URL</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFlags.map(f => (
                    <tr key={f._id}>
                      <td style={{ fontWeight: 600 }}>{f.asset?.title ?? '—'}</td>
                      <td>
                        <a href={f.suspectedUrl} target="_blank" rel="noreferrer"
                          style={{ color: 'var(--accent-cyan)', fontSize: 12 }}>
                          {f.suspectedUrl.length > 40 ? f.suspectedUrl.slice(0, 40) + '…' : f.suspectedUrl}
                        </a>
                      </td>
                      <td><span className={`badge badge-${f.severity}`}>{f.severity}</span></td>
                      <td><span className={`badge badge-${f.resolvedStatus}`}>{f.resolvedStatus}</span></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                        {new Date(f.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
