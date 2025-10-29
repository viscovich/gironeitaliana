import React from 'react';
import type { Standing } from '../types';

interface StandingsTableProps {
  standings: Standing[];
  onProceedToFinals: () => void;
  onGoBack?: () => void;
  showButton?: boolean;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, onProceedToFinals, showButton = true, onGoBack }) => {
  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Classifica Gironi</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-center">Pos.</th>
              <th scope="col" className="px-6 py-3">Coppia</th>
              <th scope="col" className="px-2 py-3 text-center">V</th>
              <th scope="col" className="px-2 py-3 text-center">P</th>
              <th scope="col" className="px-4 py-3 text-center">Diff. Giochi</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <tr key={standing.couple.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                <td className="px-4 py-4 font-bold text-center text-lg">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-white">{standing.couple.name}</td>
                <td className="px-2 py-4 text-center text-green-400">{standing.wins}</td>
                <td className="px-2 py-4 text-center text-red-400">{standing.losses}</td>
                <td className="px-4 py-4 text-center font-mono">
                  {standing.gameDifference > 0 ? `+${standing.gameDifference}` : standing.gameDifference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showButton && (
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
           {onGoBack && (
            <button
              onClick={onGoBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
            >
              &larr; Torna ai Gironi
            </button>
          )}
          <button
            onClick={onProceedToFinals}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Vai alle Finali
          </button>
        </div>
      )}
    </div>
  );
};