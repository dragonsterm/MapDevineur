import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const IconGithub = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);
const IconRefresh = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const IconHome = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconList = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);
const IconArrowLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 12H5m7 7l-7-7 7-7"/></svg>
);

function GameSummary({ totalScore, rounds }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const MAX_SCORE_PER_ROUND = 5000;
  const maxTotalScore = rounds.length * MAX_SCORE_PER_ROUND;
  const scorePercentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;

  let dynamicTitle = "Don't Give Up!"; 
  let titleColor = "text-gray-300"; 
  if (scorePercentage >= 90) { dynamicTitle = "Legendary Score!"; titleColor = "text-yellow-400"; }
  else if (scorePercentage >= 70) { dynamicTitle = "Great Job!"; titleColor = "text-blue-400"; }
  else if (scorePercentage >= 50) { dynamicTitle = "Good Effort!"; titleColor = "text-white"; }

  const masterButtonStyle = "min-w-[200px] px-8 py-4 rounded-lg border-2 border-blue-600 bg-transparent text-white font-bold text-sm tracking-widest uppercase hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 cursor-pointer";

  return (
    <div className="min-h-screen bg-[#020204] text-white font-sans relative flex flex-col items-center justify-center overflow-hidden selection:bg-blue-500/30">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-900/10 rounded-full blur-[150px] opacity-40 animate-pulse"></div>
      </div>

      <div className="absolute top-8 left-8 md:left-12 z-20 flex items-center gap-3">
        <IconGithub className="w-8 h-8 text-white" />
        <span className="text-xl font-bold tracking-tight">MapDevineur</span>
      </div>

      <div className="relative z-10 w-full max-w-7xl px-4 text-center flex flex-col items-center justify-center">
        
        {!showBreakdown ? (
          <div className="animate-fade-in-up flex flex-col items-center gap-4 w-full">
            <h1 className="text-xl md:text-2xl font-bold tracking-[0.4em] uppercase text-gray-600 mb-2">
              GAME COMPLETE
            </h1>
            <h2 className={`text-5xl md:text-7xl font-black tracking-tight ${titleColor} drop-shadow-2xl mb-4`}>
              {dynamicTitle}
            </h2>
            <div className="relative">
                <div className="text-[7rem] md:text-[10rem] leading-none font-black tracking-tighter text-white drop-shadow-2xl">
                  {totalScore.toLocaleString()}
                </div>
                <div className="text-xl md:text-2xl text-gray-500 font-medium mt-4">
                   out of <span className="text-white font-bold">{maxTotalScore.toLocaleString()}</span> pts
                </div>
            </div>
            <div className="w-full max-w-xl h-3 bg-gray-800 rounded-full mt-8 mb-16 overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-linear-to-r from-blue-600 to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center w-full md:w-auto">
              
              <button onClick={() => setShowBreakdown(true)} className={masterButtonStyle}>
                <IconList className="w-5 h-5" />
                <span>ROUND STATS</span>
              </button>

              <Link to="/game" className={masterButtonStyle}>
                <IconRefresh className="w-5 h-5" />
                <span>PLAY AGAIN</span>
              </Link>

              <Link to="/" className={masterButtonStyle}>
                <IconHome className="w-5 h-5" />
                <span>HOME</span>
              </Link>
            </div>
          </div>

        ) : (
          <div className="animate-fade-in flex flex-col items-center w-full max-w-6xl mx-auto">
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Round Breakdown</h2>
            <p className="text-gray-400 text-lg mb-10">Detailed performance report per location</p>

            <div className="w-full bg-[#050505] border-2 border-blue-900 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <table className="w-full border-collapse">
                
                <thead>
                  <tr className="bg-blue-900/20 text-blue-300 uppercase text-sm tracking-widest border-b-2 border-blue-600">
                    <th className="py-6 px-4 font-bold text-center">Round</th>
                    <th className="py-6 px-4 font-bold text-center">Indicator</th>
                    <th className="py-6 px-4 font-bold text-center">Score</th>
                  </tr>
                </thead>

                <tbody>
                  {rounds.map((round, index) => {
                    let statusColor = "bg-red-500";
                    if(round.round_score === 5000) statusColor = "bg-yellow-400";
                    else if(round.round_score > 4000) statusColor = "bg-green-500";
                    else if(round.round_score > 2000) statusColor = "bg-blue-500";

                    return (
                      <tr key={index} className="border-b border-blue-800/40 hover:bg-blue-900/10 transition-colors">
                        
                        <td className="py-6 px-4 text-center">
                          <span className="text-xl md:text-2xl font-bold text-white">Round {index + 1}</span>
                        </td>
                        
                        <td className="py-6 px-4">
                           <div className="flex justify-center items-center h-full">
                             <div className={`w-24 h-2 rounded-full ${statusColor} shadow-[0_0_15px_currentColor]`}></div>
                           </div>
                        </td>

                        <td className="py-6 px-4 text-center">
                          <span className="font-mono text-3xl md:text-4xl font-black text-white tracking-tight">
                            {round.round_score.toLocaleString()}
                          </span>
                          <span className="text-sm text-blue-400 ml-2 font-bold uppercase">PTS</span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-12">
                <button 
                    onClick={() => setShowBreakdown(false)}
                    className={masterButtonStyle}
                >
                    <IconArrowLeft className="w-5 h-5" />
                    <span>BACK TO SCORE</span>
                </button>
            </div>

          </div>
        )}

      </div>
      
      <div className="absolute bottom-6 text-[10px] text-gray-600 font-medium uppercase tracking-widest opacity-50">
         © 2025 MapDevineur • Challenge the World
      </div>

    </div>
  );
}

export default GameSummary;
