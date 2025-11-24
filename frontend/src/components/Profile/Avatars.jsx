import React from 'react';

const TrashAvatar = ({ type, className, style }) => {
  const getColor = (t) => {
     switch(t) {
         case 'trash_clean': return '#9CA3AF';
         case 'trash_recycle': return '#3B82F6';
         case 'trash_organic': return '#10B981';
         case 'trash_full': return '#F59E0B';
         case 'trash_hazard': return '#EF4444';
         case 'trash_gold': return '#FBBF24';
         default: return '#9CA3AF';
     }
  };
  
  const color = getColor(type);

  const renderBin = () => {
      switch(type) {
          case 'trash_recycle':
             return (
                <g fill={color}>
                    {/* Bin Body */}
                    <path d="M30,35 L35,85 L65,85 L70,35 Z" />
                    {/* Lid */}
                    <rect x="25" y="28" width="50" height="7" rx="2" />
                    <rect x="45" y="23" width="10" height="5" />
                    {/* Recycle Triangle (White overlay) */}
                    <path d="M43,65 L57,65 L50,50 Z" fill="#ffffff" fillOpacity="0.6"/>
                    <path d="M45,63 L55,63 L50,52 Z" fill={color} /> 
                </g>
             );
          case 'trash_full':
             return (
                <g>
                     {/* Trash overflowing */}
                    <circle cx="40" cy="35" r="5" fill="#EF4444" />
                    <rect x="50" y="30" width="10" height="10" fill="#EC4899" transform="rotate(15 55 35)" />
                    <path d="M60,35 L70,25 L75,35 Z" fill="#F59E0B" />
                    
                    {/* Bin Body */}
                    <path d="M30,35 L35,85 L65,85 L70,35 Z" fill={color} />
                    {/* Lid (Tilted) */}
                    <g transform="rotate(-20 25 28)">
                        <rect x="25" y="28" width="50" height="7" rx="2" fill={color} />
                        <rect x="45" y="23" width="10" height="5" fill={color} />
                    </g>
                </g>
             );
          case 'trash_hazard':
             return (
                <g fill={color}>
                    {/* Bin Body */}
                    <path d="M30,35 L35,85 L65,85 L70,35 Z" />
                    {/* Lid */}
                    <rect x="25" y="28" width="50" height="7" rx="2" />
                    <rect x="45" y="23" width="10" height="5" />
                    {/* Hazard Lines */}
                    <path d="M35,45 L65,45 M36,55 L64,55 M37,65 L63,65" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
                </g>
             );
          default: 
             return (
                <g fill={color}>
                    {/* Vertical Ribs/Detail */}
                    <path d="M40,35 L42,80 M50,35 L50,80 M60,35 L58,80" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
                    {/* Main Body */}
                    <path d="M30,35 L35,85 L65,85 L70,35 Z" />
                    {/* Lid */}
                    <rect x="25" y="28" width="50" height="7" rx="2" />
                    {/* Handle */}
                    <rect x="45" y="23" width="10" height="5" />
                </g>
             );
      }
  };

  return (
    <svg viewBox="0 0 100 100" className={className} style={{...style, background: '#1a1a1a', borderRadius: '50%'}}>
        {renderBin()}
    </svg>
  );
};

export const AVATAR_OPTIONS = [
    { id: 'trash_clean', name: 'Standard' },
    { id: 'trash_recycle', name: 'Recycle' },
    { id: 'trash_full', name: 'Overflowing' },
    { id: 'trash_organic', name: 'Organic' },
    { id: 'trash_hazard', name: 'Hazardous' },
    { id: 'trash_gold', name: 'Golden Bin' },
];

export default TrashAvatar;