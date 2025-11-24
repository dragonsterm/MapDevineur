import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { createGame } from '../services/gameService';
import apiClient from '../services/api';
import GameProfileModal from '../components/Profile/GameProfileModal';

function Game() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  
  // Profile State
  const [gameProfile, setGameProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    checkGameProfile();
  }, []);

  const checkGameProfile = async () => {
    try {
      const { data } = await apiClient.get('/api/game-profile');
      if (data.profile) {
        setGameProfile(data.profile);
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

  const handleProfileSuccess = (newProfile) => {
    setGameProfile(newProfile);
    setShowProfileModal(false);
    fetchLeaderboard();
  };

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '40px 20px', position: 'relative' }}>
      
      <GameProfileModal 
        isOpen={showProfileModal} 
        onSuccess={handleProfileSuccess} 
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
            {gameProfile ? (
                <>Hi, <span style={{ color: '#60A5FA' }}>{gameProfile.display_name}#{gameProfile.id}</span></>
            ) : (
                <>Welcome, {user?.username}!</>
            )}
          </h1>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #666',
              color: '#999',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Play Section */}
          <div style={{ 
            background: '#1a1a1a', 
            border: '1px solid #333', 
            borderRadius: '12px', 
            padding: '40px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Start Playing</h2>
            <p style={{ color: '#999', marginBottom: '30px' }}>
              Test your geography knowledge in 5 rounds
            </p>
            <button
              onClick={handleStartGame}
              disabled={isStarting || showProfileModal}
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                border: 'none',
                color: '#fff',
                padding: '16px 32px',
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
            background: '#1a1a1a', 
            border: '1px solid #333', 
            borderRadius: '12px', 
            padding: '30px'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
              Top 10 Leaderboard
            </h2>
            
            {loadingLeaderboard ? (
              <p style={{ textAlign: 'center', color: '#999' }}>Loading...</p>
            ) : leaderboard.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>No scores yet. Be the first!</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#999', fontSize: '14px' }}>Rank</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#999', fontSize: '14px' }}>Player</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#999', fontSize: '14px' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr 
                      key={entry.rank}
                      style={{ 
                        borderBottom: '1px solid #2a2a2a',
                        background: entry.username === user?.username ? '#1e3a5f' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px', fontSize: '16px' }}>
                        #{entry.rank}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        fontSize: '16px',
                        fontWeight: entry.username === user?.username ? 'bold' : 'normal'
                      }}>
                        {/* Display Name */}
                        {entry.display_name || entry.username}
                        {entry.username === user?.username && ' (You)'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '16px', fontWeight: 'bold' }}>
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
          background: '#1a1a1a', 
          border: '1px solid #333', 
          borderRadius: '12px' 
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>How to Play</h3>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#ccc' }}>
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