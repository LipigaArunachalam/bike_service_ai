import type { BookingStatus } from '../context/BookingContext';

const STATUS_MAP = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
};

export default function StatusChip({ status }: { status: BookingStatus }) {
  return (
    <span className={`status-chip ${status}`}>
      {STATUS_MAP[status]}
    </span>
  );
}
