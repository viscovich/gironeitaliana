import React, { useState } from 'react';
import type { Round } from '../types';

interface RoundRobinProps {
  rounds: Round[];
  onUpdateScore: (roundIndex: number, matchIndex: number, score1: number, score2: number) => void;
  onFinishRounds: () => void;
  onEditCouples: () => void;
}

const MatchInput: React.FC<{
  match: Round['matches'][0];
  roundIndex: number;
  matchIndex: number;
  onUpdateScore: (roundIndex: number, matchIndex: number, score1: number, score2: number) => void;
}> = ({ match, roundIndex, matchIndex, onUpdateScore }) => {
  const [score1, setScore1] = useState(match.score1?.toString() ?? '');
  const [score2, setScore2] = useState(match.score2?.toString() ?? '');

  const handleScoreChange = (s1: string, s2: string) => {
    setScore1(s1);
    setScore2(s2);
    const num1 = parseInt(s1, 10);
    const num2 = parseInt(s2, 10);
    if (!isNaN(num1) && !isNaN(num2)) {
      onUpdateScore(roundIndex, matchIndex, num1, num2);
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <div className="text-center text-sm text-gray-400 font-bold">Campo {match.court}</div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 text-white font-semibold">{match.couple1.name}</div>
          <input
            type="number"
            min="0"
            value={score1}
            onChange={(e) => handleScoreChange(e.target.value, score2)}
            className="w-20 bg-gray-900 border border-gray-600 rounded-md p-2 text-white text-center"
            aria-label={`Punteggio ${match.couple1.name}`}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-white font-semibold">{match.couple2.name}</div>
          <input
            type="number"
            min="0"
            value={score2}
            onChange={(e) => handleScoreChange(score1, e.target.value)}
            className="w-20 bg-gray-900 border border-gray-600 rounded-md p-2 text-white text-center"
            aria-label={`Punteggio ${match.couple2.name}`}
          />
        </div>
      </div>
    </div>
  );
};


export const RoundRobin: React.FC<RoundRobinProps> = ({ rounds, onUpdateScore, onFinishRounds, onEditCouples }) => {
  const [activeRound, setActiveRound] = useState(0);

  const handlePrevRound = () => {
    if (activeRound > 0) {
      setActiveRound(activeRound - 1);
    }
  };

  const handleNextRound = () => {
    if (activeRound < rounds.length - 1) {
      setActiveRound(activeRound + 1);
    }
  };

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-3xl font-bold text-center sm:text-left text-white flex-1">Gironi</h2>
        <button
          onClick={onEditCouples}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          Modifica nomi coppie
        </button>
      </div>
      <div className="flex justify-center mb-6 border-b border-gray-700">
        {rounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveRound(index)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeRound === index
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Turno {index + 1}
          </button>
        ))}
      </div>
      <div>
        {rounds[activeRound].matches.map((match, matchIndex) => (
          <MatchInput
            key={`${match.couple1.id}-${match.couple2.id}`}
            match={match}
            roundIndex={activeRound}
            matchIndex={matchIndex}
            onUpdateScore={onUpdateScore}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handlePrevRound}
          disabled={activeRound === 0}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &larr; Turno Precedente
        </button>

        {activeRound === rounds.length - 1 ? (
          <button
            onClick={onFinishRounds}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Calcola Classifica
          </button>
        ) : (
          <button
            onClick={handleNextRound}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
          >
            Turno Successivo &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
