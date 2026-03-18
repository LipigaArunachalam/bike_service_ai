import { LayoutDashboard, Wrench, ClipboardList, Settings, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Wrench size={20} />, label: 'Book a Service', path: '/book' },
    { icon: <ClipboardList size={20} />, label: 'My Bookings', path: '/bookings' },
  ];

  return (
    <>
      <button className="mobile-menu-toggle" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-header mobile-only">
          <div className="logo-group">RevUp</div>
          <button className="close-sidebar" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {user?.role === 'admin' && (
            <div className="nav-group admin-group">
              <NavLink 
                to="/admin" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon"><Settings size={20} /></span>
                <span className="nav-label">Admin Panel</span>
                <span className="admin-badge">Admin</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="divider"></div>
          <div className="user-profile-card">
            <div className="user-avatar-footer">
              {user?.name.charAt(0)}
            </div>
            <div className="user-info">
              <div className="profile-name">{user?.name}</div>
              <div className="profile-role">{user?.role}</div>
            </div>
            <button className="footer-settings-btn">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}
