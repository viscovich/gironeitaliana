
import React, { useState } from 'react';
import type { Match } from '../types';

interface FinalsProps {
  finalMatches: Match[];
  onUpdateScore: (matchIndex: number, score1: number, score2: number) => void;
  onFinishFinals: () => void;
}

const FinalMatchInput: React.FC<{
  match: Match;
  matchIndex: number;
  title: string;
  onUpdateScore: (matchIndex: number, score1: number, score2: number) => void;
}> = ({ match, matchIndex, title, onUpdateScore }) => {
  const [score1, setScore1] = useState(match.score1?.toString() ?? '');
  const [score2, setScore2] = useState(match.score2?.toString() ?? '');

  const handleScoreChange = (s1: string, s2: string) => {
    setScore1(s1);
    setScore2(s2);
    const num1 = parseInt(s1, 10);
    const num2 = parseInt(s2, 10);
    if (!isNaN(num1) && !isNaN(num2)) {
      onUpdateScore(matchIndex, num1, num2);
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold text-center text-blue-400 mb-3">{title}</h3>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-semibold">{match.couple1.name}</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={score1}
            onChange={(e) => handleScoreChange(e.target.value, score2)}
            className="w-16 bg-gray-800 border border-gray-600 rounded-md p-2 text-white text-center"
            aria-label={`Final score for ${match.couple1.name}`}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min="0"
            value={score2}
            onChange={(e) => handleScoreChange(score1, e.target.value)}
            className="w-16 bg-gray-800 border border-gray-600 rounded-md p-2 text-white text-center"
            aria-label={`Final score for ${match.couple2.name}`}
          />
        </div>
        <div className="flex-1 text-center font-semibold">{match.couple2.name}</div>
      </div>
    </div>
  );
};

export const Finals: React.FC<FinalsProps> = ({ finalMatches, onUpdateScore, onFinishFinals }) => {
  const titles = ["Finale 1° - 2° Posto", "Finale 3° - 4° Posto", "Finale 5° - 6° Posto"];
  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Finali</h2>
      <div className="space-y-6">
        {finalMatches.map((match, index) => (
          <FinalMatchInput
            key={index}
            match={match}
            matchIndex={index}
            title={titles[index]}
            onUpdateScore={onUpdateScore}
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onFinishFinals}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Mostra Classifica Finale
        </button>
      </div>
    </div>
  );
};
