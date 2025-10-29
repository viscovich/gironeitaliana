import React, { useState, useEffect } from 'react';
import { CoupleInput } from './components/CoupleInput';
import { RoundRobin } from './components/RoundRobin';
import { StandingsTable } from './components/StandingsTable';
import { Finals } from './components/Finals';
import { FinalRanking } from './components/FinalRanking';
import { FinalsResults } from './components/FinalsResults';
import { generateRoundRobinSchedule } from './services/tournamentService';
import type { Couple, Round, Match, Standing, TournamentPhase } from './types';

function App() {
  const [phase, setPhase] = useState<TournamentPhase>('SETUP');
  const [couples, setCouples] = useState<Couple[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [finalMatches, setFinalMatches] = useState<Match[]>([]);
  const [finalRanking, setFinalRanking] = useState<Couple[]>([]);
  
  // New state for navigation
  const [showStandingsInFinals, setShowStandingsInFinals] = useState(false);
  const [completedView, setCompletedView] = useState<'ranking' | 'standings' | 'finals'>('ranking');


  const handleCouplesSubmit = (coupleNames: string[]) => {
    const newCouples = coupleNames.map((name, index) => ({ id: index, name }));
    setCouples(newCouples);
    const schedule = generateRoundRobinSchedule(newCouples);
    setRounds(schedule);
    setPhase('ROUND_ROBIN');
  };

  const handleUpdateScore = (roundIndex: number, matchIndex: number, score1: number, score2: number) => {
    const newRounds = [...rounds];
    const match = newRounds[roundIndex].matches[matchIndex];
    match.score1 = score1;
    match.score2 = score2;
    if (score1 > score2) {
      match.winner = match.couple1;
    } else if (score2 > score1) {
      match.winner = match.couple2;
    } else {
      match.winner = null; // Draw
    }
    setRounds(newRounds);
  };

  const calculateStandings = () => {
    const stats: { [key: number]: Standing } = couples.reduce((acc, couple) => {
      acc[couple.id] = {
        couple,
        wins: 0,
        losses: 0,
        gamesWon: 0,
        gamesLost: 0,
        gameDifference: 0,
      };
      return acc;
    }, {} as { [key: number]: Standing });

    rounds.forEach(round => {
      round.matches.forEach(match => {
        if (match.score1 !== null && match.score2 !== null) {
          const stats1 = stats[match.couple1.id];
          const stats2 = stats[match.couple2.id];

          stats1.gamesWon += match.score1;
          stats1.gamesLost += match.score2;
          stats2.gamesWon += match.score2;
          stats2.gamesLost += match.score1;

          if (match.winner) {
              if (match.winner.id === match.couple1.id) {
                  stats1.wins++;
                  stats2.losses++;
              } else {
                  stats2.wins++;
                  stats1.losses++;
              }
          }
        }
      });
    });

    Object.values(stats).forEach(stat => {
      stat.gameDifference = stat.gamesWon - stat.gamesLost;
    });

    const sortedStandings = Object.values(stats).sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return b.gameDifference - a.gameDifference;
    });
    
    setStandings(sortedStandings);
  };

  const handleFinishRounds = () => {
    calculateStandings();
    setPhase('STANDINGS');
  };

  const handleProceedToFinals = () => {
    setShowStandingsInFinals(false);
    const finals: Match[] = [
      { // 1st vs 2nd
        couple1: standings[0].couple,
        couple2: standings[1].couple,
        score1: null,
        score2: null,
        winner: null,
        court: 1,
      },
      { // 3rd vs 4th
        couple1: standings[2].couple,
        couple2: standings[3].couple,
        score1: null,
        score2: null,
        winner: null,
        court: 2,
      },
      { // 5th vs 6th
        couple1: standings[4].couple,
        couple2: standings[5].couple,
        score1: null,
        score2: null,
        winner: null,
        court: 3,
      },
    ];
    setFinalMatches(finals);
    setPhase('FINALS');
  };

  const handleUpdateFinalScore = (matchIndex: number, score1: number, score2: number) => {
    const newFinals = [...finalMatches];
    const match = newFinals[matchIndex];
    match.score1 = score1;
    match.score2 = score2;
    if (score1 > score2) {
      match.winner = match.couple1;
    } else if (score2 > score1) {
      match.winner = match.couple2;
    } else {
      match.winner = null;
    }
    setFinalMatches(newFinals);
  };

  const handleFinishFinals = () => {
    const ranking: Couple[] = [];
    finalMatches.forEach(match => {
      if (match.winner) {
        const loser = match.winner.id === match.couple1.id ? match.couple2 : match.couple1;
        ranking.push(match.winner);
        ranking.push(loser);
      } else {
        ranking.push(match.couple1);
        ranking.push(match.couple2);
      }
    });
    setFinalRanking(ranking);
    setCompletedView('ranking');
    setPhase('COMPLETE');
  };

  const handleReset = () => {
    setPhase('SETUP');
    setCouples([]);
    setRounds([]);
    setStandings([]);
    setFinalMatches([]);
    setFinalRanking([]);
    setShowStandingsInFinals(false);
    setCompletedView('ranking');
  };
  
  const handleGoBackToRounds = () => {
    setPhase('ROUND_ROBIN');
  };

  const renderPhase = () => {
    switch (phase) {
      case 'SETUP':
        return <CoupleInput onSubmit={handleCouplesSubmit} />;
      case 'ROUND_ROBIN':
        return <RoundRobin rounds={rounds} onUpdateScore={handleUpdateScore} onFinishRounds={handleFinishRounds} />;
      case 'STANDINGS':
        return <StandingsTable standings={standings} onProceedToFinals={handleProceedToFinals} onGoBack={handleGoBackToRounds} />;
      case 'FINALS':
        if (showStandingsInFinals) {
          return (
            <div className="w-full">
              <StandingsTable standings={standings} onProceedToFinals={() => {}} showButton={false} />
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowStandingsInFinals(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
                >
                  Torna alle Finali
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="w-full">
            <Finals finalMatches={finalMatches} onUpdateScore={handleUpdateFinalScore} onFinishFinals={handleFinishFinals} />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowStandingsInFinals(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
              >
                Consulta Classifica Gironi
              </button>
            </div>
          </div>
        );
      case 'COMPLETE':
        const renderCompletedView = () => {
            switch(completedView) {
                case 'ranking':
                    return <FinalRanking ranking={finalRanking} onReset={handleReset} />;
                case 'standings':
                    return <StandingsTable standings={standings} onProceedToFinals={() => {}} showButton={false} />;
                case 'finals':
                    return <FinalsResults finalMatches={finalMatches} />;
                default:
                    return null;
            }
        };

        const navButtonClass = "px-4 py-2 text-sm font-medium rounded-md transition";
        const activeNavButtonClass = "bg-blue-600 text-white";
        const inactiveNavButtonClass = "bg-gray-700 text-gray-300 hover:bg-gray-600";

        return (
            <div className="w-full">
                <div className="flex justify-center gap-2 md:gap-4 mb-6 p-2 bg-gray-900 rounded-lg">
                    <button onClick={() => setCompletedView('ranking')} className={`${navButtonClass} ${completedView === 'ranking' ? activeNavButtonClass : inactiveNavButtonClass}`}>
                        Classifica Finale
                    </button>
                    <button onClick={() => setCompletedView('standings')} className={`${navButtonClass} ${completedView === 'standings' ? activeNavButtonClass : inactiveNavButtonClass}`}>
                        Gironi
                    </button>
                    <button onClick={() => setCompletedView('finals')} className={`${navButtonClass} ${completedView === 'finals' ? activeNavButtonClass : inactiveNavButtonClass}`}>
                        Finali
                    </button>
                </div>
                {renderCompletedView()}
            </div>
        );
      default:
        return <CoupleInput onSubmit={handleCouplesSubmit} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans">
      <img src="https://minioapi.magicalstories.site/immagini/covers/Cag1.png" alt="Cagiano's Cup Logo" className="w-48 h-48 mb-4 rounded-full" />
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-cyan-400">
          Cagiano's Cup
        </h1>
        <p className="text-gray-400 mt-2">Girone all'italiana e finali (3 campi)</p>
      </header>
      <main className="w-full">
        {renderPhase()}
      </main>
    </div>
  );
}

export default App;