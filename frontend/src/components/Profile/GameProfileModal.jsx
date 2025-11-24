import { useState } from 'react';
import apiClient from '../../services/api';
import '../../pages/home.css';

function GameProfileModal ({ isOpen, onSuccess }) {
  const [formData, setFormData] = useState({
    display_name: '',
    country: '',
    gender: 'not specify'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const { data } = await apiClient.post('/api/game-profile', formData);
      if (onSuccess) {
        onSuccess(data.profile);
      }
    } catch (err) {
      console.error('Failed to create profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="home-login-form-container" style={{ width: '100%', maxWidth: '480px', animation: 'fadeIn 0.3s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Setup Profile</h2>
          <p style={{ color: '#9ca3af' }}>Complete your profile to start playing</p>
        </div>

        <form className="home-login-form" onSubmit={handleSubmit}>
          <div className="home-form-group">
            <label>Display Name</label>
            <input
              type="text"
              required
              className="home-form-input"
              placeholder="Enter display name"
              value={formData.display_name}
              onChange={(e) => setFormData({...formData, display_name: e.target.value})}
            />
          </div>

          <div className="home-form-group">
            <label>Country</label>
            <input
              type="text"
              required
              className="home-form-input"
              placeholder="Enter your country"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
            />
          </div>

          <div className="home-form-group">
            <label>Gender</label>
            <div style={{ position: 'relative' }}>
              <select
                required
                className="home-form-input"
                style={{ appearance: 'none', cursor: 'pointer', color: 'white' }}
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="not specify" style={{color: 'black'}}>Not Specify</option>
                <option value="male" style={{color: 'black'}}>Male</option>
                <option value="female" style={{color: 'black'}}>Female</option>
              </select>
              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              color: '#F87171', 
              fontSize: '13px', 
              textAlign: 'center', 
              background: 'rgba(239, 68, 68, 0.1)', 
              padding: '10px', 
              borderRadius: '6px', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              marginBottom: '10px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="test-button-solid home-login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Profile...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GameProfileModal;