import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { Trophy, HeartCrack, ListFilter } from 'lucide-react';

export default function EndScreen() {
  const { gameStatus, score, level, restartLevel, startLevel, returnToLevelSelect, togglePause, isPaused, goToMenu } = useGameState();

  // Show pause menu
  if (isPaused && gameStatus === 'playing') {
    return (
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs sm:max-w-md w-full bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl text-center shadow-[5px_5px_0px_rgba(30,41,59,1)] h-sm:max-h-[92vh] h-sm:overflow-y-auto h-sm:p-4 h-sm:rounded-2xl h-xs:p-3 h-xs:max-w-xs"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 tracking-tight h-sm:text-xl h-sm:mb-1 h-xs:text-lg">
            Game Paused
          </h2>
          
          <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8 font-extrabold uppercase tracking-wide h-sm:text-[0.6rem] h-sm:mb-3 h-xs:mb-2">
            Take a moment to breathe
          </p>
          
          <div className="flex flex-col gap-4 h-sm:gap-2.5 h-xs:gap-2">
            <button
              onClick={togglePause}
              className="w-full py-3 sm:py-3.5 bg-violet-300 hover:bg-violet-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer h-sm:py-2 h-sm:text-xs h-sm:rounded-xl h-sm:border-2 h-xs:py-1.5 h-xs:text-[0.7rem] h-xs:rounded-lg"
            >
              Resume Play
            </button>
            
            <button
              onClick={restartLevel}
              className="w-full py-3 sm:py-3.5 bg-amber-300 hover:bg-amber-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer h-sm:py-2 h-sm:text-xs h-sm:rounded-xl h-sm:border-2 h-xs:py-1.5 h-xs:text-[0.7rem] h-xs:rounded-lg"
            >
              Restart
            </button>
            
            <button
              onClick={goToMenu}
              className="w-full py-3 sm:py-3.5 bg-rose-300 hover:bg-rose-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer h-sm:py-2 h-sm:text-xs h-sm:rounded-xl h-sm:border-2 h-xs:py-1.5 h-xs:text-[0.7rem] h-xs:rounded-lg"
            >
              Quit to Menu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show game over/win screen
  if (gameStatus === 'won' || gameStatus === 'lost') {
    const isVictory = gameStatus === 'won';

    return (
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs sm:max-w-md w-full bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl text-center shadow-[5px_5px_0px_rgba(30,41,59,1)] max-h-[95vh] sm:max-h-none overflow-y-auto h-sm:max-h-[92vh] h-sm:p-4 h-sm:rounded-2xl h-xs:p-3 h-xs:max-w-xs"
        >
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-slate-800 h-sm:text-xl h-sm:mb-1 h-xs:text-lg">
            {isVictory ? <><Trophy className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" /> Mindscape Restored</> : <><HeartCrack className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" /> Mindscape Overwhelmed</>}
          </h2>
          
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed font-bold h-sm:text-[0.65rem] h-sm:mb-2.5 h-sm:leading-snug h-xs:text-[0.55rem] h-xs:mb-1.5">
            {isVictory 
              ? 'Splendid! You maintained mental resilience and successfully managed all emotional challenges.'
              : 'The fog became too thick, but remember: emotional health is an ongoing practice. Every storm passes.'}
          </p>

          <div className="bg-yellow-50 border-[3px] border-slate-800 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 shadow-[3px_3px_0px_rgba(30,41,59,1)] h-sm:p-2 h-sm:rounded-xl h-sm:mb-3 h-sm:border-2 h-xs:p-1.5 h-xs:mb-2">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 block mb-0.5 sm:mb-1 h-sm:text-[8px] h-sm:mb-0"><ListFilter className="inline w-4 h-4 mr-1" /> Final Score Summary</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-500 h-sm:text-xl">{score}</span>
          </div>

          <div className="flex flex-col gap-3">
            {isVictory && level < 6 && (
              <button
                onClick={() => startLevel(level + 1)}
                className="w-full py-3 sm:py-3.5 bg-emerald-300 hover:bg-emerald-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer h-sm:py-2 h-sm:text-xs h-sm:rounded-xl h-sm:border-2 h-xs:py-1.5 h-xs:text-[0.7rem] h-xs:rounded-lg"
              >
                Next Level
              </button>
            )}

            <button
              onClick={restartLevel}
              className="w-full py-3 sm:py-3.5 bg-violet-300 hover:bg-violet-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer h-sm:py-2 h-sm:text-xs h-sm:rounded-xl h-sm:border-2 h-xs:py-1.5 h-xs:text-[0.7rem] h-xs:rounded-lg"
            >
              {isVictory ? 'Replay Level' : 'Retry Level'}
            </button>

            <button
              onClick={returnToLevelSelect}
              className="w-full py-3 sm:py-3.5 bg-slate-200 hover:bg-slate-300 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer h-sm:py-2 h-sm:text-xs h-sm:rounded-xl h-sm:border-2 h-xs:py-1.5 h-xs:text-[0.7rem] h-xs:rounded-lg"
            >
              Level Select
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}