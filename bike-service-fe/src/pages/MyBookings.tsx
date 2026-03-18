import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import BookingTable from '../components/BookingTable';
import StatusChip from '../components/StatusChip';
import './MyBookings.css';

export default function MyBookings() {
  const { user } = useAuth();
  const { getUserBookings } = useBookings();
  const [activeFilter, setActiveFilter] = useState('All');

  const userBookings = getUserBookings(user?.id || '');
  
  const filteredBookings = userBookings.filter(b => {
    if (activeFilter === 'All') return true;
    return b.status.replace('-', ' ').toLowerCase() === activeFilter.toLowerCase();
  });

  const columns = [
    { header: 'Service Name', key: 'service' },
    { header: 'Date Booked', key: 'dateBooked' },
    { header: 'Service Date', key: 'serviceDate' },
    { 
      header: 'Status', 
      key: 'status',
      render: (status: any) => <StatusChip status={status} />
    },
    {
      header: 'Actions',
      key: 'id',
      render: () => (
        <button className="btn-ghost">View Details</button>
      )
    }
  ];

  const filters = ['All', 'Pending', 'In-Progress', 'Completed'];

  return (
    <div className="my-bookings-page animate-in">
      <header className="page-header bookings-header">
        <h1 className="text-page-title">My Bookings</h1>
        <div className="filter-chips">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      <div className="bookings-content">
        <BookingTable 
          columns={columns} 
          data={filteredBookings}
          totalCount={filteredBookings.length}
          emptyMessage={`No ${activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} bookings found.`}
        />
      </div>
    </div>
  );
}
