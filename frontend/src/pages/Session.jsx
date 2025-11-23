import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StreetView from '../components/Game/StreetView';
import GuessMap from '../components/Game/GuessMap';
import Timer from '../components/Game/Timer';
import RoundResult from '../components/Game/RoundResult';
import GameSummary from '../components/Game/GameSummary';
import { loadGoogleMaps } from '../services/googleMapsLoader';
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
  const [isLoading, setIsLoading] = useState(true);
  const [showGuessMap, setShowGuessMap] = useState(false);
  const [isMapsReady, setIsMapsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    loadGoogleMaps()
      .then(() => {
        if (isMounted) setIsMapsReady(true);
      })
      .catch((err) => {
        console.error("Google Maps failed to load", err);
        if (isMounted) setError("Failed to load game resources.");
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!gameId) {
      navigate('/game');
      return;
    }

    let ignore = false;

    const initRound = async () => {
      try {
        if (!ignore) {
          setIsLoading(true);
          setError(null);
          setGuess(null);
          setShowResult(false); // Ensure result is hidden on new round
          setShowGuessMap(false); // Ensure map is closed on new round
        }

        const data = await getRandomLocations(1);

        if (ignore) return; 

        if (!data.locations || data.locations.length === 0) {
          setError('No locations available.');
          return;
        }

        const newLocation = data.locations[0];

        setTimeout(() => {
          if (!ignore) {
            setCurrentLocation(newLocation);
            setRoundStartTime(Date.now());
            setIsLoading(false);
          }
        }, 500);

      } catch (error) {
        if (!ignore) {
          console.error('Failed to fetch location:', error);
          setError('Failed to load location.');
          setIsLoading(false);
        }
      }
    };

    initRound();

    return () => {
      ignore = true;
    };
  }, [gameId, currentRound, navigate]);

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
      setShowGuessMap(true);

    } catch (error) {
      console.error('Failed to submit round:', error);
      setError('Failed to submit guess.');
    }
  };

  const handleNextRound = () => {
    setShowResult(false);
    setShowGuessMap(false);
    setError(null);
    setCurrentResult(null);

    if (currentRound < 4) {
      setCurrentRound(prev => prev + 1);
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
      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        {isMapsReady && currentLocation && (
           <StreetView location={currentLocation} />
        )}
      </div>

      {/* Loading Overlay */}
      {(!isMapsReady || isLoading) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-white text-lg">
            {!isMapsReady ? 'Initializing Maps...' : `Loading Round ${currentRound + 1}...`}
          </p>
        </div>
      )}

      {/* Header Timer */}
      {!isLoading && (
        <div className="bg-gray-900/80 backdrop-blur border-b border-gray-800 p-4 flex justify-between items-center z-20 shrink-0 relative">
          <div className="text-white font-semibold text-lg">
            Round {currentRound + 1} of 5
          </div>
          <Timer key={currentRound} duration={120} onTimeUp={handleTimeUp} isRunning={!showResult && !isLoading} />
        </div>
      )}

      {/* Main */}
      {!isLoading && !showResult && currentLocation && (
        <button
          onClick={() => setShowGuessMap(true)}
          className="absolute top-20 left-4 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-lg border border-white/20 hover:bg-black transition-all z-20 flex items-center gap-2 font-semibold shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {guess ? 'Change Guess' : 'Make Guess'}
        </button>
      )}

      {/* Guess Map */}
      <GuessMap 
        onGuess={handleGuess} 
        disabled={showResult} 
        isOpen={showGuessMap} 
        onClose={() => setShowGuessMap(false)} 
        currentGuess={guess}
        showResult={showResult}
        actualLocation={currentLocation}
        result={currentResult}
        onSubmit={() => submitGuess(guess)}
      />

      {/* Round Result Overlay */}
      {showResult && currentResult && (
        <RoundResult result={currentResult} onNextRound={handleNextRound} />
      )}

      {/* Error Overlay */}
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