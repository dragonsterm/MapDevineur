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
  const [isLoading, setIsLoading] = useState(false);
  const [showGuessMap, setShowGuessMap] = useState(false);
  const [streetViewKey, setStreetViewKey] = useState(0);

  const fetchNextLocation = async (roundNumber) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentLocation(null);
      setGuess(null);
      
      console.log(`[Round ${roundNumber}] Fetching new location...`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await getRandomLocations(1);
      
      if (!data.locations || data.locations.length === 0) {
        setError('No locations available. Please contact administrator.');
        return;
      }
      
      const newLocation = data.locations[0];
      console.log(`[Round ${roundNumber}] Location fetched`);
      
      setTimeout(() => {
        setCurrentLocation(newLocation);
        setRoundStartTime(Date.now());
        setStreetViewKey(prev => prev + 1);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to fetch location:', error);
      setError(error.response?.data?.message || 'Failed to load location. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!gameId) {
      navigate('/game');
      return;
    }

    fetchNextLocation();
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

  const submitGuess = async (guessToSubmit) => {
    if (!guessToSubmit || !currentLocation) return;

    const timeTaken = Math.min(120, Math.floor((Date.now() - roundStartTime) / 1000));
    
    try {
      const result = await submitRound(gameId, {
        location_id: currentLocation.id,
        round_number: currentRound + 1,
        guess_latitude: guessToSubmit.lat,
        guess_longitude: guessToSubmit.lng,
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
    setShowGuessMap(false);
    setGuess(null);
    setError(null);
    setCurrentResult(null);

    if (currentRound < 4) {
      const nextRoundIndex = currentRound + 1;
      setCurrentRound(nextRoundIndex);
      
      setTimeout(() => {
        fetchNextLocation(nextRoundIndex + 1);
      }, 2000);
      
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
    if (showResult) return;
    // If no guess, submit a dummy guess at (0,0)
    const guessForSubmit = guess || { lat: 0, lng: 0 };
    submitGuess(guessForSubmit);
  };

  if (isGameComplete) {
    return <GameSummary totalScore={totalScore} rounds={roundResults} />;
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

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex', 
      flexDirection: 'column',
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
        flexShrink: 0
      }}>
        <div style={{ color: '#fff' }}>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>
            Round {currentRound + 1} of 5
          </span>
        </div>
        <Timer key={currentRound} duration={120} onTimeUp={handleTimeUp} isRunning={!showResult && !isLoading} />
      </div>

      {/* Street View - Full Screen */}
      <div style={{ 
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0a0a'
      }}>
        {isLoading ? (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{
                display: 'inline-block',
                width: '48px',
                height: '48px',
                border: '4px solid #333',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }} />
              <p style={{ fontSize: '18px' }}>Loading round {currentRound + 1}...</p>
            </div>
          </div>
        ) : currentLocation ? (
          <>
            <StreetView key={streetViewKey} location={currentLocation} />
            
            {/* Menu Button - Left Corner */}
            <button
              onClick={handleOpenGuessMap}
              disabled={showResult}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: showResult ? 'not-allowed' : 'pointer',
                opacity: showResult ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 1000,
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
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
                onClick={() => submitGuess(guess)}
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
                  zIndex: 1000,
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
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                zIndex: 1000,
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}>
                Guess placed ✓
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Guess Map Modal */}
      <GuessMap 
        onGuess={handleGuess} 
        disabled={showResult}
        isOpen={showGuessMap}
        onClose={handleCloseGuessMap}
        currentGuess={guess}
      />

      {/* Round Result Modal */}
      {showResult && currentResult && (
        <RoundResult result={currentResult} onNextRound={handleNextRound} />
      )}
    </div>
  );
}

export default Session;