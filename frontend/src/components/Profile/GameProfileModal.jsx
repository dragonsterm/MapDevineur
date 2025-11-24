import { useState, useRef, useEffect } from 'react';
import apiClient from '../../services/api';
import '../../pages/home.css';
import '../../styles/gameProfileStyles.css';

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'AR', name: 'Argentina' }, { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
  { code: 'BD', name: 'Bangladesh' }, { code: 'BE', name: 'Belgium' }, { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' }, { code: 'CN', name: 'China' }, { code: 'CO', name: 'Colombia' },
  { code: 'HR', name: 'Croatia' }, { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' }, { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' }, { code: 'GR', name: 'Greece' }, { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' }, { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' }, { code: 'JP', name: 'Japan' }, { code: 'KR', name: 'South Korea' },
  { code: 'MY', name: 'Malaysia' }, { code: 'MX', name: 'Mexico' }, { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'NO', name: 'Norway' }, { code: 'PK', name: 'Pakistan' },
  { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russia' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' }, { code: 'ZA', name: 'South Africa' }, { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' }, { code: 'CH', name: 'Switzerland' }, { code: 'TH', name: 'Thailand' },
  { code: 'TR', name: 'Turkey' }, { code: 'UA', name: 'Ukraine' }, { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'US', name: 'United States' }, { code: 'VN', name: 'Vietnam' }
];

const GENDERS = [
  { value: 'not specify', label: 'Not Specify' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

function CustomDropdown({ options, value, onChange, placeholder, hasSearch = false, hasFlag = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const filteredOptions = hasSearch 
    ? options.filter(opt => opt.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const selectedOption = options.find(opt => (opt.code || opt.value) === value);
  const displayLabel = selectedOption ? (selectedOption.name || selectedOption.label) : placeholder;
  const displayFlag = hasFlag && selectedOption ? selectedOption.code.toLowerCase() : null;

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className={`home-form-input dropdown-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {displayFlag && (
            <img 
              src={`https://flagcdn.com/24x18/${displayFlag}.png`} 
              alt={displayLabel}
              style={{ borderRadius: '2px', width: '20px', height: '15px', objectFit: 'cover' }}
            />
          )}
          <span style={{ color: selectedOption ? 'white' : 'rgba(156, 163, 175, 0.5)' }}>
            {displayLabel}
          </span>
        </div>
        
        <div className={`chevron ${isOpen ? 'open' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
            </svg>
        </div>
      </div>

      {/* Dropdow */}
      {isOpen && (
        <div className="dropdown-menu">
          {hasSearch && (
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}
          
          <div className="dropdown-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.code || opt.value} 
                  className={`dropdown-item ${value === (opt.code || opt.value) ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.code || opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {hasFlag && (
                    <img 
                      src={`https://flagcdn.com/20x15/${opt.code.toLowerCase()}.png`} 
                      alt={opt.name}
                      style={{ borderRadius: '2px', marginRight: '10px' }}
                    />
                  )}
                  {opt.name || opt.label}
                </div>
              ))
            ) : (
              <div className="dropdown-item no-results">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GameProfileModal({ isOpen, onSuccess }) {
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
    
    const payload = {
        ...formData,
        country: COUNTRIES.find(c => c.code === formData.country)?.name || formData.country
    };

    try {
      const { data } = await apiClient.post('/api/game-profile', payload);
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
            <CustomDropdown 
              options={COUNTRIES}
              value={formData.country}
              onChange={(val) => setFormData({...formData, country: val})}
              placeholder="Select your country"
              hasSearch={true}
              hasFlag={true}
            />
          </div>

          <div className="home-form-group">
            <label>Gender</label>
            <CustomDropdown 
              options={GENDERS}
              value={formData.gender}
              onChange={(val) => setFormData({...formData, gender: val})}
              placeholder="Select Gender"
              hasSearch={false}
              hasFlag={false}
            />
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