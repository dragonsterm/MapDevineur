import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StreetView from '../components/Game/StreetView';
import GuessMap from '../components/Game/GuessMap';
import Timer from '../components/Game/Timer';
import RoundResult from '../components/Game/RoundResult';
import GameSummary from '../components/Game/GameSummary';
import { getRandomLocations, submitRound, completeGame } from '../services/gameService';

function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameId = location.state?.gameId;

  const [locations, setLocations] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [guess, setGuess] = useState(null);
  const [roundResults, setRoundResults] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGuessMap, setShowGuessMap] = useState(false);

  useEffect(() => {
    if (!gameId) {
      navigate('/game');
      return;
    }

    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRandomLocations();
        
        console.log('Fetched locations:', data.locations);
        
        if (!data.locations || data.locations.length === 0) {
          setError('No locations available. Please contact administrator.');
          return;
        }
        
        setLocations(data.locations);
        setCurrentLocation(data.locations[0]);
        setRoundStartTime(Date.now());
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        setError(error.response?.data?.message || 'Failed to load game locations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [gameId, navigate]);

  const handleGuess = (coordinates) => {
    setGuess(coordinates);
  };

  const handleOpenGuessMap = () => {
    setShowGuessMap(true);
  };

  const handleCloseGuessMap = () => {
    setShowGuessMap(false);
  };

  const handleSubmit = async () => {
    if (!guess || !currentLocation) return;

    const timeTaken = Math.floor((Date.now() - roundStartTime) / 1000);
    
    try {
      const result = await submitRound(gameId, {
        location_id: currentLocation.id,
        round_number: currentRound + 1,
        guess_latitude: guess.lat,
        guess_longitude: guess.lng,
        time_taken: timeTaken,
      });

      setCurrentResult(result.round);
      setRoundResults([...roundResults, result.round]);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit round:', error);
      setError('Failed to submit guess. Please try again.');
    }
  };

  const handleNextRound = () => {
    setShowResult(false);
    setGuess(null);
    setRoundStartTime(Date.now());
    setError(null);

    if (currentRound < 4) {
      const nextRoundIndex = currentRound + 1;
      setCurrentRound(nextRoundIndex);
      setCurrentLocation(locations[nextRoundIndex]);
    } else {
      completeGameSession();
    }
  };

  const completeGameSession = async () => {
    try {
      const result = await completeGame(gameId);
      setTotalScore(result.game.total_score);
      setIsGameComplete(true);
    } catch (error) {
      console.error('Failed to complete game:', error);
      setError('Failed to complete game. Please try again.');
    }
  };

  const handleTimeUp = () => {
    if (!showResult && guess) {
      handleSubmit();
    }
  };

  if (isGameComplete) {
    return <GameSummary totalScore={totalScore} rounds={roundResults} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-xl">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 border border-red-500 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-red-500 text-2xl font-bold mb-4">Error</h2>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={() => navigate('/game')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Back to Game Menu
          </button>
        </div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading location...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      background: '#000'
    }}>
      {/* Header - Fixed at top */}
      <div style={{
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20,
        position: 'relative'
      }}>
        <div style={{ color: '#fff' }}>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>Round {currentRound + 1} of 5</span>
        </div>
        <Timer duration={120} onTimeUp={handleTimeUp} isRunning={!showResult} />
      </div>

      {/* Street View - Full Screen */}
      <div style={{ 
        flex: 1, 
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 70px)',
        overflow: 'hidden'
      }}>
        <StreetView location={currentLocation} />
        
        {/* Menu Button - Left Corner */}
        <button
          onClick={handleOpenGuessMap}
          disabled={showResult}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid #444',
            cursor: showResult ? 'not-allowed' : 'pointer',
            opacity: showResult ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {guess ? 'Change Guess' : 'Make Guess'}
        </button>

        {/* Submit Button (shows when guess is made) */}
        {guess && !showResult && (
          <button
            onClick={handleSubmit}
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              padding: '16px 48px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              zIndex: 10,
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.5)'
            }}
          >
            Submit Guess
          </button>
        )}

        {/* Guess indicator */}
        {guess && !showResult && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            zIndex: 10,
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Guess placed ✓
          </div>
        )}
      </div>

      {/* Guess Map Modal */}
      <GuessMap 
        onGuess={handleGuess} 
        disabled={showResult}
        isOpen={showGuessMap}
        onClose={handleCloseGuessMap}
      />

      {/* Round Result Modal */}
      {showResult && currentResult && (
        <RoundResult result={currentResult} onNextRound={handleNextRound} />
      )}
    </div>
  );
}

export default Session;