import React, { useMemo } from 'react';
import '../../styles/gameStyles.css';

function Compass({ heading }) {
  const pixelsPerDegree = 4; 
  const visualHeading = (360 - heading) % 360;
  const normalizedHeading = (visualHeading % 360 + 360) % 360;
  const translateX = -(normalizedHeading * pixelsPerDegree);

  const directions = [
    { label: 'N', deg: 0 },
    { label: 'NE', deg: 45 },
    { label: 'E', deg: 90 },
    { label: 'SE', deg: 135 },
    { label: 'S', deg: 180 },
    { label: 'SW', deg: 225 },
    { label: 'W', deg: 270 },
    { label: 'NW', deg: 315 },
  ];

  const generateTicks = () => {
    const items = [];
    const startDeg = -360;
    const endDeg = 720; 

    for (let i = startDeg; i <= endDeg; i += 5) {
        const normalizedI = (i % 360 + 360) % 360;
        const isMajor = i % 45 === 0;
        const direction = directions.find(d => d.deg === normalizedI);
        
        items.push(
            <div 
                key={i}
                className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
                style={{ 
                    left: `${i * pixelsPerDegree}px`,
                    width: '40px', 
                    marginLeft: '-20px'
                }}
            >
                {/* Text */}
                {isMajor && direction ? (
                    <span className="text-white font-bold text-sm mb-1 drop-shadow-md tracking-wider">
                        {direction.label}
                    </span>
                ) : (
                    <div className="w-[1.5px] h-2 bg-white/40 mt-3 rounded-full" />
                )}
            </div>
        );
    }
    return items;
  };

  const ticks = useMemo(() => generateTicks(), []);

  return (
    <div className="compass-container">
      {/* Marker */}
      <div className="compass-center-marker" />

      {/* Moving Track */}
      <div 
        className="compass-track"
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {ticks}
      </div>
    </div>
  );
}

export default Compass;