// src/pages/Registration.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/test.css';
import './home.css';
import useAuth from '../hooks/useAuth'; 

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // (State loading)
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Comment out or remove this useEffect
  // useEffect(() => {
  //   if (user) {
  //     navigate('/game');
  //   }
  // }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = 'Passwords do not match';
    }
    return errors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setAlertMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setFormErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setAlertMessage('');

    try {
      await register({
        username: formData.username.trim(),
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });
      // Redirect to loading page instead of game
      navigate('/loading', { state: { type: 'register' }, replace: true });
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';
      setAlertMessage(backendMessage);

      if (error.response?.data?.errors) {
        const backendErrors = Object.entries(error.response.data.errors).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value?.[0] }),
          {}
        );
        setFormErrors((prev) => ({ ...prev, ...backendErrors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const slidesContent = [
    { title: "Street View Challenge", description: "Immerse yourself in real-world locations..." },
    { title: "Make Your Guess", description: "Drop a pin anywhere on the interactive world map" },
    { title: "Score & Compete", description: "Earn points and climb the global leaderboard" }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesContent.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slidesContent.length]);

  return (
    <div className="test-container">
      <div className="test-background-glow"></div>
      <section 
        className="home-login-section" 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="home-login-wrapper">
          <div className="home-login-pulse-bg"></div>
          <div 
            className="home-login-content" 
            style={{ 
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              maxWidth: '900px',
              margin: '0 auto',
              alignItems: 'center'
            }}
          >
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="home-hero-text">
                <div className="home-features-logo">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="home-features-logo-text">MapDevineur</span>
                </div>
                <h1 
                  className="home-features-title"
                  style={{ fontSize: '52px', lineHeight: '1.15' }}
                >
                  Create Your<br />Playground
                </h1>
                <p className="home-features-subtitle">
                  Next Gen geography game experience
                </p>
              </div>
            </div>

            <div>
              <div className="home-login-form-container">
                <h2 style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  Register
                </h2>
                <form className="home-login-form" onSubmit={handleSubmit}>
                  <div className="home-form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      className={`home-form-input ${formErrors.username ? 'error' : ''}`}
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {formErrors.username && (
                      <p className="home-form-error">{formErrors.username}</p>
                    )}
                  </div>
                  <div className="home-form-group">
                    <label>Password</label>
                    <div className="home-password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        className={`home-form-input ${formErrors.password ? 'error' : ''}`}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="home-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="home-form-error">{formErrors.password}</p>
                    )}
                  </div>
                  <div className="home-form-group">
                    <label>Confirm Password</label>
                    <div className="home-password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="passwordConfirmation"
                        placeholder="Confirm your password"
                        className={`home-form-input ${formErrors.passwordConfirmation ? 'error' : ''}`}
                        value={formData.passwordConfirmation}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="home-password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {formErrors.passwordConfirmation && (
                      <p className="home-form-error">{formErrors.passwordConfirmation}</p>
                    )}
                  </div>
                  {error && (
                    <div style={{color: '#F87171', fontSize: '13px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                      {error}
                    </div>
                  )}
                  {alertMessage && (
                    <div style={{color: '#F87171', fontSize: '13px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                      {alertMessage}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="test-button-solid home-login-button" 
                    disabled={isLoading} 
                  >
                    {isSubmitting ? 'Registering...' : 'Continue to Register'}
                  </button>
                  <div className="home-register-link">
                    Already have an account?{' '}
                    <Link to="/">Login here</Link>
                  </div>
                  <div className="home-terms">
                    By Continuing, you agree to MapDevineur's{' '}
                    <a href="#">Consumer Terms</a> and{' '}
                    <a href="#">Usage Policy</a>, and acknowledge their{' '}
                    <a href="#">Privacy Policy</a>.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Registration;