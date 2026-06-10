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
    <div className="coping-dock absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4 bg-white/75 backdrop-blur-xl border border-white/50 p-1.5 sm:p-2.5 md:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/30 w-[95%] sm:w-auto max-w-[95vw] sm:max-w-none overflow-x-auto sm:overflow-x-visible">
      <style>{`
        @media (max-height: 640px) {
          .coping-dock {
            padding: 0.5rem !important;
            gap: 0.375rem !important;
            bottom: 0.5rem !important;
            border-radius: 1rem !important;
          }
          .coping-button {
            width: 5.25rem !important;
            height: 3.25rem !important;
            border-radius: 0.75rem !important;
            padding: 0.25rem !important;
          }
          .coping-button kbd {
            font-size: 0.65rem !important;
            padding: 0.05rem 0.25rem !important;
          }
          .coping-button span {
            font-size: 0.55rem !important;
            margin-top: 0.1rem !important;
            line-height: 1.1 !important;
            white-space: normal !important;
          }
        }
        @media (max-height: 480px) {
          .coping-dock {
            padding: 0.375rem !important;
            gap: 0.25rem !important;
            bottom: 0.375rem !important;
          }
          .coping-button {
            width: 4.5rem !important;
            height: 2.25rem !important;
            border-radius: 0.5rem !important;
            padding: 0.15rem !important;
          }
          .coping-button kbd {
            display: none !important;
          }
          .coping-button span {
            font-size: 0.5rem !important;
            margin-top: 0 !important;
            line-height: 1.05 !important;
            white-space: normal !important;
          }
        }
      `}</style>
      {Object.values(COPING_MECHANISMS).map((mechanism) => {
        const colorStyle = STYLE_MAP[mechanism.key] || 'bg-slate-50 border-slate-200 text-slate-900';

        return (
          <button
            key={mechanism.key}
            onClick={() => executeCopingStrategy(mechanism)}
            className={`coping-button w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95 ${colorStyle} opacity-80 hover:opacity-100 shrink-0`}
          >
            <kbd className="text-[9px] sm:text-xs md:text-sm lg:text-xl font-black font-mono tracking-wider bg-white/90 px-1 py-0 sm:px-1.5 sm:py-0.5 md:px-2 md:py-0.5 rounded sm:rounded-lg border border-slate-200 text-slate-700 shadow-sm group-hover:text-slate-900 transition-colors">
              {mechanism.key}
            </kbd>
            <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold tracking-tight mt-1 sm:mt-2 text-center px-0.5 sm:px-1 leading-tight font-sans">
              {mechanism.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}