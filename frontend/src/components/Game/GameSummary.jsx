import { Link } from 'react-router-dom';

function GameSummary({ totalScore, rounds }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Game Complete!
        </h1>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 mb-8">
          <p className="text-white text-center text-lg mb-2">Total Score</p>
          <p className="text-white text-center text-5xl font-bold">{totalScore}</p>
        </div>

        <div className="space-y-3 mb-8">
          {rounds.map((round, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
              <span className="text-gray-300">Round {index + 1}</span>
              <span className="text-white font-semibold">{round.round_score} pts</span>
            </div>
          ))}
        </div>

        <Link
          to="/game"
          className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default GameSummary;