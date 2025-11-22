import React, { useState, useEffect } from 'react';
import { MatchupAdvice } from '../types';

interface MatchupResultProps {
  advice: MatchupAdvice | null;
  loading: boolean;
}

const AdvantageBadge = ({ type }: { type: 'me' | 'enemy' | 'even' }) => {
  const styles = {
    me: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]',
    enemy: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]',
    even: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };
  
  const icons = {
    me: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />,
    enemy: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    even: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${styles[type]}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[type]}</svg>
      {type === 'me' ? 'Advantage' : type === 'enemy' ? 'Danger' : 'Even'}
    </span>
  );
};

const SectionCard = ({ children, className = "", delay = 0 }: { children?: React.ReactNode, className?: string, delay?: number }) => (
    <div 
        className={`bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-900/5 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${className}`}
        style={{ animationDelay: `${delay}ms` }}
    >
        {/* Subtle scanline effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
        {children}
    </div>
);

const InvadeRadar = ({ decision, explanation }: { decision: 'invade' | 'defend' | 'farm', explanation: string }) => {
    const config = {
        invade: { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-900/10', title: 'Invade', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        defend: { color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-900/10', title: 'Defend', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        farm: { color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-900/10', title: 'Farm', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
    }[decision];

    return (
        <SectionCard className={`h-full flex flex-col justify-between border-2 ${config.border} ${config.bg}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Aggression</span>
                <div className={`p-2 rounded-full bg-slate-800/50 ${config.color}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} /></svg>
                </div>
            </div>
            <div>
                 <div className={`text-2xl font-black ${config.color} uppercase tracking-tight mb-2`}>{config.title}</div>
                 <p className="text-sm text-slate-300 leading-relaxed font-medium">{explanation}</p>
            </div>
        </SectionCard>
    );
};

export const MatchupResult: React.FC<MatchupResultProps> = ({ advice, loading }) => {
  const [loadingState, setLoadingState] = useState({
    main: "Consulting the Oracle",
    sub: "Connecting to the Void..."
  });

  useEffect(() => {
    if (!loading) return;

    const phrases = [
      { main: "Consulting the Oracle", sub: "Connecting to the Void..." },
      { main: "Analyzing Patch Data", sub: "Scouring Season 15 Changes..." },
      { main: "Synthesizing Strategy", sub: "Calculating Win Conditions..." },
      { main: "Scouting Enemy Jungle", sub: "Tracking Pathing Routes..." },
      { main: "Optimizing Build Path", sub: "Simulating Item Spikes..." }
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % phrases.length;
      setLoadingState(phrases[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8 h-96 relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur border border-slate-800">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34,211,238,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
        
        {/* Center Loader */}
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-amber-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="flex flex-col items-center gap-2 min-h-[60px]">
                 <h2 key={loadingState.main} className="text-xl font-bold text-white tracking-widest uppercase animate-pulse">{loadingState.main}</h2>
                 <p key={loadingState.sub} className="text-xs text-cyan-400/70 font-mono uppercase tracking-[0.2em]">{loadingState.sub}</p>
            </div>
        </div>
      </div>
    );
  }

  if (!advice) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 pb-12">
      
      {/* Summary Hero */}
      <div className="relative mb-8 group animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border-l-4 border-amber-500 rounded-r-2xl p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.5L18.5 19H5.5L12 5.5z"/></svg>
            </div>
            <div className="relative z-10 max-w-3xl">
                <h3 className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Strategic Verdict</h3>
                <p className="text-2xl md:text-3xl text-slate-100 font-medium leading-relaxed tracking-tight">"{advice.summary}"</p>
            </div>
        </div>
      </div>

      {/* Top Row: Pathing & Radar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SectionCard className="md:col-span-2 border-l-4 border-l-cyan-500" delay={100}>
              <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 shrink-0">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Optimal First Clear</h4>
                      <p className="text-lg text-slate-200 font-medium leading-relaxed">{advice.firstClearPath}</p>
                  </div>
              </div>
          </SectionCard>
          
          <div className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
              <InvadeRadar decision={advice.invadeDecision} explanation={advice.invadeExplanation} />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Timeline Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h2 className="text-lg font-bold text-slate-100 tracking-wide uppercase">Game Phase Analysis</h2>
            </div>
            
            {/* Early Game */}
            <SectionCard delay={300} className="border-l-4 border-l-slate-600">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 shrink-0 flex flex-col items-start">
                        <span className="text-cyan-300 font-bold text-lg mb-1">Early Game</span>
                        <span className="text-slate-500 text-xs uppercase tracking-wider mb-3">Levels 1-4</span>
                        <AdvantageBadge type={advice.earlyGameAdvantage} />
                    </div>
                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                         <p className="text-slate-300 leading-relaxed text-sm">{advice.earlyGame}</p>
                    </div>
                </div>
            </SectionCard>

            {/* Objectives */}
            <SectionCard delay={400} className="border-l-4 border-l-emerald-500/50">
                 <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 shrink-0">
                         <span className="text-emerald-400 font-bold text-lg block mb-3">Objectives</span>
                         
                         {/* Custom Bar Graph */}
                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider w-full">
                            <span className={advice.objectiveControl === 'me' ? 'text-cyan-400' : 'text-slate-600'}>Me</span>
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                                <div className={`h-full transition-all duration-1000 ${advice.objectiveControl === 'me' ? 'w-full bg-cyan-500' : 'w-0'}`}></div>
                                <div className={`h-full bg-slate-600 ${advice.objectiveControl === 'even' ? 'w-full opacity-50' : 'w-0'}`}></div>
                                <div className={`h-full transition-all duration-1000 ${advice.objectiveControl === 'enemy' ? 'w-full bg-red-500' : 'w-0'}`}></div>
                            </div>
                            <span className={advice.objectiveControl === 'enemy' ? 'text-red-400' : 'text-slate-600'}>Enemy</span>
                        </div>
                        <div className="mt-1 text-[10px] text-slate-500 text-center">Control Bias</div>

                    </div>
                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                        <p className="text-slate-300 leading-relaxed text-sm">{advice.objectiveExplanation}</p>
                    </div>
                </div>
            </SectionCard>

            {/* Power Spikes */}
             <SectionCard delay={500} className="border-l-4 border-l-purple-500/50">
                 <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 shrink-0">
                         <span className="text-purple-400 font-bold text-lg block mb-1">Power Spikes</span>
                         <span className="text-slate-500 text-xs uppercase tracking-wider">Tempo</span>
                    </div>
                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                        <p className="text-slate-300 leading-relaxed text-sm">{advice.powerSpikes}</p>
                    </div>
                </div>
            </SectionCard>

            {/* Mid/Late Game */}
            <SectionCard delay={600} className="border-l-4 border-l-amber-500/50">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 shrink-0 flex flex-col items-start">
                        <span className="text-amber-400 font-bold text-lg mb-1">Mid & Late</span>
                        <span className="text-slate-500 text-xs uppercase tracking-wider mb-3">Teamfights</span>
                        <div className="flex flex-wrap gap-2">
                             <AdvantageBadge type={advice.midLateGameAdvantage} />
                             <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wide border border-slate-600">
                                Role: {advice.teamfightRole}
                            </span>
                        </div>
                    </div>
                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                         <p className="text-slate-300 leading-relaxed text-sm">{advice.midLateGame}</p>
                    </div>
                </div>
            </SectionCard>
        </div>

        {/* Right Column: Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
             <div className="flex items-center gap-3 mb-2 px-2 lg:mt-0 mt-8">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <h2 className="text-lg font-bold text-slate-100 tracking-wide uppercase">Tactical Intel</h2>
            </div>

            {/* Interaction Tip */}
            <SectionCard delay={700} className="bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border-indigo-500/20">
                 <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-500/10 rounded text-indigo-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-indigo-400 font-bold uppercase text-xs tracking-widest">Critical Interaction</h3>
                </div>
                <p className="text-slate-200 text-sm font-medium leading-relaxed italic">
                    "{advice.specificInteraction}"
                </p>
            </SectionCard>

            {/* Key Mechanic */}
             <SectionCard delay={800} className="border-cyan-500/20">
                 <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest">Key Mechanic</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                    {advice.keyMechanic}
                </p>
            </SectionCard>

            {/* Counter Items */}
            <div className="bg-slate-900/40 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '900ms' }}>
                 <div className="bg-slate-900/60 px-5 py-3 border-b border-slate-700/50 flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <h2 className="text-xs font-bold text-slate-300 tracking-widest uppercase">Counter Build</h2>
                </div>
                <div className="divide-y divide-slate-700/30">
                    {advice.counterItems.map((item, idx) => (
                        <div key={idx} className="px-5 py-4 hover:bg-slate-800/40 transition-colors group">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></span>
                                <span className="text-amber-200 text-sm font-bold group-hover:text-amber-300 transition-colors">{item.name}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed pl-3.5">{item.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
      
       {/* Sources Footer */}
       {advice.sources && advice.sources.length > 0 && (
          <div className="mt-12 border-t border-slate-800 pt-6 animate-in fade-in">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Verified Season 15 Sources</h4>
             <div className="flex flex-wrap justify-center gap-3">
                {advice.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-500/70 hover:text-cyan-400 bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded border border-slate-700 hover:border-cyan-500/30 transition-all truncate max-w-xs"
                  >
                    {source.title}
                  </a>
                ))}
             </div>
          </div>
       )}

       <div className="mt-8 text-center opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">
                Analytic Engine v2.6 • Grounded in Season 15 Data
            </p>
        </div>

    </div>
  );
};