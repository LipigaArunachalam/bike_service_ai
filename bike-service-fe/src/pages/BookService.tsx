import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { Loader2, Calendar, CheckCircle2 } from 'lucide-react';
import './BookService.css';

const SERVICE_TYPES = [
  'Full Service',
  'Oil Change',
  'Brake Adjustment',
  'Tire Replacement',
  'Chain Lubrication',
  'Engine Tune-Up',
  'Wheel Alignment',
  'General Inspection',
];

export default function BookService() {
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !date) return;

    setIsLoading(true);
    
    const success = await addBooking({
      userId: user?.id || '',
      userName: user?.name || '',
      userEmail: user?.email || '',
      service,
      serviceDate: date,
      notes,
    });

    setIsLoading(false);

    if (success) {
      setIsSuccess(true);
      addToast('success', 'Booking Confirmed!', 'Your service has been scheduled successfully.');

      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } else {
      addToast('error', 'Booking Failed', 'There was an error scheduling your service. Please try again.');
    }
  };

  return (
    <div className="book-service-page animate-in">
      <header className="page-header simple">
        <h1 className="text-page-title">Book a Service</h1>
      </header>

      <div className="form-container">
        <div className="card form-card">
          <div className="form-card-header">
            <h2 className="text-section-title">New Service Request</h2>
            <p className="text-label">Fill in the details below to schedule your bike service.</p>
          </div>
          
          <div className="divider"></div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Service Type</label>
              <select 
                className="form-select" 
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
              >
                <option value="" disabled>Select a service...</option>
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <div className="input-with-icon">
                <input 
                  type="date" 
                  className="form-input" 
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Calendar size={18} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Special Instructions (optional)</label>
              <textarea 
                className="form-textarea" 
                placeholder="e.g., Chain replacement needed, rear wheel wobbling..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <button 
              type="submit" 
              className={`btn-primary ${isSuccess ? 'success scale-pop' : ''}`}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <Loader2 className="spin" size={20} />
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Booking Confirmed!</span>
                </>
              ) : (
                'Schedule Service'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
