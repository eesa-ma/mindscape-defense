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
  const { executeCopingStrategy, gameStatus } = useGameState();

  if (gameStatus !== 'playing') return null;

  return (
    <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 sm:gap-3 md:gap-4 bg-pink-50/95 border-[3px] border-slate-800 p-2 sm:p-3.5 rounded-3xl shadow-[4px_4px_0px_rgba(30,41,59,1)] w-[95%] sm:w-auto max-w-[95vw] sm:max-w-none overflow-x-auto sm:overflow-x-visible pointer-events-auto h-sm:p-2 h-sm:gap-1.5 h-sm:bottom-2 h-sm:rounded-2xl h-xs:p-1.5 h-xs:gap-1 h-xs:bottom-1.5">
      {Object.values(COPING_MECHANISMS).map((mechanism) => {
        const colorStyle = STYLE_MAP[mechanism.key] || 'bg-slate-50 border-slate-200 text-slate-900';

        return (
          <button
            key={mechanism.key}
            onClick={() => executeCopingStrategy(mechanism)}
            className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl border-[3px] border-slate-800 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95 hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] ${colorStyle} shadow-[3px_3px_0px_rgba(30,41,59,1)] shrink-0 h-sm:w-[5.75rem] h-sm:h-[3.75rem] h-sm:rounded-[0.85rem] h-sm:py-0.5 h-sm:px-1 h-xs:w-[4.75rem] h-xs:h-[2.75rem] h-xs:rounded-[0.6rem] h-xs:py-0 h-xs:px-0.5`}
          >
            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 h-sm:mb-0 h-xs:mb-0">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl transition-transform duration-200 group-hover:scale-110 h-sm:text-base h-xs:text-[13px]">
                {EMOJI_MAP[mechanism.key]}
              </span>
              <kbd className="text-[9px] sm:text-xs md:text-sm font-black font-mono tracking-wider bg-white px-1 py-0 sm:px-1.5 sm:py-0.5 rounded border border-slate-300 text-slate-800 shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[8px] h-sm:py-0 h-sm:px-0.5 h-xs:hidden">
                {mechanism.key}
              </kbd>
            </div>
            <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-extrabold tracking-tight text-center px-0.5 leading-tight font-sans h-sm:text-[8px] h-sm:mt-0 h-sm:leading-[1.0] h-sm:normal-case h-xs:text-[7px] h-xs:mt-0 h-xs:leading-[0.95]">
              {mechanism.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}