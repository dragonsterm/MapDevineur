import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { createGame } from '../services/gameService';
import apiClient from '../services/api';
import GameProfileModal from '../components/Profile/GameProfileModal';
import DinoSvg from '../components/Profile/Avatars';
import '../components/test.css';
import './home.css';
import '../styles/gameProfileStyles.css';

function Game() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  
  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [gameProfile, setGameProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchLeaderboard();
    checkGameProfile();

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowUserMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkGameProfile = async () => {
    try {
      const { data } = await apiClient.get('/api/game-profile');
      if (data.profile) {
        setGameProfile({...data.profile, high_score: data.high_score});
      } else {
        setShowProfileModal(true);
      }
    } catch (error) {
      setShowProfileModal(true);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const { data } = await apiClient.get('/api/leaderboard?per_page=100');
      
      const rawScores = data.leaderboard || [];
      
      const uniqueScoresMap = new Map();
      rawScores.forEach(score => {
        const key = score.user_id || score.username;
        if (!uniqueScoresMap.has(key)) {
            uniqueScoresMap.set(key, score);
        } else {
             if (score.score > uniqueScoresMap.get(key).score) {
                 uniqueScoresMap.set(key, score);
             }
        }
      });
      
      const processedLeaderboard = Array.from(uniqueScoresMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

      const rankedLeaderboard = processedLeaderboard.map((item, index) => ({
          ...item,
          rank: index + 1
      }));

      setLeaderboard(rankedLeaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleStartGame = async () => {
    if (!gameProfile) {
        setShowProfileModal(true);
        return;
    }
    setIsStarting(true);
    try {
      const gameData = await createGame();
      navigate('/session', { state: { gameId: gameData.game.id } });
    } catch (error) {
      console.error('Failed to start game:', error);
      setIsStarting(false);
    }
  };

  const handleProfileCreationSuccess = (newProfile) => {
    setGameProfile(newProfile);
    setShowProfileModal(false);
    fetchLeaderboard();
  };

  const navigateToProfile = (userId) => {
      if (userId) {
          navigate(`/profile/${userId}`);
      }
  };

  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);
  const paginatedLeaderboard = leaderboard.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const usefulLinks = [
      { title: "Documentation", icon: "book", path: "/docs", external: false },
      { title: "How to Play", icon: "play", path: "/docs", external: false },
      { title: "Discord", icon: "discord", path: "#", external: true },
      { title: "Support", icon: "help", path: "#", external: true },
  ];

  return (
    <div className="test-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="test-background-glow"></div>
      
      <GameProfileModal 
        isOpen={showProfileModal} 
        onSuccess={handleProfileCreationSuccess} 
      />

      {/* Navbar */}
      <header className="home-header">
        <div className="home-header-container">
          <Link to="/" className="home-header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>MapDevineur</span>
          </Link>

          <nav className="home-header-nav">
             <div style={{ position: 'relative', marginLeft: '12px' }} ref={menuRef}>
                <div 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      padding: '4px 12px 4px 4px', 
                      borderRadius: '50px', 
                      border: '1px solid rgba(255, 255, 255, 0.1)', 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                  }}
                >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0D1117', overflow: 'hidden' }}>
                        <DinoSvg type={gameProfile?.avatar || 'dino_idle'} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <span style={{ fontWeight: '500', fontSize: '13px', color: 'white' }}>
                        {gameProfile?.display_name || user?.username}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>

                {showUserMenu && (
                    <div className="user-menu-dropdown" style={{ top: 'calc(100% + 10px)', right: 0 }}>
                        <div className="user-menu-item" onClick={() => navigateToProfile(gameProfile.user_id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            My Profile
                        </div>
                        <div className="user-menu-item" onClick={handleLogout} style={{ borderTop: '1px solid #30363d' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </div>
                    </div>
                )}
             </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '60px', width: '100%', maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start', marginBottom: '40px' }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.9), rgba(30, 58, 138, 0.4))', // Updated to a more blue-inline color
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(10px)',
            height: '100%'
          }}>
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
                zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60A5FA',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                        Official Gamemode
                    </span>
                </div>

                <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Classic Mode
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                    Explore the world and test your geography skills. Guess the correct location based on your surroundings.
                </p>

                {/* Game Rules Grid */}
                <div style={{ 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1px 1fr',
                    gap: '0',
                    marginBottom: '32px'
                }}>
                    {/* Left Column */}
                    <div style={{ padding: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Rounds</div>
                            <div style={{ color: 'white', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                5 Rounds
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Time Limit</div>
                            <div style={{ color: 'white', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
                                120 Sec
                            </div>
                        </div>
                    </div>

                    {/* Vertical Separator */}
                    <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)', height: '100%' }}></div>

                    {/* Right Column */}
                    <div style={{ padding: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                             <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Scoring</div>
                             <div style={{ color: 'white', fontSize: '15px', fontWeight: '600', lineHeight: '1.4' }}>
                                Distance Based
                             </div>
                        </div>
                        <div>
                             <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Bonus</div>
                             <div style={{ color: '#10B981', fontSize: '14px', fontWeight: '600', lineHeight: '1.4' }}>
                                + Points for Accuracy
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
              onClick={handleStartGame}
              disabled={isStarting || showProfileModal}
              className="test-button-solid"
              style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '16px', 
                  fontWeight: '700',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  border: 'none',
                  opacity: (isStarting || showProfileModal) ? 0.7 : 1,
                  cursor: (isStarting || showProfileModal) ? 'not-allowed' : 'pointer'
              }}
            >
              {isStarting ? (
                 <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="home-login-spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span> 
                    Starting...
                 </span>
              ) : 'Play Classic Mode'}
            </button>
          </div>

          {/* Leaderboard Section */}
          <div style={{ 
            background: 'rgba(22, 27, 34, 0.6)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Top 20 Leaderboard
            </h2>
            
            {loadingLeaderboard ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#8b949e' }}>
                 <div className="home-login-spinner" style={{ marginBottom: '12px' }}></div>
                 <p>Loading scores...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <p style={{ flex: 1, textAlign: 'center', color: '#8b949e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No scores yet.</p>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Player</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#8b949e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>High Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLeaderboard.map((entry) => (
                        <tr 
                            key={entry.rank}
                            style={{ 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                            background: entry.username === user?.username ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            transition: 'background 0.2s'
                            }}
                        >
                            <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: entry.rank <= 3 ? '#F59E0B' : 'white' }}>
                            #{entry.rank}
                            </td>
                            <td 
                            style={{ 
                                padding: '12px', 
                                fontSize: '14px',
                                fontWeight: entry.username === user?.username ? '700' : '500',
                                cursor: 'pointer',
                                color: entry.username === user?.username ? 'white' : '#d1d5db'
                            }}
                            onClick={() => navigateToProfile(entry.user_id)}
                            >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {entry.display_name || entry.username}
                                {entry.username === user?.username && <span style={{ fontSize: '10px', background: '#3B82F6', padding: '2px 6px', borderRadius: '4px', color: 'white' }}>YOU</span>}
                            </div>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: '#60A5FA' }}>
                            {entry.score.toLocaleString()}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {/* Custom Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        style={{
                            background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.2)',
                            color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : '#60A5FA',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        Prev
                    </button>

                    <span style={{ fontSize: '13px', color: '#8b949e', fontWeight: '500' }}>
                        Page <span style={{ color: 'white' }}>{currentPage}</span> of {Math.max(1, totalPages)}
                    </span>

                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage >= totalPages}
                        style={{
                            background: currentPage >= totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.2)',
                            color: currentPage >= totalPages ? 'rgba(255,255,255,0.3)' : '#60A5FA',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Useful Links Se */}
        <div style={{ 
          marginTop: '20px', 
          padding: '32px', 
          background: 'rgba(22, 27, 34, 0.4)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px' 
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '24px', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2">
               <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
               <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Useful Links
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {usefulLinks.map((link, index) => (
                <Link 
                    key={index}
                    to={link.path} 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px', 
                        padding: '16px', 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        border: '1px solid rgba(255, 255, 255, 0.05)', 
                        borderRadius: '12px', 
                        textDecoration: 'none',
                        transition: 'opacity 0.3s ease',
                        opacity: 1
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.7';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                >
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px', 
                        background: 'rgba(0, 0, 0, 0.3)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#d1d5db'
                    }}>
                        {/* Icons based on type */}
                        {link.icon === 'book' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
                        {link.icon === 'play' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
                        {link.icon === 'discord' && (
                             <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
                             </svg>
                        )}
                        {link.icon === 'help' && (
                             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                             </svg>
                        )}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>{link.title}</div>
                        <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '2px' }}>
                            {link.external ? 'External Link' : 'Go to page'}
                        </div>
                    </div>
                    {!link.external && <svg style={{ marginLeft: 'auto', color: '#6b7280' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>}
                    {link.external && <svg style={{ marginLeft: 'auto', color: '#6b7280' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>}
                </Link>
            ))}
          </div>
        </div>
      </main>

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

export default Game;