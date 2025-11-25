import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/Profile/EditProfileModal';
import DinoSvg from '../components/Profile/Avatars';
import apiClient from '../services/api';
import useAuth from '../hooks/useAuth';
import '../styles/gameProfileStyles.css';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/api/game-profile/${userId}`);
      setProfile({
        ...data.profile,
        high_score: data.high_score,
        username: data.username
      });
      setIsOwnProfile(data.is_own_profile);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        User not found. 
        <button 
            onClick={() => navigate('/game')} 
            style={{
                marginLeft: '10px', 
                background: 'transparent', 
                color: 'white', 
                border: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer'
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Return to Home
        </button>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', paddingBottom: '40px', overflowX: 'hidden' }}>
      
      {/* Navbar */}
      <div style={{ 
          padding: '20px 40px', 
          background: 'rgba(0, 0, 0, 0.2)', 
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          display: 'flex', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
      }}>
        <button 
            onClick={() => navigate('/game')} 
            className="nav-back-btn"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Return to Game
        </button>
      </div>

      {/* Profile Container */}
      <div className="profile-container-wrapper">
        <div className="profile-pulse-bg"></div>
        <div className="profile-container">
            <div className="profile-cover">
              <div className="wave-container">
                 <div className="wave"></div>
                 <div className="wave"></div>
                 <div className="wave"></div>
              </div>
            </div>

            {/* Avatar */}
            <div className="profile-avatar-wrapper">
                 <DinoSvg type={profile.avatar || 'dino_idle'} className="profile-avatar-img" />
            </div>

            {/* Profile Details */}
            <div className="profile-header">
                <div>
                  <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginTop: '4px', marginBottom: '4px'}}>
                    {profile.display_name}
                    <span style={{ fontSize: '18px', color: '#8b949e', fontWeight: 'normal', marginLeft: '8px' }}>
                        #{profile.id}
                    </span>
                  </h1>
                </div>

                {isOwnProfile && (
                  <button className="btn-edit-profile" onClick={() => setShowEditModal(true)}>
                    Edit profile
                  </button>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="profile-content-grid">
                {/* Left Column: Stats */}
                <div className="profile-column-left">
                    <div style={{ 
                        background: 'rgba(22, 27, 34, 0.6)', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        overflow: 'hidden' 
                    }}>
                        <div style={{ 
                            padding: '15px 20px', 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                            fontWeight: 'bold', 
                            color: 'white' 
                        }}>
                            Top Scores
                        </div>
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                             <h3 style={{ color: '#60A5FA', fontSize: '42px', fontWeight: 'bold', marginBottom: '5px'}}>
                                 {profile.high_score ? profile.high_score.toLocaleString() : 0}
                             </h3>
                             <p style={{ color: '#8b949e', fontSize: '14px' }}>Highest Score Achieved</p>
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="profile-column-right">
                    <div className="info-card" style={{background: 'rgba(22, 27, 34, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                        <h4 style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '15px', marginBottom: '15px' }}>
                            Personal Information
                        </h4>
                        
                        <div className="info-section" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                            <div className="info-label">Bio</div>
                            <div className="info-value">
                                {profile.bio || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No bio provided</span>}
                            </div>
                        </div>

                        <div className="info-section" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                            <div className="info-label">Country</div>
                            <div className="info-value">
                                {profile.country && (
                                    <img 
                                        src={`https://flagcdn.com/20x15/${profile.country.toLowerCase()}.png`} 
                                        alt="flag"
                                        style={{ borderRadius: '2px', marginRight: '8px', verticalAlign: 'middle' }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                                <span style={{textTransform: 'uppercase'}}>{profile.country || 'Unknown'}</span>
                            </div>
                        </div>

                        <div className="info-section" style={{ borderBottom: 'none' }}>
                            <div className="info-label">Gender</div>
                            <div className="info-value" style={{ textTransform: 'capitalize' }}>
                                {profile.gender || 'Not specified'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Edit Profile Overlay */}
      {showEditModal && (
        <EditProfileModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          profile={profile}
          onSuccess={handleUpdateSuccess}
        />
      )}

    </main>
  );
}

export default UserProfile;