import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/test.css';
import './home.css';

function ResetPassword() {
  const navigate = useNavigate();
  
  // State for flow control
  const [step, setStep] = useState(1); // 1: Find Account, 2: Update Password
  const [isLoading, setIsLoading] = useState(false);
  
  // Form Data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Handlers ---

  const handleFindUser = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    setIsLoading(true);

    // SIMULATION: Replace this with your actual API call to check if user exists
    try {
      // await checkUserExists(username); 
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      
      // Simulate logic: if username is "error", show error, else proceed
      if (username.toLowerCase() === 'error') {
         throw new Error('Account not found');
      }

      setStep(2); // Move to next step
    } catch (err) {
      setError(err.message || 'Account not found with this username');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // SIMULATION: Replace with actual password update API
    try {
      // await updatePassword(username, password);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
      
      setSuccessMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="test-container">
      <div className="test-background-glow"></div>

      {/* Navbar - Simplified for Reset Password */}
      <header className="home-header">
        <div className="home-header-container">
          <div className="home-header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>MapDevineur</span>
          </div>

          <nav className="home-header-nav">
            <Link to="/" className="home-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <section 
        className="home-login-section" 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="home-login-wrapper">
          <div className="reset-password-pulse-bg"></div>
          
          {/* Centered Single Panel Content */}
          <div 
            className="home-login-content" 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gridTemplateColumns: 'none', 
              gap: 0,
              maxWidth: '100%' 
            }}
          >
            <div className="home-login-form-container" style={{ width: '100%', maxWidth: '440px' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '12px'
                }}>
                  Reset Password
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5' }}>
                  {step === 1 
                    ? "Enter your username to locate your account." 
                    : "Account found. Please set your new password."}
                </p>
              </div>

              <form className="home-login-form" onSubmit={step === 1 ? handleFindUser : handleUpdatePassword}>
                
                {/* Step 1: Username Input */}
                <div className="home-form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className={`home-form-input ${error && step === 1 ? 'error' : ''}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={step === 2 || isLoading}
                    style={step === 2 ? { opacity: 0.7, cursor: 'not-allowed', borderColor: '#238636' } : {}}
                  />
                  {step === 2 && (
                    <div style={{ 
                      marginTop: '8px', 
                      fontSize: '12px', 
                      color: '#238636', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px' 
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Account verified
                    </div>
                  )}
                </div>

                {/* Step 2: Password Inputs (Revealed when step === 2) */}
                {step === 2 && (
                  <div style={{ animation: 'fadeIn 0.5s ease-out', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="home-form-group">
                      <label>New Password</label>
                      <div className="home-password-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Enter new password"
                          className="home-form-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                    </div>

                    <div className="home-form-group">
                      <label>Confirm Password</label>
                      <div className="home-password-wrapper">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          className="home-form-input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                    </div>
                  </div>
                )}

                {/* Error & Success Messages */}
                {error && (
                  <div className="home-alert" style={{ textAlign: 'center' }}>
                    {error}
                  </div>
                )}
                
                {successMessage && (
                  <div style={{
                    background: 'rgba(35, 134, 54, 0.12)',
                    border: '1px solid rgba(35, 134, 54, 0.4)',
                    color: '#3fb950',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    marginTop: '16px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {successMessage}
                  </div>
                )}

                {/* Action Buttons */}
                <button 
                  type="submit" 
                  className="test-button-solid home-login-button" 
                  disabled={isLoading || !!successMessage}
                >
                  {isLoading ? (
                    <>
                       <span className="home-login-spinner"></span>
                       {step === 1 ? 'Searching...' : 'Updating...'}
                    </>
                  ) : (
                    step === 1 ? 'Find Account' : 'Update Password'
                  )}
                </button>

                <div className="home-register-link">
                  Remember your password?{' '}
                  <Link to="/">Login here</Link>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;