function RoundResult({ result, onNextRound }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Round Complete!
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-300">
            <span>Distance:</span>
            <span className="text-white font-semibold">{result.distance.toFixed(2)} km</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Time taken:</span>
            <span className="text-white font-semibold">{result.time_taken}s</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Score:</span>
            <span className="text-blue-400 font-bold text-xl">{result.round_score}</span>
          </div>
        </div>

        <button
          onClick={onNextRound}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Next Round
        </button>
      </div>
    </div>
  );
}

export default RoundResult;