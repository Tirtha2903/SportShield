import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Toast }   from './components/Toast';
import { useToast } from './hooks/useToast';
import Dashboard from './pages/Dashboard';
import Assets    from './pages/Assets';
import Flags     from './pages/Flags';

const PAGE_META = {
  '/':       { title: 'Dashboard',              subtitle: 'Overview of your digital asset protection status' },
  '/assets': { title: 'Assets',                 subtitle: 'Manage and register your official sports media' },
  '/flags':  { title: 'Unauthorized Use Reports', subtitle: 'Track and resolve media misappropriation reports' },
};

export default function App() {
  const { toasts, addToast } = useToast();
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { title: 'SportShield', subtitle: '' };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        {/* Top Bar */}
        <header className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            <div className="topbar-subtitle">{meta.subtitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: 'var(--accent-green)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
              System Online
            </span>
          </div>
        </header>

        {/* Pages */}
        <Routes>
          <Route path="/"       element={<Dashboard />} />
          <Route path="/assets" element={<Assets addToast={addToast} />} />
          <Route path="/flags"  element={<Flags  addToast={addToast} />} />
          <Route path="*"       element={
            <div className="page">
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>404 — Page not found</p>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            </div>
          } />
        </Routes>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
