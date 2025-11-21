import { useEffect, useState } from 'react';

function Timer({ duration, onTimeUp, isRunning }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default Timer;