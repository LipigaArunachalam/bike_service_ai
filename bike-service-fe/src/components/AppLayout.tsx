import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import './AppLayout.css';

const TITLE_MAP: Record<string, string> = {
  '/': 'Dashboard',
  '/book': 'Book a Service',
  '/bookings': 'My Bookings',
  '/admin': 'Admin Panel',
};

export default function AppLayout() {
  const location = useLocation();
  const pageTitle = TITLE_MAP[location.pathname] || 'RevUp';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <TopNavbar pageTitle={pageTitle} />
        <main className="app-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
