import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import './BookingTable.css';

interface Column<T> {
  header: string;
  key: string;
  render?: (value: any, item: T) => ReactNode;
}

interface BookingTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
}

export default function BookingTable<T extends { id: string }>({ 
  columns, 
  data, 
  emptyMessage = 'No bookings found',
  totalCount,
  pageSize = 5,
  currentPage = 1
}: BookingTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="table-empty-state card">
        <div className="empty-illustration">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 48a12 12 0 1024 0M12 48a12 12 0 1124 0" />
            <path d="M40 48a12 12 0 1024 0M40 48a12 12 0 1124 0" />
            <path d="M24 48H40M32 48V36M32 36L20 20M32 36L44 20" />
          </svg>
        </div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="booking-table-wrapper card">
      <div className="table-header-row">
        {totalCount && (
          <div className="table-count text-label">{totalCount} bookings</div>
        )}
      </div>
      
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render((item as any)[col.key], item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount || data.length)} 
          {totalCount && ` of ${totalCount}`} entries
        </div>
        <div className="pagination-controls">
          <button className="btn-ghost" disabled={currentPage === 1}>
            <ChevronLeft size={16} />
            Previous
          </button>
          <button className="btn-ghost" disabled={true}>
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
