import React from 'react';
import type { Couple } from '../types';

interface FinalRankingProps {
  ranking: Couple[];
  onReset: () => void;
}

const MedalIcon: React.FC<{ position: number }> = ({ position }) => {
  const colors: { [key: number]: string } = {
    1: 'text-yellow-400',
    2: 'text-gray-300',
    3: 'text-yellow-600',
  };
  const iconClass = colors[position];
  if (position > 3) return null;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 inline-block mr-2 ${iconClass}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.5-5.5l-2.7.9 1-3.1-2.5-2 3.2-.2L10 5l1.5 3.1 3.2.2-2.5 2 1 3.1-2.7-.9-1.5 2.6z" />
    </svg>
  );
};


export const FinalRanking: React.FC<FinalRankingProps> = ({ ranking, onReset }) => {
  const getPodiumClass = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-500/20 border-2 border-yellow-500';
      case 1:
        return 'bg-gray-400/20 border-2 border-gray-400';
      case 2:
        return 'bg-yellow-600/20 border-2 border-yellow-600';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-6">Classifica Finale</h2>
      <div className="space-y-3">
        {ranking.map((couple, index) => (
          <div key={couple.id} className={`p-4 rounded-lg flex items-center justify-start ${getPodiumClass(index)}`}>
             <div className="w-20 flex items-center">
                <MedalIcon position={index + 1} />
                <span className={`text-2xl font-bold text-gray-400`}>{index + 1}°</span>
             </div>
             <span className={`text-xl ${index < 3 ? 'text-white font-bold' : 'text-gray-200'}`}>{couple.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Nuovo Torneo
        </button>
      </div>
    </div>
  );
};