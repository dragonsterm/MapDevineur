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

  const fetchNextLocation = async (roundNumber) => {
    try {
      setIsLoading(true);
      setError(null);
      setGuess(null);
  
      
      const data = await getRandomLocations(1);
      
      if (!data.locations || data.locations.length === 0) {
        setError('No locations available.');
        return;
      }
      
      const newLocation = data.locations[0];
    
      setTimeout(() => {
        setCurrentLocation(newLocation);
        setRoundStartTime(Date.now());
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Failed to fetch location:', error);
      setError('Failed to load location.');
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
      setError('Failed to submit guess.');
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
      fetchNextLocation(nextRoundIndex + 1);
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
      setError('Failed to complete game.');
    }
  };

  const handleTimeUp = () => {
    if (showResult) return;
    const guessForSubmit = guess || { lat: 0, lng: 0 };
    submitGuess(guessForSubmit);
  };

  if (isGameComplete) {
    return <GameSummary totalScore={totalScore} rounds={roundResults} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center z-20 shrink-0">
        <div className="text-white font-semibold text-lg">
          Round {currentRound + 1} of 5
        </div>
        <Timer key={currentRound} duration={120} onTimeUp={handleTimeUp} isRunning={!showResult && !isLoading} />
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        
        {/* The Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
             <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4" />
             <p className="text-white text-lg">Loading Round {currentRound + 1}...</p>
          </div>
        )}

        {/* The Map */}
        <StreetView location={currentLocation} />

        {/* Game Controls */}
        {!isLoading && !showResult && currentLocation && (
          <>
            <button
              onClick={() => setShowGuessMap(true)}
              className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-lg border border-white/20 hover:bg-black transition-all z-20 flex items-center gap-2 font-semibold shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {guess ? 'Change Guess' : 'Make Guess'}
            </button>

            {guess && (
              <button
                onClick={() => submitGuess(guess)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-4 rounded-lg font-bold text-lg shadow-xl z-20 hover:scale-105 transition-transform"
              >
                Submit Guess
              </button>
            )}
          </>
        )}
      </div>

      <GuessMap 
        onGuess={handleGuess} 
        disabled={showResult} 
        isOpen={showGuessMap} 
        onClose={() => setShowGuessMap(false)} 
        currentGuess={guess} 
      />

      {showResult && currentResult && (
        <RoundResult result={currentResult} onNextRound={handleNextRound} />
      )}

      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="bg-gray-900 border border-red-500 p-8 rounded-lg max-w-md text-center">
             <h3 className="text-red-500 text-xl font-bold mb-2">Error</h3>
             <p className="text-white mb-4">{error}</p>
             <button onClick={() => navigate('/game')} className="bg-blue-600 text-white px-4 py-2 rounded">Exit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Session;