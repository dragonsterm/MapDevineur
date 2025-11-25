import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; 

// --- IMPORTS BACKEND ---
import { createGame } from '../services/gameService';
import apiClient from '../services/api';
import GameProfileModal from '../components/Profile/GameProfileModal';

// Import CSS custom
import '../components/test.css'; 
import './home.css'; 

// --- ICONS ---
const IconTrophy = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);
const IconUser = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
);
const IconGithub = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);
const IconClose = ({ className, onClick }) => (
    <svg onClick={onClick} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{cursor: 'pointer'}}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [isStarting, setIsStarting] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [gameProfile, setGameProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // --- USE EFFECT ---
  useEffect(() => {
    checkGameProfile();
  }, []);

  useEffect(() => {
    if (showLeaderboardModal) {
        fetchLeaderboard();
    }
  }, [showLeaderboardModal]);

  // --- LOGIC ---
  const checkGameProfile = async () => {
    try {
      const { data } = await apiClient.get('/api/game-profile');
      if (data.profile) {
        setGameProfile(data.profile);
      } else {
        setShowProfileModal(true);
      }
    } catch (error) {
      if (user) setShowProfileModal(true);
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

  const handleStartGame = async () => {
    if (!user) { navigate('/login'); return; }
    if (!gameProfile) { setShowProfileModal(true); return; }

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
  };

  // --- DATA CARD ---
  const classicMode = {
    title: "Classic Mode",
    description: [
      "5 rounds of guessing locations around the world",
      "120 seconds to guess",
      "Closer you get to the correct location, the higher your score",
      "Global leaderboard featured mode"
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-blue-500/30">
      
      {/* --- COMPONENT MODAL PROFILE --- */}
      <GameProfileModal 
        isOpen={showProfileModal} 
        onSuccess={handleProfileSuccess} 
      />

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 w-full z-50 h-20 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <IconGithub className="w-8 h-8 text-white" />
             <span className="text-xl font-bold tracking-tight text-white">MapDevineur</span>
          </div>
          
          <button 
            onClick={() => setShowLeaderboardModal(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffffff10] hover:bg-[#ffffff20] border border-white/5 transition-all text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white cursor-pointer z-50"
          >
            <IconTrophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </div>

        <div className="flex items-center gap-6">
           {user ? (
             <>
                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col justify-center h-full">
                     <span className="text-sm font-bold text-white leading-none">
                        {gameProfile ? gameProfile.display_name : user.username}
                     </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg border-2 border-black">
                     <IconUser className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button onClick={logout} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest bg-[#1a1a1a] hover:bg-red-500/20 border border-[#333] hover:border-red-500 px-4 py-2 rounded transition-all cursor-pointer z-50">
                  Logout
                </button>
             </>
           ) : (
             <Link to="/login" className="text-sm font-bold text-white hover:text-blue-400 z-50">Login</Link>
           )}
        </div>
      </header>


      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-10 px-4">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="test-section-title-center home-gamemode-title" style={{ marginTop: '0' }}>
            Ready to start guessing?
          </h2>
        </div>

        <div className="flex justify-center w-full max-w-md">
            <div className="home-gamemode-card" style={{ width: '100%', margin: '0' }}> 
              <div className="home-gamemode-card-icon">
                {classicMode.icon}
              </div>
              <div className="home-gamemode-card-header">
                <h3 className="home-gamemode-card-title">{classicMode.title}</h3>
              </div>
              <ul className="home-gamemode-features-list">
                {classicMode.description.map((feature, idx) => (
                  <li key={idx} className="home-gamemode-feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className="test-button-solid home-gamemode-play-btn"
                onClick={handleStartGame}
                disabled={isStarting}
                style={{ cursor: isStarting ? 'not-allowed' : 'pointer' }}
              >
                {isStarting ? 'Starting Game...' : 'Play Now'}
              </button>
            </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none z-10">
         <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            © 2025 MapDevineur 
         </span>
      </div>

      {/* --- MODAL LEADERBOARD (TAJAM/SHARP) --- */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
           
           {/* HAPUS rounded-2xl untuk membuatnya tajam */}
           <div className="bg-[#050505] border border-[#333] w-full max-w-5xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col max-h-[80vh]">
              
              {/* Header Modal */}
              <div className="flex justify-between items-center p-8 border-b border-[#333] bg-[#0a0a0a]">
                  <h3 className="text-3xl font-bold flex items-center gap-4 text-white tracking-tight">
                      <IconTrophy className="w-8 h-8 text-yellow-500"/> 
                      GLOBAL RANKING
                  </h3>
                  <button 
                    onClick={() => setShowLeaderboardModal(false)} 
                    className="p-2 hover:bg-[#222] text-gray-500 hover:text-white transition-colors"
                  >
                      <IconClose className="w-8 h-8"/>
                  </button>
              </div>

              {/* Table Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
                 {loadingLeaderboard ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 font-mono text-lg animate-pulse">Retrieving Data...</span>
                    </div>
                 ) : leaderboard.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 text-lg">No records found. Play a game to be the first!</div>
                 ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0a0a0a] text-sm uppercase text-gray-400 font-bold sticky top-0 z-10 border-b border-[#333]">
                           <tr>
                              <th className="py-6 px-8 tracking-wider w-32">Rank</th>
                              <th className="py-6 px-8 tracking-wider">Agent Name</th>
                              <th className="py-6 px-8 text-right tracking-wider">High Score</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222] text-base">
                           {leaderboard.map((entry) => (
                              <tr 
                                key={entry.rank} 
                                className={`${entry.username === user?.username ? "bg-blue-900/10" : "hover:bg-[#111]"} transition-colors`}
                              >
                                 <td className="py-6 px-8">
                                    {/* HAPUS rounded-lg untuk kotak ranking tajam */}
                                    <div className={`font-mono font-bold text-xl flex items-center justify-center w-10 h-10 ${
                                        entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                        entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                                        entry.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                                        'text-gray-500'
                                    }`}>
                                        #{entry.rank}
                                    </div>
                                 </td>
                                 <td className="py-6 px-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center border border-[#333]">
                                            <IconUser className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-bold text-lg ${entry.username === user?.username ? "text-blue-400" : "text-white"}`}>
                                                {entry.display_name || entry.username}
                                            </span>
                                            {entry.username === user?.username && (
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">That's You</span>
                                            )}
                                        </div>
                                    </div>
                                 </td>
                                 <td className="py-6 px-8 text-right">
                                     <span className="font-mono text-2xl font-bold text-white tracking-tight">
                                        {entry.score.toLocaleString()}
                                     </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                    </table>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

export default Home;
