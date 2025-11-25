import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { createGame } from '../services/gameService';
import apiClient from '../services/api';
import GameProfileModal from '../components/Profile/GameProfileModal';
import DinoSvg from '../components/Profile/Avatars';
import './home.css';
import '../styles/gameProfileStyles.css';

function Game() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  
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
      const { data } = await apiClient.get('/api/leaderboard?per_page=10');
      setLeaderboard(data.leaderboard || []);
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

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '40px 20px', position: 'relative' }}>
      
      {/* Profile Creation */}
      <GameProfileModal 
        isOpen={showProfileModal} 
        onSuccess={handleProfileCreationSuccess} 
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="#60A5FA">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
             </svg>
             <span style={{ fontWeight: 'bold', fontSize: '20px' }}>MapDevineur</span>
           </div>

           {/* User Menu */}
           <div style={{ position: 'relative' }} ref={menuRef}>
              <div 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    background: '#161b22', 
                    padding: '6px 16px 6px 6px', 
                    borderRadius: '50px', 
                    border: '1px solid #30363d', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
              >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0D1117', overflow: 'hidden' }}>
                      <DinoSvg type={gameProfile?.avatar || 'dino_idle'} style={{ width: '100%', height: '100%' }} />
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>
                      {gameProfile?.display_name || user?.username}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                  </svg>
              </div>

              {showUserMenu && (
                  <div className="user-menu-dropdown">
                      <div className="user-menu-item" onClick={() => navigateToProfile(gameProfile.user_id)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                          </svg>
                          My Profile
                      </div>
                      <div className="user-menu-item" onClick={handleLogout} style={{ borderTop: '1px solid #30363d' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Logout
                      </div>
                  </div>
              )}
           </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Play Section */}
          <div style={{ 
            background: '#161b22', 
            border: '1px solid #30363d', 
            borderRadius: '16px', 
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>Start Playing</h2>
            <p style={{ color: '#8b949e', marginBottom: '30px' }}>
              Test your geography knowledge in 5 rounds
            </p>
            <button
              onClick={handleStartGame}
              disabled={isStarting || showProfileModal}
              className="test-button-solid"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                border: 'none',
                color: '#fff',
                padding: '16px 32px',
                width: '100%',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: (isStarting || showProfileModal) ? 'not-allowed' : 'pointer',
                opacity: (isStarting || showProfileModal) ? 0.6 : 1
              }}
            >
              {isStarting ? 'Starting...' : 'Play Now'}
            </button>
          </div>

          {/* Leaderboard Section */}
          <div style={{ 
            background: '#161b22', 
            border: '1px solid #30363d', 
            borderRadius: '16px', 
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
              Top 10 Leaderboard
            </h2>
            
            {loadingLeaderboard ? (
              <p style={{ textAlign: 'center', color: '#8b949e' }}>Loading...</p>
            ) : leaderboard.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#8b949e' }}>No scores yet. Be the first!</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #30363d' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontSize: '12px', textTransform: 'uppercase' }}>Rank</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontSize: '12px', textTransform: 'uppercase' }}>Player</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#8b949e', fontSize: '12px', textTransform: 'uppercase' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr 
                      key={entry.rank}
                      style={{ 
                        borderBottom: '1px solid #21262d',
                        background: entry.username === user?.username ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: entry.rank <= 3 ? '#F59E0B' : 'white' }}>
                        #{entry.rank}
                      </td>
                      <td 
                        style={{ 
                            padding: '12px', 
                            fontSize: '14px',
                            fontWeight: entry.username === user?.username ? 'bold' : 'normal',
                            cursor: 'pointer',
                            color: '#60A5FA'
                        }}
                        onClick={() => navigateToProfile(entry.user_id)}
                      >
                        {entry.display_name || entry.username}
                        {entry.username === user?.username && ' (You)'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {entry.score.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ 
          marginTop: '40px', 
          padding: '30px', 
          background: '#161b22', 
          border: '1px solid #30363d', 
          borderRadius: '16px' 
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px', fontWeight: 'bold' }}>How to Play</h3>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#8b949e' }}>
            <li>Click <strong style={{ color: '#60A5FA' }}>"Play Now"</strong> to start a new game</li>
            <li>Select a location from the map to begin the round</li>
            <li>Explore the Street View and figure out where you are</li>
            <li>Click <strong style={{ color: '#60A5FA' }}>"Make Guess"</strong> and place a marker on the map</li>
            <li>Submit your guess before time runs out</li>
            <li>Complete all 5 rounds to submit your final score</li>
          </ol>
        </div>
      </div>
    </main>
  );
}

export default Game;