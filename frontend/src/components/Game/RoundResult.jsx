import { useEffect } from 'react';
import '../../styles/gameStyles.css';

function RoundResult({ result, onNextRound }) {
  const maxScore = 5000; 
  let progressPercentage = (result.round_score / maxScore) * 100;

  if (result.round_score < maxScore && progressPercentage > 98) {
    progressPercentage = 98;
  }
  
  progressPercentage = Math.min(100, progressPercentage);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        onNextRound();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNextRound]);

  return (
    <div className="round-result-container">
      <div className="round-result-card">
        
        {/* Score */}
        <h2 className="round-score">
          {Math.round(result.round_score)} points
        </h2>

        {/* Progress Bar */}
        <div className="round-progress-track">
          <div 
            className="round-progress-fill" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>

        {/* Distance Info */}
        <div className="round-distance-text">
          Your guess was
          <span className="round-distance-badge">
            {result.distance.toFixed(1)} KM
          </span>
          from the location
        </div>

        {/* Button */}
        <button onClick={onNextRound} className="round-next-btn">
          Start Next Round
        </button>

        {/* Keyboard Hint */}
        <div className="round-keyboard-hint">
          Hit <span className="round-key-badge">SPACE</span> to continue
        </div>

      </div>
    </div>
  );
}

export default RoundResult;