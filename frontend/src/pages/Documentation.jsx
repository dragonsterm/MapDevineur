import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './documentation.css';
import './home.css';

const Documentation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('introduction');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const docSections = [
    { id: 'introduction', label: 'Introduction', isPlaceholder: false },
    { id: 'how-to-play', label: 'How to Play?', isPlaceholder: false },
    { id: 'game-modes', label: 'Game Modes', isPlaceholder: true },
    { id: 'scoring-system', label: 'Scoring System', isPlaceholder: true },
    { id: 'account-management', label: 'Account & Profile', isPlaceholder: true },
    { id: 'api-reference', label: 'API Reference', isPlaceholder: true },
  ];

  const introCards = [
    { 
      id: 'how-to-play', 
      title: 'Gameplay Basics', 
      desc: 'Learn the core mechanics, controls, and objectives of MapDevineur.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      )
    },
    { 
      id: 'game-modes', 
      title: 'Game Modes', 
      desc: 'Explore Classic, Speed Run, and upcoming multiplayer modes.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    { 
      id: 'scoring-system', 
      title: 'Scoring System', 
      desc: 'Understand how distance and time affect your final score.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 15l-2 5l9-9l-9 1l2-5l-9 9l9-1z"></path>
        </svg>
      )
    },
    { 
      id: 'account-management', 
      title: 'User Profile', 
      desc: 'Manage your stats, avatars, and account settings.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    { 
      id: 'api-reference', 
      title: 'Developer API', 
      desc: 'Integrate MapDevineur data into your own applications.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      )
    }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToLogin = () => {
    navigate('/');
    setTimeout(() => {
        const loginSection = document.getElementById('login');
        if(loginSection) loginSection.scrollIntoView();
    }, 100);
  };

  return (
    <div className="doc-container">
      <div className="test-background-glow"></div>
      <header className="home-header doc-header">
        <div className="home-header-container">
          <Link to="/" className="home-header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>MapDevineur</span>
          </Link>

          <nav className="home-header-nav">
            <Link to="/" className="home-nav-link">
              Home
            </Link>
            <Link to="/docs" className="home-nav-link home-nav-box active">
              Documentation
            </Link>
            <button onClick={scrollToLogin} className="home-nav-button">
              Play Now
            </button>
          </nav>
        </div>
      </header>

      {/* Documentation Layout */}
      <div className="doc-layout">
        {/* Sidebar */}
        <aside className="doc-sidebar">
          <div className="doc-sidebar-inner">
            <div className="doc-sidebar-group">
              <h4 className="doc-sidebar-title">Getting Started</h4>
              <ul className="doc-sidebar-list">
                {docSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`doc-sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                    >
                      {section.label}
                      {section.isPlaceholder && <span className="doc-badge-wip">WIP</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="doc-sidebar-group">
              <h4 className="doc-sidebar-title">Community</h4>
              <ul className="doc-sidebar-list">
                <li><a href="#" className="doc-sidebar-link">Discord</a></li>
                <li><a href="https://github.com/dragonsterm/MapDevineur" className="doc-sidebar-link">GitHub</a></li>
              </ul>
            </div>
          </div>
        </aside>
        
        <main className="doc-content">
          <div className="doc-content-wrapper">
            {/* introduction */}
            {activeSection === 'introduction' && (
              <div className="doc-intro-container">
                <h1 className="doc-title">MapDevineur Documentation</h1>
                <p className="doc-lead">
                  Welcome to the comprehensive guide for MapDevineur. Here you'll find everything you need to know to play, compete, and understand the mechanics of the game.
                </p>
                
                <div className="doc-intro-grid">
                  {introCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="doc-intro-card"
                      onClick={() => scrollToSection(card.id)}
                    >
                      <div className="doc-intro-card-icon">
                        {card.icon}
                      </div>
                      <h3 className="doc-intro-card-title">{card.title}</h3>
                      <p className="doc-intro-card-desc">{card.desc}</p>
                      <div className="doc-intro-card-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to play */}
            {activeSection === 'how-to-play' && (
              <article className="doc-article">
                <h1 className="doc-title">How to Play MapDevineur</h1>
                <p className="doc-lead">
                  Welcome to MapDevineur! This guide will teach you the basics of navigating the world, making guesses, and maximizing your score.
                </p>

                <div className="doc-divider"></div>

                <h3>The Objective</h3>
                <p>
                  MapDevineur drops you into a random location somewhere on Earth using Google Street View. Your mission is simple: <strong>figure out where you are</strong> and pin that location on the map.
                </p>

                <div className="doc-card-info">
                  <div className="doc-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <strong>Tip:</strong> Look for clues like language on signs, driving side of the road, architecture, and climate!
                  </div>
                </div>

                <h3>Game Flow</h3>
                <ol className="doc-steps">
                  <li>
                    <strong>Explore the surroundings</strong>
                    <p>You can move around, zoom in, and look in all directions within the Street View panorama. Use these controls to find critical clues about your whereabouts.</p>
                  </li>
                  <li>
                    <strong>Make your guess</strong>
                    <p>Open the map overlay and drop a pin where you think you started. You can move the pin as many times as you like before submitting.</p>
                  </li>
                  <li>
                    <strong>Submit</strong>
                    <p>Once confident, press the "Guess" button. Be careful—you only have a limited amount of time (usually 60-120 seconds) per round!</p>
                  </li>
                </ol>

                <h3>Scoring</h3>
                <p>
                  Points are awarded based on how close your guess is to the actual location.
                </p>
                <ul>
                  <li><strong>Perfect Score (5000 points):</strong> Guessing within a few meters of the target.</li>
                  <li><strong>Distance Penalty:</strong> Points decrease exponentially the further away you guess.</li>
                  <li><strong>Time Bonus:</strong> In certain modes, guessing quickly yields bonus points.</li>
                </ul>

              </article>
            )}

            {/* placeholder */}
            {activeSection !== 'introduction' && activeSection !== 'how-to-play' && (
              <div className="doc-placeholder-container">
                <div className="doc-placeholder-icon-wrapper">
                   <svg className="doc-placeholder-corner-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
                
                <h2>Work in Progress</h2>
                <p>We are currently writing the documentation for <strong style={{color: '#60A5FA'}}>{docSections.find(s => s.id === activeSection)?.label}</strong>.</p>
                
                <div style={{ marginTop: '32px' }}>
                  <button className="test-button-solid" onClick={() => scrollToSection('how-to-play')}>
                    Back to How to Play
                  </button>
                </div>
              </div>
            )}

            <div className="doc-footer-nav">
               <div className="doc-footer-feedback">
                  Was this page helpful? <a href="#">Yes</a> / <a href="#">No</a>
               </div>
            </div>
          </div>
        </main>
      </div>
    {/* Footer */}
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
};

export default Documentation;