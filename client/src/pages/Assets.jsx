import { useEffect, useState } from 'react';
import { getAssets, deleteAsset } from '../api';
import { AssetModal } from '../components/AssetModal';

const STATUS_COLORS = { active: 'green', flagged: 'red', verified: 'blue', archived: '' };

export default function Assets({ addToast }) {
  const [assets, setAssets]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAssets();
      setAssets(res.data);
    } catch {
      addToast('Failed to load assets.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this asset? This cannot be undone.')) return;
    try {
      await deleteAsset(id);
      addToast('Asset deleted.', 'success');
      load();
    } catch {
      addToast('Failed to delete asset.', 'error');
    }
  };

  const filtered = assets.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.organization || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🖼️ Registered Assets</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            All your protected digital sports media in one place.
          </p>
        </div>
        <button id="open-register-asset" className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Register Asset
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          id="asset-search"
          className="form-input"
          style={{ maxWidth: 280, flex: 1 }}
          placeholder="🔍 Search by title or organization…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {['all', 'active', 'flagged', 'verified', 'archived'].map(s => (
          <button
            key={s}
            id={`filter-${s}`}
            className={`btn btn-ghost btn-sm${filter === s ? ' active' : ''}`}
            style={filter === s ? { borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' } : {}}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /> Loading assets…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <p>{search || filter !== 'all' ? 'No assets match your filter.' : 'No assets yet. Register your first one!'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Fingerprint</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
                      {a.description && (
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                          {a.description.slice(0, 50)}{a.description.length > 50 ? '…' : ''}
                        </div>
                      )}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{a.assetType}</td>
                    <td>{a.organization || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                    <td>
                      {a.tags?.length > 0 ? (
                        <div className="tags">
                          {a.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                          {a.tags.length > 3 && <span className="tag">+{a.tags.length - 3}</span>}
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td><span className="fingerprint">{a.fingerprint?.slice(0, 13)}…</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-cell">
                        <a href={a.originalUrl} target="_blank" rel="noreferrer"
                          className="btn btn-ghost btn-sm" title="View original">🔗</a>
                        <button className="btn btn-danger btn-sm" title="Delete"
                          onClick={() => handleDelete(a._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AssetModal
          onClose={() => setShowModal(false)}
          onCreated={load}
          addToast={addToast}
        />
      )}
    </div>
  );
}
