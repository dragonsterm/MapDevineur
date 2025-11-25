import { useEffect, useState, useRef } from 'react';

function Timer({ duration, onTimeUp, isRunning }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);
  
  const width = 120;
  const height = 44;
  const strokeWidth = 3;
  const radius = 20;
  
  const perimeter = (width - 2 * radius) * 2 + (2 * Math.PI * radius);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeUpRef.current) {
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const isEnded = timeLeft === 0;
  const isCritical = timeLeft <= 30 && !isEnded; 
  const isUrgent = timeLeft <= 60;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = timeLeft / duration;
  const dashOffset = perimeter * (1 - progress);

  const normalColor = "white";
  const urgentColor = "#EF4444";
  const currentColor = (isUrgent || isEnded) ? urgentColor : normalColor;

  return (
    <div className="relative flex items-center justify-center">
      {/* Container */}
      <svg width={width + 10} height={height + 10} className="overflow-visible">
         {/* Background */}
         <rect
            x="5"
            y="5"
            width={width}
            height={height}
            rx={radius}
            fill="rgba(20, 20, 20, 0.8)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            className="backdrop-blur-md"
         />
         
         {/* Progress bar */}
         <rect
            x="5"
            y="5"
            width={width}
            height={height}
            rx={radius}
            fill="none"
            stroke={currentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={perimeter}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${isCritical ? 'timer-flash' : ''}`}
            style={{ 
               filter: (isUrgent && !isEnded) ? `drop-shadow(0 0 4px ${urgentColor})` : 'none',
               opacity: isEnded ? 0 : 1 
            }}
         />
      </svg>

      {/* Time */}
      <div 
        className={`absolute inset-0 flex items-center justify-center font-bold tracking-widest transition-colors duration-300 font-mono ${isCritical ? 'timer-flash' : ''}`}
        style={{ color: currentColor }}
      >
        {isEnded ? (
            <span className="text-base font-bold tracking-normal">TIMES UP</span>
        ) : (
            <span className="text-xl">
                {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
        )}
      </div>
    </div>
  );
}

export default Timer;