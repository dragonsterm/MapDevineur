import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../../services/api';
import DinoSvg, { AVATAR_OPTIONS } from './Avatars';
import { useNavigate } from 'react-router-dom';
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
    ? options.filter(opt => (opt.name || opt.label).toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const selectedOption = options.find(opt => (opt.code || opt.value) === value);
  const displayLabel = selectedOption ? (selectedOption.name || selectedOption.label) : placeholder;
  const displayFlag = hasFlag && selectedOption ? selectedOption.code.toLowerCase() : null;

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`} 
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

function AvatarSelectionModal({ isOpen, onClose, currentAvatar, onSelect }) {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
    const modalRef = useRef(null);

    useEffect(() => {
        setSelectedAvatar(currentAvatar);
    }, [currentAvatar, isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
             document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <div className="profile-overlay" style={{ zIndex: 10002 }}>
            <div ref={modalRef} className="home-login-form-container" style={{ width: '100%', maxWidth: '450px', background: 'rgba(13, 17, 23, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                   <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Choose an Avatar</h2>
                   <button onClick={onClose} className="glass-close-btn">✕</button>
                </div>
                
                <div className="avatar-grid" style={{ padding: '0' }}>
                    {AVATAR_OPTIONS.map(opt => (
                        <div 
                            key={opt.id} 
                            className={`avatar-option ${selectedAvatar === opt.id ? 'selected' : ''}`}
                            onClick={() => setSelectedAvatar(opt.id)}
                            title={opt.name}
                            style={{background: selectedAvatar === opt.id ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255,255,255,0.03)' }}
                        >
                            <DinoSvg type={opt.id} style={{ width: '100%', height: '100%' }} />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        className="btn-blue-gradient" 
                        onClick={() => onSelect(selectedAvatar)}
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    );
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
    const [slideValue, setSlideValue] = useState(0);
    const modalRef = useRef(null);
    const isReadyToDelete = slideValue === 100;

    useEffect(() => {
        if (isOpen) setSlideValue(0);
    }, [isOpen]);

    if (!isOpen) return null;

    const sliderBackground = `linear-gradient(to right, #EF4444 ${slideValue}%, rgba(255, 255, 255, 0.05) ${slideValue}%)`;

    return (
        <div className="delete-confirm-overlay">
            <div ref={modalRef} className="delete-confirm-box">
                <h2 style={{ color: '#EF4444', fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>
                    Delete Account?
                </h2>
                <p style={{ color: '#9ca3af', marginBottom: '25px', lineHeight: '1.5' }}>
                    This action cannot be undone. All your scores, achievements, and profile data will be permanently erased.
                </p>

                <div className="delete-slider-container">
                     <span 
                        className="delete-slider-track-text" 
                        style={{ opacity: slideValue > 50 ? 0.3 : 1, transition: 'opacity 0.2s' }}
                     >
                        SLIDE TO DELETE
                     </span>
                     <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={slideValue} 
                        onChange={(e) => setSlideValue(Number(e.target.value))}
                        className="delete-slider-input"
                        style={{ background: sliderBackground }}
                     />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={onClose}
                        style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!isReadyToDelete}
                        className={`delete-btn-final ${isReadyToDelete ? 'active' : ''}`}
                        style={{ flex: 1 }}
                    >
                        DELETE
                    </button>
                </div>
            </div>
        </div>
    );
}

function EditProfileModal({ isOpen, onClose, profile, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    display_name: profile.display_name || '',
    country: COUNTRIES.find(c => c.name === profile.country)?.code || '',
    gender: profile.gender || 'not specify',
    bio: profile.bio || '',
    avatar: profile.avatar || 'dino_idle'
  });
  
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const countryName = COUNTRIES.find(c => c.code === formData.country)?.name || formData.country;

    try {
      const { data } = await apiClient.put('/api/game-profile', {
          ...formData,
          country: countryName
      });
      onSuccess(data.profile);
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
      try {
          await apiClient.delete('/api/game-profile');
          navigate('/');
          window.location.reload();
      } catch (error) {
          console.error(error);
          alert("Failed to delete account");
      }
  };

  return (
    <>
      <div className="profile-overlay" style={{ zIndex: 10000 }}>
        <div className="home-login-form-container" style={{ width: '100%', maxWidth: '600px', padding: 0, background: 'rgba(13, 17, 23, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="modal-content-wrapper">
                <div className="modal-header-sticky">
                    <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>Edit Profile</h2>
                    <button onClick={onClose} className="glass-close-btn">✕</button>
                </div>
                <form 
                    className="home-login-form" 
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', margin: 0 }}
                >
                    <div className="modal-scroll-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0 30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(22, 27, 34, 0.8)', padding: '5px', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                                <DinoSvg type={formData.avatar} style={{ width: '100%', height: '100%' }} />
                            </div>
                            <div>
                                <button 
                                    className="btn-white-solid" 
                                    onClick={(e) => { e.preventDefault(); setShowAvatarModal(true); }}
                                >
                                    Change avatar
                                </button>
                                <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '5px' }}>
                                    Select from preset avatars
                                </div>
                            </div>
                        </div>
                        <div className="home-form-group edit-modal-group">
                            <label>Nickname</label>
                            <input
                            type="text"
                            className="home-form-input"
                            style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                            value={formData.display_name}
                            onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                            required
                            />
                        </div>

                        <div className="home-form-group edit-modal-group">
                            <label>Gender</label>
                            <CustomDropdown 
                            options={GENDERS}
                            value={formData.gender}
                            onChange={(val) => setFormData({...formData, gender: val})}
                            placeholder="Select Gender"
                            />
                        </div>

                        <div className="home-form-group edit-modal-group">
                            <label>Country</label>
                            <CustomDropdown 
                            options={COUNTRIES}
                            value={formData.country}
                            onChange={(val) => setFormData({...formData, country: val})}
                            placeholder="Select Country"
                            hasSearch={true}
                            hasFlag={true}
                            />
                        </div>

                        <div className="home-form-group edit-modal-group" style={{ marginBottom: '20px' }}>
                            <label>Bio</label>
                            <textarea 
                                className="home-form-input"
                                rows="4"
                                maxLength="200"
                                placeholder="Tell us about yourself"
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                style={{ resize: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
                                {formData.bio.length}/200
                            </div>
                        </div>
                    </div>

                    {/* Stick Footer */}
                    <div className="modal-footer-sticky">
                        <button 
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Delete Account
                        </button>

                        <button
                            type="submit"
                            className="btn-blue-gradient"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>

      <AvatarSelectionModal 
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          currentAvatar={formData.avatar}
          onSelect={(newAvatar) => {
              setFormData({...formData, avatar: newAvatar});
              setShowAvatarModal(false);
          }}
      />

      <DeleteConfirmationModal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default EditProfileModal;