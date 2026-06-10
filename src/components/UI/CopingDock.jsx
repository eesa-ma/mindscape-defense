import React from 'react';
import { COPING_MECHANISMS } from '../../config/gameData';
import { useGameState } from '../../hooks/useGameState';

const STYLE_MAP = {
  Q: 'bg-amber-50/70 border-amber-200/60 text-amber-950 shadow-sm hover:bg-amber-100/80',
  W: 'bg-purple-50/70 border-purple-200/60 text-purple-950 shadow-sm hover:bg-purple-100/80',
  E: 'bg-blue-50/70 border-blue-200/60 text-blue-950 shadow-sm hover:bg-blue-100/80',
  R: 'bg-emerald-50/70 border-emerald-200/60 text-emerald-950 shadow-sm hover:bg-emerald-100/80',
  A: 'bg-indigo-50/70 border-indigo-200/60 text-indigo-950 shadow-sm hover:bg-indigo-100/80',
  S: 'bg-teal-50/70 border-teal-200/60 text-teal-950 shadow-sm hover:bg-teal-100/80',
  D: 'bg-rose-50/70 border-rose-200/60 text-rose-950 shadow-sm hover:bg-rose-100/80',
};

export default function CopingDock() {
  const { executeCopingStrategy, targetedThreat } = useGameState();

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-white/75 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-xl shadow-slate-200/30">
      {Object.values(COPING_MECHANISMS).map((mechanism) => {
        const colorStyle = STYLE_MAP[mechanism.key] || 'bg-slate-50 border-slate-200 text-slate-900';

        return (
          <button
            key={mechanism.key}
            onClick={() => executeCopingStrategy(mechanism)}
            className={`w-24 h-24 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95 ${colorStyle} opacity-80 hover:opacity-100`}
          >
            <kbd className="text-xl font-black font-mono tracking-wider bg-white/90 px-2.5 py-0.5 rounded-lg border border-slate-200 text-slate-700 shadow-sm group-hover:text-slate-900 transition-colors">
              {mechanism.key}
            </kbd>
            <span className="text-[11px] font-bold tracking-tight mt-2 text-center px-1 leading-tight font-sans">
              {mechanism.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}