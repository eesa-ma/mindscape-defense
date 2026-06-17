import React from 'react';
import { COPING_MECHANISMS } from '../../config/gameData';
import { useGameState } from '../../hooks/useGameState';

const STYLE_MAP = {
  Q: 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200',
  W: 'bg-purple-100 border-purple-400 text-purple-900 hover:bg-purple-200',
  E: 'bg-sky-100 border-sky-400 text-sky-900 hover:bg-sky-200',
  R: 'bg-emerald-100 border-emerald-400 text-emerald-900 hover:bg-emerald-200',
  A: 'bg-indigo-100 border-indigo-400 text-indigo-900 hover:bg-indigo-200',
  S: 'bg-teal-100 border-teal-400 text-teal-900 hover:bg-teal-200',
  D: 'bg-pink-100 border-pink-400 text-pink-900 hover:bg-pink-200',
};

const EMOJI_MAP = {
  Q: '😴',
  W: '🫂',
  E: '⏰',
  R: '✨',
  A: '💌',
  S: '📵',
  D: '💬',
};

export default function CopingDock() {
  const { executeCopingStrategy, gameStatus, level } = useGameState();

  if (gameStatus !== 'playing') return null;

  const allMechanisms = Object.values(COPING_MECHANISMS);
  // Level 1 unlocks first 2 mechanisms. Each level adds 1 more. Max 7.
  const unlockedMechanisms = allMechanisms.slice(0, level + 1);
  
  const half = Math.ceil(unlockedMechanisms.length / 2);
  const leftMechanisms = unlockedMechanisms.slice(0, half);
  const rightMechanisms = unlockedMechanisms.slice(half);

  const renderMechanism = (mechanism) => {
    const colorStyle = STYLE_MAP[mechanism.key] || 'bg-slate-50 border-slate-200 text-slate-900';

    return (
      <button
        key={mechanism.key}
        onClick={() => executeCopingStrategy(mechanism)}
        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl border-[3px] border-slate-800 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] ${colorStyle} shadow-[3px_3px_0px_rgba(30,41,59,1)] shrink-0 h-sm:w-20 h-sm:h-14 h-sm:rounded-[0.85rem] h-xs:w-16 h-xs:h-10 h-xs:rounded-[0.6rem]`}
      >
        <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 h-sm:mb-0 h-xs:mb-0">
          <span className="text-sm sm:text-base md:text-lg lg:text-2xl transition-transform duration-200 group-hover:scale-110 h-sm:text-sm h-xs:text-[11px]">
            {EMOJI_MAP[mechanism.key]}
          </span>
          <kbd className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-black font-mono tracking-wider bg-white px-1 py-0 rounded border border-slate-300 text-slate-800 shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[8px] h-xs:hidden">
            {mechanism.key}
          </kbd>
        </div>
        <span className="text-[6px] sm:text-[7px] md:text-[9px] lg:text-[11px] font-extrabold tracking-tight text-center px-0.5 leading-tight font-sans h-sm:text-[7px] h-sm:leading-none h-xs:text-[6px] h-xs:leading-[0.95]">
          {mechanism.label}
        </span>
      </button>
    );
  };

  return (
    <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 w-full px-2 sm:px-4 md:px-8 z-50 flex justify-between items-end pointer-events-none">
      {/* Left side controls */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 pointer-events-auto bg-pink-50/95 border-[3px] border-slate-800 p-1.5 sm:p-2 md:p-3 rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_rgba(30,41,59,1)] max-w-[48%]">
        {leftMechanisms.map(renderMechanism)}
      </div>

      {/* Right side controls */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 pointer-events-auto bg-pink-50/95 border-[3px] border-slate-800 p-1.5 sm:p-2 md:p-3 rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_rgba(30,41,59,1)] max-w-[48%] justify-end">
        {rightMechanisms.map(renderMechanism)}
      </div>
    </div>
  );
}