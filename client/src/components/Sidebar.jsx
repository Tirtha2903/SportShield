import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',       icon: '📊', label: 'Dashboard' },
  { to: '/assets', icon: '🖼️',  label: 'Assets' },
  { to: '/flags',  icon: '🚩',  label: 'Flags' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🛡️</div>
        <span className="logo-text">SportShield</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>SportShield v1.0</p>
        <p style={{ marginTop: 4 }}>Google Solutions Challenge</p>
      </div>
    </aside>
  );
}
