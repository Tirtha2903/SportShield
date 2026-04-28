import { useState } from 'react';
import { createFlag } from '../api';

export function FlagModal({ assets, onClose, onCreated, addToast }) {
  const [form, setForm] = useState({
    asset: '', suspectedUrl: '', reportedBy: '', notes: '', severity: 'medium',
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.asset || !form.suspectedUrl.trim()) {
      addToast('Asset and Suspected URL are required.', 'error');
      return;
    }
    setLoading(true);
    try {
      await createFlag(form);
      addToast('Unauthorized use reported!', 'success');
      onCreated();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to submit report.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">🚩 Report Unauthorized Use</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Select Asset *</label>
            <select id="flag-asset" name="asset" className="form-select" value={form.asset} onChange={handle}>
              <option value="">-- Choose an asset --</option>
              {assets.map(a => (
                <option key={a._id} value={a._id}>{a.title} ({a.assetType})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Suspected Unauthorized URL *</label>
            <input id="flag-url" name="suspectedUrl" className="form-input"
              placeholder="https://example.com/stolen-content" value={form.suspectedUrl} onChange={handle} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reported By</label>
              <input id="flag-reporter" name="reportedBy" className="form-input"
                placeholder="Your name / team" value={form.reportedBy} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Severity</label>
              <select id="flag-severity" name="severity" className="form-select" value={form.severity} onChange={handle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea id="flag-notes" name="notes" className="form-textarea"
              placeholder="Additional context about the unauthorized usage..." value={form.notes} onChange={handle} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button id="flag-submit" type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? '⏳ Submitting...' : '🚩 Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
