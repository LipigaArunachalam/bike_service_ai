import { useState } from 'react';
import { useBookings, type BookingStatus } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import BookingTable from '../components/BookingTable';
import StatusChip from '../components/StatusChip';
import ConfirmModal from '../components/ConfirmModal';
import EditBookingModal from '../components/EditBookingModal';
import { Search, Download, Trash2, Edit, ChevronDown, XCircle } from 'lucide-react';
import './AdminPanel.css';

export default function AdminPanel() {
  const { bookings, updateStatus, updateBooking, deleteBooking } = useBookings();
  const { addToast } = useToast();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editBooking, setEditBooking] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.userName.toLowerCase().includes(search.toLowerCase()) || 
                         b.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase().replace(' ', '-');
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await updateStatus(id, newStatus);
    addToast(
      newStatus === 'cancelled' ? 'warning' : 'success', 
      'Status Updated', 
      `Booking status changed to ${newStatus.replace('-', ' ')}.`
    );
  };

  const handleEditClick = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setEditBooking(booking);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (id: string, data: { serviceDate: string; notes: string }) => {
    const success = await updateBooking(id, data);
    if (success) {
      addToast('success', 'Booking Updated', 'The service details have been updated.');
    } else {
      addToast('error', 'Update Failed', 'Could not update booking details.');
    }
  };

  const handleCancelQuick = async (id: string) => {
    await updateStatus(id, 'cancelled');
    addToast('warning', 'Booking Cancelled', 'The service booking has been marked as cancelled.');
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBooking(deleteId);
      addToast('error', 'Booking Deleted', 'The service booking has been removed.');
      setDeleteId(null);
    }
  };

  const columns = [
    { 
      header: 'User', 
      key: 'userName',
      render: (_: any, item: any) => (
        <div className="user-cell">
          <div className="user-avatar-small">{item.userName.charAt(0)}</div>
          <div className="user-info">
            <div className="user-name">{item.userName}</div>
            <div className="user-email">{item.userEmail}</div>
          </div>
        </div>
      )
    },
    { header: 'Service', key: 'service' },
    { header: 'Date', key: 'serviceDate' },
    { 
      header: 'Status', 
      key: 'status',
      render: (status: BookingStatus, item: any) => (
        <div className="status-dropdown-wrapper">
          <div className="current-status">
            <StatusChip status={status} />
          </div>
          <select 
            className="status-select-overlay"
            value={status}
            onChange={(e) => handleStatusChange(item.id, e.target.value as BookingStatus)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={12} className="dropdown-arrow" />
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'id',
      render: (id: string) => (
        <div className="action-buttons">
          <button 
            className="icon-btn" 
            title="Edit"
            onClick={() => handleEditClick(id)}
          >
            <Edit size={16} />
          </button>
          <button 
            className="icon-btn warning" 
            title="Cancel Appointment"
            onClick={() => handleCancelQuick(id)}
          >
            <XCircle size={16} />
          </button>
          <button 
            className="icon-btn danger" 
            title="Delete" 
            onClick={() => setDeleteId(id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-panel-page animate-in">
      <header className="page-header admin-header">
        <div className="header-title-group">
          <h1 className="text-page-title">Admin Panel</h1>
          <span className="admin-badge large">Admin</span>
        </div>
        <div className="header-actions">
          <div className="filter-chips admin-filters">
            {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(status => (
              <button
                key={status}
                className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search user or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-ghost export-btn">
            <Download size={16} />
            <span className="desktop-only">Export</span>
          </button>
        </div>
      </header>

      <div className="admin-content">
        <BookingTable 
          columns={columns} 
          data={filteredBookings}
          totalCount={filteredBookings.length}
          emptyMessage="No matching bookings found."
        />
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Booking?"
        message="This action cannot be undone. All data related to this service booking will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <EditBookingModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        booking={editBooking}
      />
    </div>
  );
}
