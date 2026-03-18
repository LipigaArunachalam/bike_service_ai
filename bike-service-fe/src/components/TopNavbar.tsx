import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import './TopNavbar.css';

export default function TopNavbar({ pageTitle }: { pageTitle: string }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationRef, () => setShowNotifications(false));
  useClickOutside(userMenuRef, () => setShowDropdown(false));

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(data.data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const hasUnread = notifications.some(n => !n.isRead);

  const handleProfileClick = () => {
    console.log("View Profile clicked");
    setShowDropdown(false);
    navigate('/profile');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showDropdown) setShowDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowDropdown(!showDropdown);
    if (showNotifications) setShowNotifications(false);
  };

  return (
    <nav className="top-navbar">
      <div className="top-navbar__left">
        <div className="logo-group">
          <div className="logo-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="28" stroke="#F97316" strokeWidth="4"/>
              <circle cx="32" cy="32" r="8" stroke="#F97316" strokeWidth="3"/>
              <line x1="32" y1="4" x2="32" y2="24" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
              <line x1="32" y1="40" x2="32" y2="60" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
              <line x1="4" y1="32" x2="24" y2="32" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
              <line x1="40" y1="32" x2="60" y2="32" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">RevUp</span>
        </div>
        <div className="breadcrumb desktop-only">
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="top-navbar__right">
        <div className="notification-wrapper" ref={notificationRef}>
          <button 
            className={`notification-btn ${showNotifications ? 'active' : ''}`} 
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            {hasUnread && <span className="notification-dot"></span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown card-elevated">
              <div className="notification-header">
                <h3>Notifications</h3>
                <span className="mark-read" onClick={markAllAsRead}>Mark all as read</span>
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif._id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
                      <div className={`notification-icon ${notif.type}`}></div>
                      <div className="notification-content">
                        <p className="notification-text">{notif.text}</p>
                        <span className="notification-time">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">No new notifications</div>
                )}
              </div>
              <button className="view-all-btn">View All Notifications</button>
            </div>
          )}
        </div>

        <div className="user-menu-wrapper" ref={userMenuRef}>
          <button 
            className="user-pill" 
            onClick={toggleProfileDropdown}
          >
            <div className="user-avatar-small">
              <span>{user?.name.charAt(0)}</span>
            </div>
            <span className="user-name desktop-only">{user?.name}</span>
            <ChevronDown size={14} className={showDropdown ? 'rotate-180' : ''} />
          </button>

          {showDropdown && (
            <div className="user-dropdown card-elevated">
              <button className="dropdown-item" onClick={handleProfileClick}>
                <User size={16} />
                <span>View Profile</span>
              </button>
              <button className="dropdown-item logout" onClick={logout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
