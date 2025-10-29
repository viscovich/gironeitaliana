
import React, { useState } from 'react';

interface CoupleInputProps {
  onSubmit: (coupleNames: string[]) => void;
}

export const CoupleInput: React.FC<CoupleInputProps> = ({ onSubmit }) => {
  const [names, setNames] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (names.some(name => name.trim() === '')) {
      setError('Per favore, inserisci i nomi per tutte e 6 le coppie.');
      return;
    }
    setError(null);
    onSubmit(names);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Inserisci le Coppie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {names.map((name, index) => (
          <div key={index}>
            <label htmlFor={`couple-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
              Coppia {index + 1}
            </label>
            <input
              id={`couple-${index}`}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Nome Coppia ${index + 1}`}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        ))}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Inizia Torneo
        </button>
      </form>
    </div>
  );
};
