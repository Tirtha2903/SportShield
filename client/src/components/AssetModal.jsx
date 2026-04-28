import { useState } from 'react';
import { createAsset } from '../api';

const ASSET_TYPES = ['image', 'video', 'document', 'audio', 'other'];

export function AssetModal({ onClose, onCreated, addToast }) {
  const [form, setForm] = useState({
    title: '', description: '', assetType: 'image',
    originalUrl: '', organization: '', tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.originalUrl.trim()) {
      addToast('Title and Original URL are required.', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      await createAsset(payload);
      addToast('Asset registered successfully!', 'success');
      onCreated();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to register asset.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">🖼️ Register New Asset</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Asset Title *</label>
            <input id="asset-title" name="title" className="form-input"
              placeholder="e.g. FIFA World Cup 2024 Opening Ceremony" value={form.title} onChange={handle} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Asset Type</label>
              <select id="asset-type" name="assetType" className="form-select" value={form.assetType} onChange={handle}>
                {ASSET_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Organization</label>
              <input id="asset-org" name="organization" className="form-input"
                placeholder="e.g. FIFA, IPL, NBA" value={form.organization} onChange={handle} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Original URL *</label>
            <input id="asset-url" name="originalUrl" className="form-input"
              placeholder="https://official-source.com/media/asset" value={form.originalUrl} onChange={handle} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea id="asset-desc" name="description" className="form-textarea"
              placeholder="Brief description of the asset..." value={form.description} onChange={handle} />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input id="asset-tags" name="tags" className="form-input"
              placeholder="e.g. football, 2024, official" value={form.tags} onChange={handle} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button id="asset-submit" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Registering...' : '✅ Register Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
