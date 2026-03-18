import { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, Save } from 'lucide-react';
import type { Booking } from '../context/BookingContext';
import './EditBookingModal.css';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: { serviceDate: string; notes: string }) => Promise<void>;
  booking: Booking | null;
}

export default function EditBookingModal({ isOpen, onClose, onSave, booking }: EditBookingModalProps) {
  const [serviceDate, setServiceDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setServiceDate(booking.serviceDate);
      setNotes(booking.notes || '');
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(booking.id, { serviceDate, notes });
      onClose();
    } catch (error) {
      console.error('Failed to save booking edits:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content edit-booking-modal animate-slide-up">
        <div className="modal-header">
          <div className="header-title-group">
            <h2 className="text-xl font-bold">Edit Booking</h2>
            <span className="text-muted text-sm">Update service details for {booking.userName}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="booking-info-summary">
            <div className="info-item">
              <span className="label">Service</span>
              <span className="value">{booking.service}</span>
            </div>
            <div className="info-item">
              <span className="label">User Email</span>
              <span className="value">{booking.userEmail}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              Service Date
            </label>
            <input 
              type="date" 
              className="form-input" 
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <AlignLeft size={16} />
              Notes / Instructions
            </label>
            <textarea 
              className="form-input form-textarea" 
              placeholder="Add any special instructions or notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="loader-small"></span>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
