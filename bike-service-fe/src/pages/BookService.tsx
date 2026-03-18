import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { Loader2, Calendar, CheckCircle2, IndianRupee, Clock, Info } from 'lucide-react';
import './BookService.css';

interface Service {
  id: string;
  _id?: string; // Fallback for backend inconsistencies
  name: string;
  description: string;
  price: number;
  duration: string;
}

export default function BookService() {
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingServices, setIsFetchingServices] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setServices(data.data.services);
        }
      } catch (error) {
        console.error('Failed to fetch services', error);
        addToast('error', 'Connection Error', 'Could not load service packages.');
      } finally {
        setIsFetchingServices(false);
      }
    };

    fetchServices();
  }, [addToast]);

  const selectedService = services.find(s => (s.id || s._id) === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !date) return;

    setIsLoading(true);
    
    // We send the service ID to the backend as the 'service' field
    const success = await addBooking({
      userId: user?.id || '',
      userName: user?.name || '',
      userEmail: user?.email || '',
      service: selectedServiceId, 
      serviceDate: date,
      notes,
    });

    setIsLoading(false);

    if (success) {
      setIsSuccess(true);
      addToast('success', 'Booking Confirmed!', `Your ${selectedService?.name} has been scheduled.`);

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
            <p className="text-label">Choose a package and schedule your visit.</p>
          </div>
          
          <div className="divider"></div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Service Type</label>
              {isFetchingServices ? (
                <div className="select-loader">
                  <Loader2 className="spin" size={16} />
                  <span>Loading packages...</span>
                </div>
              ) : (
                <select 
                  className="form-select" 
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a service...</option>
                  {services.map(s => (
                    <option key={s.id || s._id} value={s.id || s._id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>

            {selectedService && (
              <div className="service-details-preview animate-in">
                <div className="preview-item">
                  <IndianRupee size={16} className="item-icon" />
                  <div className="item-content">
                    <span className="item-label">Estimated Price</span>
                    <span className="item-value">₹{selectedService.price}</span>
                  </div>
                </div>
                <div className="preview-item">
                  <Clock size={16} className="item-icon" />
                  <div className="item-content">
                    <span className="item-label">Duration</span>
                    <span className="item-value">{selectedService.duration}</span>
                  </div>
                </div>
                <div className="preview-info-box">
                  <Info size={14} />
                  <p>{selectedService.description}</p>
                </div>
              </div>
            )}

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
              disabled={isLoading || isSuccess || isFetchingServices}
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
