import React, { useState, useMemo, useEffect } from 'react';
import { Champion } from '../types';
import { CHAMPIONS, POPULAR_JUNGLERS } from '../constants';

interface ChampionSelectorProps {
  label: string;
  selectedChampion: Champion | null;
  onSelect: (champion: Champion) => void;
  side: 'player' | 'enemy';
}

export const ChampionSelector: React.FC<ChampionSelectorProps> = ({ label, selectedChampion, onSelect, side }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when selectedChampion changes
  useEffect(() => {
    if (selectedChampion) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400); // 400ms duration
      return () => clearTimeout(timer);
    }
  }, [selectedChampion]);

  // Memoize filtered list for performance
  const filteredChampions = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return CHAMPIONS.filter(c => c.name.toLowerCase().includes(lowerSearch));
  }, [search]);

  const borderColor = side === 'player' ? 'border-cyan-500' : 'border-red-500';
  const shadowColor = side === 'player' ? 'shadow-cyan-500/20' : 'shadow-red-500/20';
  const ringColor = side === 'player' ? 'focus:ring-cyan-500' : 'focus:ring-red-500';
  
  // Animation classes
  const activeAnimationClass = isAnimating 
    ? `scale-105 border-white ${side === 'player' ? 'shadow-[0_0_25px_rgba(34,211,238,0.5)]' : 'shadow-[0_0_25px_rgba(248,113,113,0.5)]'}` 
    : '';

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto relative z-10">
      <label className={`mb-2 text-sm font-bold tracking-wider uppercase ${side === 'player' ? 'text-cyan-400' : 'text-red-400'}`}>
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative h-24 rounded-lg border-2 ${isOpen ? 'border-white' : borderColor} 
          bg-slate-800 transition-all duration-300 hover:bg-slate-700 hover:shadow-lg ${shadowColor}
          flex items-center justify-center overflow-hidden group
          ${activeAnimationClass}
        `}
      >
        {selectedChampion ? (
          <>
             {/* Background Image Faded */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ backgroundImage: `url(${selectedChampion.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40" />
            
            <div className="relative z-10 flex items-center justify-center gap-4 px-4">
                <div className={`w-12 h-12 rounded-full border-2 ${side === 'player' ? 'border-cyan-400' : 'border-red-400'} overflow-hidden shadow-lg flex-shrink-0`}>
                  <img 
                    src={selectedChampion.image} 
                    alt={selectedChampion.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-white drop-shadow-lg leading-none">{selectedChampion.name}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold mt-1 ${side === 'player' ? 'text-cyan-300' : 'text-red-300'}`}>Selected</span>
                </div>
            </div>
          </>
        ) : (
          <span className="text-slate-400 font-medium group-hover:text-white transition-colors">
            Select Champion
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 max-h-96 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-700 sticky top-0 bg-slate-800 z-10 rounded-t-lg">
            <input
              type="text"
              placeholder="Search champion..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className={`w-full bg-slate-900 text-white border border-slate-700 rounded p-2 focus:outline-none focus:ring-2 ${ringColor}`}
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 grid grid-cols-4 gap-2 custom-scrollbar">
            {filteredChampions.map(champ => (
              <button
                key={champ.id}
                onClick={() => {
                  onSelect(champ);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="flex flex-col items-center gap-1 group p-1 hover:bg-slate-700 rounded transition-colors"
                title={champ.name}
              >
                <div className={`w-12 h-12 rounded border border-slate-600 group-hover:border-white overflow-hidden transition-colors relative`}>
                    <img 
                        src={champ.image} 
                        alt={champ.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform" 
                        loading="lazy"
                    />
                    {/* Popularity Indicator (Mock) */}
                    {POPULAR_JUNGLERS.includes(champ.name) && (
                         <div className="absolute bottom-0 right-0 w-2 h-2 bg-amber-500 rounded-full border border-slate-800" title="Popular Jungler"></div>
                    )}
                </div>
                <span className="text-[10px] text-slate-300 truncate w-full text-center group-hover:text-white">
                    {champ.name}
                </span>
              </button>
            ))}
            {filteredChampions.length === 0 && (
                 <div className="col-span-4 py-4 text-center text-slate-500 text-sm">
                    No champions found.
                 </div>
            )}
          </div>
        </div>
      )}
      
      {/* Click outside closer could be implemented here with a backdrop, but for simplicity we toggle */}
      {isOpen && (
          <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
