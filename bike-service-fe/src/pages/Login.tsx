import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import './AuthPages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        addToast('success', 'Welcome back!', 'Successfully logged in to RevUp.');
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card-elevated animate-in">
        <div className="auth-header">
          <div className="logo-group large">
            <div className="logo-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" stroke="#F97316" strokeWidth="4"/>
                <circle cx="32" cy="32" r="8" stroke="#F97316" strokeWidth="3"/>
                <line x1="32" y1="4" x2="32" y2="24" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
                <line x1="32" y1="40" x2="32" y2="60" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
                <line x1="4" y1="32" x2="24" y2="32" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
                <line x1="40" y1="32" x2="60" y2="32" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="logo-text">RevUp</span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Precision service for your two-wheeled machine.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? <Loader2 className="spin" size={20} /> : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up →</Link></p>
        </div>
      </div>
    </div>
  );
}
