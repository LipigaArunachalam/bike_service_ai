import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import CardStats from '../components/CardStats';
import BookingTable from '../components/BookingTable';
import StatusChip from '../components/StatusChip';
import { ClipboardList, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings, getUserBookings } = useBookings();

  const userBookings = user?.role === 'admin' ? bookings : getUserBookings(user?.id || '');
  const recentBookings = userBookings.slice(0, 5);

  const stats = [
    {
      eyebrow: 'Total Bookings',
      value: userBookings.length,
      subLabel: 'All time',
      icon: <ClipboardList size={20} />,
      accentColor: 'var(--accent-blue)',
    },
    {
      eyebrow: 'Pending Services',
      value: userBookings.filter(b => b.status === 'pending').length,
      subLabel: 'Awaiting action',
      icon: <Clock size={20} />,
      accentColor: 'var(--color-warning)',
    },
    {
      eyebrow: 'Completed Services',
      value: userBookings.filter(b => b.status === 'completed').length,
      subLabel: 'Finished',
      icon: <CheckCircle2 size={20} />,
      accentColor: 'var(--color-success)',
    },
  ];

  const columns = [
    { header: 'Service', key: 'service' },
    { header: 'Date', key: 'serviceDate' },
    { 
      header: 'Status', 
      key: 'status',
      render: (status: any) => <StatusChip status={status} />
    },
    {
      header: 'Action',
      key: 'id',
      render: (id: string) => (
        <Link to={`/bookings?id=${id}`} className="btn-ghost">View</Link>
      )
    }
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-page animate-in">
      <header className="page-header">
        <div className="header-content">
          <h1 className="text-display">{greeting()}, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-label">Here's your service overview for today.</p>
        </div>
        <div className="header-date text-label">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <CardStats key={stat.eyebrow} {...stat} delay={i * 60} />
        ))}
      </div>

      <div className="dashboard-main">
        <div className="section-header">
          <h2 className="text-eyebrow">Recent Bookings</h2>
          <Link to="/bookings" className="view-all-link">View all →</Link>
        </div>
        
        <BookingTable 
          columns={columns} 
          data={recentBookings} 
          emptyMessage="No recent bookings found. Schedule your first service today!"
        />
      </div>
    </div>
  );
}
