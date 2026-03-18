import { useEffect, useState } from 'react';
import { User, Mail, Shield, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function Profile() {
  const { user: authUser, token } = useAuth();
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?.id || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${authUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setProfileData(data.data.user);
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('An error occurred while fetching profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.id, token]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <Loader className="animate-spin" size={32} />
          <span style={{ marginLeft: '1rem' }}>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-card error-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <div className="profile-card error-state">
          <p>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            <span>{profileData.name.charAt(0)}</span>
          </div>
          <h2>{profileData.name}</h2>
          <span className="role-badge">{profileData.role}</span>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <div className="detail-label">
              <User size={14} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Full Name
            </div>
            <div className="detail-value">{profileData.name}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Mail size={14} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Email Address
            </div>
            <div className="detail-value">{profileData.email}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Shield size={14} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Account Role
            </div>
            <div className="detail-value">{profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
