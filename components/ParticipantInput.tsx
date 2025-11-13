import React, { useMemo, useState } from 'react';
import type { Participant } from '../types';
import { MAX_SEEDS, TOTAL_COUPLES } from '../services/drawService';

interface ParticipantInputProps {
  onDraw: (participants: Participant[]) => void;
  error?: string | null;
}

const TOTAL_PLAYERS = TOTAL_COUPLES * 2;

const createEmptyParticipants = () =>
  Array.from({ length: TOTAL_PLAYERS }, (_, index) => ({
    id: index,
    name: '',
    isSeed: false,
  }));

export const ParticipantInput: React.FC<ParticipantInputProps> = ({ onDraw, error }) => {
  const [participants, setParticipants] = useState<Participant[]>(createEmptyParticipants);
  const [formError, setFormError] = useState<string | null>(null);

  const seedCount = useMemo(
    () => participants.filter(participant => participant.isSeed).length,
    [participants]
  );

  const handleNameChange = (index: number, value: string) => {
    setParticipants(prev => {
      const next = [...prev];
      next[index] = { ...next[index], name: value };
      return next;
    });
  };

  const handleSeedToggle = (index: number) => {
    setParticipants(prev => {
      const next = [...prev];
      const current = next[index];
      if (!current.isSeed && seedCount >= MAX_SEEDS) {
        return prev;
      }
      next[index] = { ...current, isSeed: !current.isSeed };
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (participants.some(participant => participant.name.trim() === '')) {
      setFormError('Inserisci il nome di tutti i partecipanti.');
      return;
    }
    const normalizedNames = participants.map(participant => participant.name.trim().toLowerCase());
    const uniqueNames = new Set(normalizedNames);
    if (uniqueNames.size !== normalizedNames.length) {
      setFormError('Non puoi inserire due volte lo stesso nome.');
      return;
    }
    setFormError(null);
    onDraw(participants.map((participant, index) => ({ ...participant, id: index })));
  };

  const handleReset = () => {
    setParticipants(createEmptyParticipants());
    setFormError(null);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Inserisci i partecipanti</h2>
        <div className="text-sm text-gray-300">
          Teste di serie: {seedCount}/{MAX_SEEDS}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {participants.map((participant, index) => (
          <div key={participant.id} className="space-y-2">
            <label htmlFor={`participant-${index}`} className="block text-sm font-medium text-gray-300">
              Giocatore {index + 1}
            </label>
            <div className="flex items-center gap-3">
              <input
                id={`participant-${index}`}
                type="text"
                value={participant.name}
                onChange={(event) => handleNameChange(index, event.target.value)}
                placeholder={`Nome giocatore ${index + 1}`}
                className="flex-1 min-w-0 max-w-[70%] bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
              <label className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-semibold whitespace-nowrap ${
                participant.isSeed
                  ? 'bg-yellow-500/20 border-yellow-400 text-yellow-200'
                  : seedCount >= MAX_SEEDS
                  ? 'bg-gray-800 border-gray-600 text-gray-500'
                  : 'bg-gray-800 border-gray-600 text-gray-200'
              }`}>
                <input
                  type="checkbox"
                  checked={participant.isSeed}
                  onChange={() => handleSeedToggle(index)}
                  disabled={!participant.isSeed && seedCount >= MAX_SEEDS}
                  className="w-4 h-4 accent-yellow-400"
                />
                Testa di serie
              </label>
            </div>
          </div>
        ))}
        {(formError || error) && (
          <p className="text-red-400 text-sm">
            {formError || error}
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Estrai coppie
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-lg border border-gray-500 text-gray-200 hover:bg-gray-700 transition"
          >
            Pulisci campi
          </button>
        </div>
      </form>
    </div>
  );
};
