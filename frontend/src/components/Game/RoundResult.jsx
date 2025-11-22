function RoundResult({ result, onNextRound }) {
  return (
    // Changed: Positioned at bottom-middle, transparent background, pointer-events-none to let clicks pass through to map
    <div className="fixed inset-0 z-[60] pointer-events-none flex items-end justify-center pb-12">
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl pointer-events-auto transform transition-all animate-slide-up">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Round Complete!
        </h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-gray-400 text-xs uppercase mb-1">Distance</div>
            <div className="text-white font-bold">{result.distance.toFixed(1)} km</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-gray-400 text-xs uppercase mb-1">Time</div>
            <div className="text-white font-bold">{result.time_taken}s</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 border border-blue-500/30">
            <div className="text-blue-400 text-xs uppercase mb-1">Score</div>
            <div className="text-blue-400 font-bold text-lg">{result.round_score}</div>
          </div>
        </div>

        <button
          onClick={onNextRound}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
        >
          Next Round
        </button>
      </div>
    </div>
  );
}

export default RoundResult;