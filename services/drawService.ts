import type { Couple, Participant } from '../types';

export const TOTAL_COUPLES = 6;
export const MAX_SEEDS = 6;

const shuffle = <T>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const drawCouples = (participants: Participant[]): Couple[] => {
  if (participants.length !== TOTAL_COUPLES * 2) {
    throw new Error(`Servono ${TOTAL_COUPLES * 2} giocatori per comporre ${TOTAL_COUPLES} coppie.`);
  }

  const seeds = participants.filter(p => p.isSeed);
  if (seeds.length > MAX_SEEDS) {
    throw new Error(`Non possono esserci piu di ${MAX_SEEDS} teste di serie.`);
  }

  const nonSeeds = participants.filter(p => !p.isSeed);
  if (nonSeeds.length < seeds.length) {
    throw new Error('Servono almeno tante teste di serie non seed quante seed per completare le coppie.');
  }

  const couples: Couple[] = [];
  const shuffledSeeds = shuffle(seeds);
  const shuffledNonSeeds = shuffle(nonSeeds);
  let counter = 0;

  shuffledSeeds.forEach(seed => {
    const partner = shuffledNonSeeds.pop();
    if (!partner) {
      throw new Error('Impossibile completare le coppie senza abbinarne due testa di serie.');
    }
    couples.push({
      id: counter++,
      name: `${seed.name} / ${partner.name}`,
      isSeed: true,
    });
  });

  while (shuffledNonSeeds.length > 0) {
    const first = shuffledNonSeeds.pop();
    const second = shuffledNonSeeds.pop();
    if (!first || !second) {
      throw new Error('Numero di partecipanti non valido.');
    }
    couples.push({
      id: counter++,
      name: `${first.name} / ${second.name}`,
      isSeed: false,
    });
  }

  return couples;
};
