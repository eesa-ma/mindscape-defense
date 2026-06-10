import React from 'react';
import { COPING_MECHANISMS } from '../../config/gameData';
import { useGameState } from '../../hooks/useGameState';

export default function CopingDock() {
  const { executeCopingStrategy, targetedThreat } = useGameState();

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-slate-950/60 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl">
      {Object.values(COPING_MECHANISMS).map((mechanism) => {
        // Subtle hint: Highlight the button border if it is the correct counter to the current threat[cite: 1]
        const isCorrectCounter = targetedThreat?.type === mechanism.counteracts;

        return (
          <button
            key={mechanism.key}
            onClick={() => executeCopingStrategy(mechanism)}
            className={`w-24 h-24 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95 ${mechanism.color} ${
              isCorrectCounter 
                ? 'ring-2 ring-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <kbd className="text-2xl font-black font-mono tracking-wider bg-slate-900/80 px-2.5 py-0.5 rounded-md border border-slate-700/50 shadow-inner group-hover:text-white transition-colors">
              {mechanism.key}
            </kbd>
            <span className="text-[11px] font-medium tracking-tight mt-2 text-center px-1 leading-tight">
              {mechanism.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}