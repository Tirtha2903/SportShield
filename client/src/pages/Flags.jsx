import { useEffect, useState } from 'react';
import { getFlags, getAssets, updateFlag, deleteFlag } from '../api';
import { FlagModal } from '../components/FlagModal';

export default function Flags({ addToast }) {
  const [flags,   setFlags]   = useState([]);
  const [assets,  setAssets]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter,  setFilter]  = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [f, a] = await Promise.all([getFlags(), getAssets()]);
      setFlags(f.data);
      setAssets(a.data);
    } catch {
      addToast('Failed to load flags.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, resolvedStatus) => {
    try {
      await updateFlag(id, { resolvedStatus });
      addToast(`Flag marked as ${resolvedStatus}.`, 'success');
      load();
    } catch {
      addToast('Failed to update flag.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flag report?')) return;
    try {
      await deleteFlag(id);
      addToast('Flag deleted.', 'success');
      load();
    } catch {
      addToast('Failed to delete flag.', 'error');
    }
  };

  const filtered = flags.filter(f =>
    filter === 'all' ? true : f.resolvedStatus === filter
  );

  return (
    <div className="page">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🚩 Unauthorized Use Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Track, review, and resolve reports of unauthorized media use.
          </p>
        </div>
        <button id="open-report-flag" className="btn btn-danger" onClick={() => setShowModal(true)}>
          + Report Unauthorized Use
        </button>
      </div>

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'dismissed'].map(s => (
          <button
            key={s}
            id={`flag-filter-${s}`}
            className={`btn btn-ghost btn-sm${filter === s ? ' active' : ''}`}
            style={filter === s ? { borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' } : {}}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? '📋 All' : s === 'pending' ? '⏳ Pending' : s === 'confirmed' ? '🔴 Confirmed' : '✅ Dismissed'}
            {s !== 'all' && (
              <span style={{
                marginLeft: 6, background: 'rgba(255,255,255,0.08)',
                borderRadius: '999px', padding: '1px 7px', fontSize: 10
              }}>
                {flags.filter(f => f.resolvedStatus === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /> Loading reports…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚩</div>
            <p>{filter !== 'all' ? 'No reports with this status.' : 'No unauthorized use reports yet.'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Asset</th>
                  <th>Suspected URL</th>
                  <th>Reported By</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={f._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{f.asset?.title ?? <span style={{ color: 'var(--text-muted)' }}>Deleted</span>}</div>
                      {f.asset?.assetType && (
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                          {f.asset.assetType}
                        </div>
                      )}
                    </td>
                    <td>
                      <a href={f.suspectedUrl} target="_blank" rel="noreferrer"
                        style={{ color: 'var(--accent-cyan)', fontSize: 12, wordBreak: 'break-all' }}>
                        {f.suspectedUrl.length > 45 ? f.suspectedUrl.slice(0, 45) + '…' : f.suspectedUrl}
                      </a>
                      {f.notes && (
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
                          {f.notes.slice(0, 50)}{f.notes.length > 50 ? '…' : ''}
                        </div>
                      )}
                    </td>
                    <td>{f.reportedBy || <span style={{ color: 'var(--text-muted)' }}>Anonymous</span>}</td>
                    <td><span className={`badge badge-${f.severity}`}>{f.severity}</span></td>
                    <td><span className={`badge badge-${f.resolvedStatus}`}>{f.resolvedStatus}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-cell" style={{ flexWrap: 'wrap' }}>
                        {f.resolvedStatus === 'pending' && (
                          <>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => handleStatus(f._id, 'confirmed')} title="Confirm violation">
                              🔴 Confirm
                            </button>
                            <button className="btn btn-ghost btn-sm"
                              onClick={() => handleStatus(f._id, 'dismissed')} title="Dismiss">
                              ✅ Dismiss
                            </button>
                          </>
                        )}
                        {f.resolvedStatus === 'confirmed' && (
                          <button className="btn btn-ghost btn-sm"
                            onClick={() => handleStatus(f._id, 'dismissed')} title="Dismiss">
                            ✅ Dismiss
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => handleDelete(f._id)} title="Delete">🗑️</button>
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
        <FlagModal
          assets={assets}
          onClose={() => setShowModal(false)}
          onCreated={load}
          addToast={addToast}
        />
      )}
    </div>
  );
}
