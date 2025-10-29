import React from 'react';
import type { Match } from '../types';

interface FinalsResultsProps {
  finalMatches: Match[];
}

const FinalMatchDisplay: React.FC<{ match: Match; title: string; }> = ({ match, title }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold text-center text-blue-400 mb-3">{title}</h3>
      <div className="flex items-center justify-between gap-4 text-white">
        <div className="flex-1 text-center font-semibold">{match.couple1.name}</div>
        <div className="flex items-center gap-2 font-bold text-xl">
          <span>{match.score1 ?? '-'}</span>
          <span className="text-gray-400">-</span>
          <span>{match.score2 ?? '-'}</span>
        </div>
        <div className="flex-1 text-center font-semibold">{match.couple2.name}</div>
      </div>
    </div>
  );
};

export const FinalsResults: React.FC<FinalsResultsProps> = ({ finalMatches }) => {
  const titles = ["Finale 1° - 2° Posto", "Finale 3° - 4° Posto", "Finale 5° - 6° Posto"];
  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Risultati Finali</h2>
      <div className="space-y-6">
        {finalMatches.map((match, index) => (
          <FinalMatchDisplay
            key={index}
            match={match}
            title={titles[index]}
          />
        ))}
      </div>
    </div>
  );
};
