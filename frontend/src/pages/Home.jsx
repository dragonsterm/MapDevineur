import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/test.css';
import './home.css';
import useAuth from '../hooks/useAuth';

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [gameModeSlide, setGameModeSlide] = useState(0);
  const navigate = useNavigate();
  const { login, user, initializing } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!initializing && user) {
      navigate('/game', { replace: true });
    }
  }, [initializing, user, navigate]);

  const features = [
    {
      title: "5-Round Challenge",
      description: "Test your geography skills across 5 exciting rounds with locations from around the world.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Real-time Scoring",
      description: "Distance-based scoring with time bonuses. The faster and more accurate you are, the higher your score.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Global Leaderboard",
      description: "Compete with players worldwide and climb the ranks to become the ultimate geography master.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const gameModesData = [
  {
    title: "Classic Mode",
    description: [
      "5 rounds of guessing locations around the world",
      "120 seconds to guess",
      "Closer you get to the correct location, the higher your score",
      "Global leaderboard featured mode"
    ],
    available: true,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Speed Run",
    description: [
      "Quick-fire rounds with 30 seconds each",
      "10 locations to guess",
      "Bonus points for consecutive correct guesses",
      "Time attack leaderboard"
    ],
    available: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Region Master",
    description: [
      "Focus on specific continents or countries",
      "7 rounds per region",
      "Unlock achievements for each region",
      "Compete in regional leaderboards"
    ],
    available: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: "Team Battle",
    description: [
      "Compete in teams of 2-4 players",
      "Real-time multiplayer experience",
      "Shared score and collaboration",
      "Weekly team tournaments"
    ],
    available: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

  const faqs = [
    {
      question: "What is MapDevineur and how does it work?",
      answer: "MapDevineur is a geography guessing game where you're shown a location via Google Street View. You have 60 seconds to guess where in the world you are by clicking on a map. The closer your guess, the more points you earn!"
    },
    {
      question: "How is my score calculated?",
      answer: "Your score is based on two factors: accuracy (distance between your guess and the actual location) and speed (time remaining when you submit). Closer guesses and faster times result in higher scores."
    },
    {
      question: "How many rounds are in each game?",
      answer: "Each game session consists of 5 rounds. Your final score is the total of all 5 rounds, which is then submitted to the global leaderboard."
    },
    {
      question: "Do I need an account to play?",
      answer: "Yes, you need to create a free account to play MapDevineur and save your scores to the leaderboard. Registration takes less than a minute!"
    }
  ];

  const slidesContent = [
    {
      title: "Street View Challenge",
      description: "Immerse yourself in real-world locations captured by Google Street View"
    },
    {
      title: "Make Your Guess",
      description: "Drop a pin anywhere on the interactive world map"
    },
    {
      title: "Score & Compete",
      description: "Earn points and climb the global leaderboard"
    }
  ];
  // rotate 10 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesContent.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slidesContent.length]);

  const scrollToContent = () => {
    const meetSection = document.querySelector('.home-meet-section');
    if (meetSection) {
      meetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGameModes = () => {
    const gameModeSection = document.querySelector('.test-features-section');
    if (gameModeSection) {
      const headerOffset = 80;
      const elementPosition = gameModeSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToFAQ = () => {
    const faqSection = document.querySelector('.home-faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const itemsPerPage = 3;
  const maxGameModeSlide = Math.ceil(gameModesData.length / itemsPerPage) - 1;

  const nextGameModeSlide = () => {
    setGameModeSlide((prev) => (prev < maxGameModeSlide ? prev + 1 : 0));
  };

  const prevGameModeSlide = () => {
    setGameModeSlide((prev) => (prev > 0 ? prev - 1 : maxGameModeSlide));
  };

  const getCurrentGameModes = () => {
    const startIndex = gameModeSlide * itemsPerPage;
    return gameModesData.slice(startIndex, startIndex + itemsPerPage);
  };

  const scrollToLogin = () => {
  const loginSection = document.querySelector('.home-login-section');
  if (loginSection) {
    loginSection.scrollIntoView({ behavior: 'smooth' });
  }
};

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setAlertMessage('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setFormErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setAlertMessage('');

    try {
      await login({
        username: formData.username.trim(),
        password: formData.password,
      });
      navigate('/loading', { state: { type: 'login' }, replace: true });
    } catch (error) {
      setAlertMessage('Wrong username or password. Forgot your password? reset it ');
      const backendMessage =
        error.response?.data?.message ||
        'Wrong username or password. Forgot your password? reset it  ';
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
  
  if (initializing) {
    return (
      <div className="test-container">
        <div className="test-background-glow"></div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="test-background-glow"></div>

      {/* Header */}
      <header className="home-header">
        <div className="home-header-container">
          <div className="home-header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>MapDevineur</span>
          </div>

          <nav className="home-header-nav">
            <button onClick={scrollToContent} className="home-nav-link">
              Meet MapDevineur
            </button>
            <button onClick={scrollToGameModes} className="home-nav-link">
              GameModes
            </button>
            <button onClick={scrollToFAQ} className="home-nav-link">
              FAQ
            </button>
            <button className="home-nav-link home-nav-box">
              Documentation
            </button>
            <button onClick={scrollToLogin} className="home-nav-button">
              Try MapDevineur
            </button>
          </nav>
        </div>
      </header>

      {/* Login Section */}
      <section className="home-login-section">
        <div className="home-login-wrapper">
          <div className="home-login-pulse-bg"></div>
          
          <div className="home-login-content">
            <div>
              <div className="home-hero-text">
                <div className="home-features-logo">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="home-features-logo-text">MapDevineur</span>
                </div>
                
                <h1 className="home-features-title">
                  Earth is<br />Your<br />Playground
                </h1>

                <p className="home-features-subtitle">
                  Next Gen geography game experience
                </p>
              </div>

              <div className="home-login-form-container">
                <form className="home-login-form" onSubmit={handleLoginSubmit}>
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
                  </div>

                  {alertMessage && (
                    <div className="home-alert">
                      {alertMessage}{' '}
                      <Link to="/reset-password" className="home-alert-link">
                        here
                      </Link>
                      .
                    </div>
                  )}

                  <button
                    type="submit"
                    className="test-button-solid home-login-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="home-login-spinner"></span>
                        Signing in...
                      </>
                    ) : (
                      'Continue to Login'
                    )}
                  </button>

                  <div className="home-register-link">
                    Don't have account?{' '}
                    <Link to="/register">register new account</Link>
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

            <div className="home-features-showcase">
              <div className="home-features-content">
                <div className="home-features-preview">
                  {slidesContent.map((slide, index) => (
                    <div 
                      key={index}
                      className={`home-feature-slide ${activeSlide === index ? 'active' : ''}`}
                    >
                      <div className="home-feature-slide-content">
                        <div className="home-feature-slide-image">
                          {/* Placeholder images */}
                          <div className="home-feature-placeholder">
                            <span className="home-feature-placeholder-text">
                              Feature Preview
                            </span>
                          </div>
                        </div>
                        <h3>{slide.title}</h3>
                        <p>{slide.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="home-carousel-dots">
                  {slidesContent.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`home-carousel-dot ${activeSlide === index ? 'active' : ''}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="home-login-bottom">
                  <button 
                    className="test-button-glass home-learn-more-button"
                    onClick={scrollToContent}
                  >
                    Learn more ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet MapDevineur Section */}
      <section className="home-meet-section">
        <div className="home-meet-container">
          <div className="home-meet-header">
            <h2 className="home-meet-title">Meet MapDevineur</h2>
            <p className="home-meet-description">
              MapDevineur is a next generation geography game built to challenge your world knowledge<br />
              and help you explore the globe from your browser.
            </p>
          </div>

          <div className="home-game-preview">
            <div className="home-game-screenshot">
              <div className="home-game-screenshot-placeholder">
                <span className="home-game-screenshot-text">Game Preview</span>
              </div>
            </div>

            <div className="home-game-features-grid">
              <div className="home-game-feature-item-new">
                <div className="home-game-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="home-game-feature-content">
                  <h4>Worldwide locations</h4>
                  <p>Test your geography knowledge with real Street View locations from around the world.</p>
                </div>
              </div>

              <div className="home-game-feature-item-new">
                <div className="home-game-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="home-game-feature-content">
                  <h4>Bring your knowledge</h4>
                  <p>Use your geography skills and visual clues to pinpoint locations on the map.</p>
                </div>
              </div>

              <div className="home-game-feature-item-new">
                <div className="home-game-feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="home-game-feature-content">
                  <h4>Show your skills</h4>
                  <p>Compete with players worldwide on the global leaderboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="test-features-section">
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="test-section-title-center home-gamemode-title">
          Explore game modes
        </h2>
      </div>

      <div className="home-gamemode-carousel-container">
        <button 
          onClick={prevGameModeSlide}
          className="home-gamemode-carousel-btn home-gamemode-carousel-btn-left"
          disabled={gameModeSlide === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="home-gamemode-cards-wrapper">
          <div 
            className="home-gamemode-cards-track"
            style={{ transform: `translateX(-${gameModeSlide * 100}%)` }}
          >
            {gameModesData.map((mode, index) => (
              <div key={index} className="home-gamemode-card">
                <div className="home-gamemode-card-icon">
                  {mode.icon}
                </div>
                
                <div className="home-gamemode-card-header">
                  <h3 className="home-gamemode-card-title">{mode.title}</h3>
                </div>
                
                <ul className="home-gamemode-features-list">
                  {mode.description.map((feature, idx) => (
                    <li key={idx} className="home-gamemode-feature-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {mode.available ? (
                  <button 
                    className="test-button-solid home-gamemode-play-btn"
                    onClick={scrollToLogin}
                  >
                    Play now
                  </button>
                ) : (
                  <button className="home-gamemode-disabled-btn" disabled>
                    To be added
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={nextGameModeSlide}
          className="home-gamemode-carousel-btn home-gamemode-carousel-btn-right"
          disabled={gameModeSlide === maxGameModeSlide}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="home-gamemode-dots">
        {Array.from({ length: maxGameModeSlide + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setGameModeSlide(index)}
            className={`home-gamemode-dot ${gameModeSlide === index ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>

      {/* FAQ Section */}
      <section className="home-faq-section">
      <div className="home-faq-container">
        <div className="home-faq-header">
          <h2 className="test-section-title-center">
            Frequently asked questions
          </h2>
        </div>

        <div className="home-faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="home-faq-item">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="home-faq-button"
              >
                <span className="home-faq-question">
                  {faq.question}
                </span>
                <span className={`home-faq-icon ${openFaq === index ? 'open' : ''}`}>
                  {openFaq === index ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </button>
              <div className={`home-faq-answer-wrapper ${openFaq === index ? 'open' : ''}`}>
                <div className="home-faq-answer">
                  <div className="home-faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


      {/* Footer Section */}
      <footer className="test-footer">
        <div className="test-footer-content">
          <div className="test-footer-brand">
            <div className="test-footer-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>MapDevineur</span>
            </div>
            <p className="test-footer-tagline">
              BY MAPDEVINEUR TEAM
            </p>
            <p className="test-footer-copyright">
              © 2025 MapDevineur Project
            </p>
            <div className="test-footer-social">
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="test-footer-links">
            <div className="test-footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Game Mode</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>

            <div className="test-footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="test-footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>

            <div className="test-footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Compliance</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;