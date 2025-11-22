import React, { useState } from 'react';
import { ChampionSelector } from './components/ChampionSelector';
import { MatchupResult } from './components/MatchupResult';
import { Logo } from './components/Logo';
import { getMatchupAdvice } from './services/geminiService';
import { Champion, MatchupAdvice } from './types';

const App: React.FC = () => {
  const [myChampion, setMyChampion] = useState<Champion | null>(null);
  const [enemyChampion, setEnemyChampion] = useState<Champion | null>(null);
  const [advice, setAdvice] = useState<MatchupAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!myChampion || !enemyChampion) return;

    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const result = await getMatchupAdvice(myChampion.name, enemyChampion.name);
      setAdvice(result);
    } catch (err) {
      setError("Failed to retrieve matchmaking data from the void. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden selection:bg-amber-500 selection:text-slate-900 pb-20">
      {/* Background Elements for Visual Flair */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 flex flex-col items-center">
          <Logo className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)] animate-in zoom-in duration-1000" />
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 tracking-tight lol-header drop-shadow-sm">
            JUNGLE GAP
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            Dominate the rift. Select your champion and your opponent's to receive Challenger-tier matchup analysis instantly.
          </p>
        </header>

        {/* Selection Area */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <ChampionSelector
              label="My Champion"
              selectedChampion={myChampion}
              onSelect={setMyChampion}
              side="player"
            />
            
            <div className="flex flex-col items-center justify-center mt-6 md:mt-0">
                <div className="text-3xl font-black text-slate-700 italic select-none">VS</div>
            </div>

            <ChampionSelector
              label="Enemy Jungler"
              selectedChampion={enemyChampion}
              onSelect={setEnemyChampion}
              side="enemy"
            />
          </div>

          {/* Action Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!myChampion || !enemyChampion || loading}
              className={`
                relative px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-sm 
                font-bold text-white text-lg tracking-widest uppercase transition-all duration-300
                border-2 border-transparent hover:border-cyan-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
                shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_40px_rgba(8,145,178,0.6)]
              `}
            >
               {loading ? 'Analyzing...' : 'Analyze Matchup'}
               {/* Decorative corners */}
               <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
            </button>
          </div>

           {/* Error Message */}
           {error && (
              <div className="mt-8 text-center text-red-400 bg-red-900/20 p-4 rounded border border-red-900/50 max-w-lg mx-auto">
                  {error}
              </div>
           )}

          {/* Results */}
          {(advice || loading) && (
              <MatchupResult advice={advice} loading={loading} />
          )}

        </div>
      </div>
    </div>
  );
};

export default App;