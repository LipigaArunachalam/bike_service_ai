import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type BookingStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  service: string;
  dateBooked: string;
  serviceDate: string;
  notes: string;
  status: BookingStatus;
};

interface BookingContextType {
  bookings: Booking[];
  isLoading: boolean;
  addBooking: (booking: Omit<Booking, 'id' | 'dateBooked' | 'status'>) => Promise<boolean>;
  updateStatus: (id: string, status: BookingStatus) => Promise<void>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<boolean>;
  deleteBooking: (id: string) => Promise<void>;
  getUserBookings: (userId: string) => Booking[];
  fetchBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!token) {
      setBookings([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const endpoint = user?.role === 'admin' ? '/api/admin/bookings' : '/api/bookings';
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setBookings(data.data.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const addBooking = async (data: Omit<Booking, 'id' | 'dateBooked' | 'status'>): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service: data.service,
          serviceDate: data.serviceDate,
          notes: data.notes
        })
      });
      
      if (response.ok) {
        await fetchBookings();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create booking', error);
      return false;
    }
  };
  const updateStatus = async (id: string, status: BookingStatus) => {
    await updateBooking(id, { status });
  };
  
  const updateBooking = async (id: string, data: Partial<Booking>): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const result = await response.json();
        const updatedBooking = result.data.booking;
        setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update booking', error);
      return false;
    }
  };

  const deleteBooking = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete booking', error);
    }
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(b => b.userId === userId);
  };

  return (
    <BookingContext.Provider value={{ bookings, isLoading, addBooking, updateStatus, updateBooking, deleteBooking, getUserBookings, fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
}
