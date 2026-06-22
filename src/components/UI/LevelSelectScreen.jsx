import { useGameState } from '../../hooks/useGameState';
import { Lock, Star, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';
import { requestFullscreen } from '../../utils/fullscreen';

export default function LevelSelectScreen() {
  const { gameStatus, maxUnlockedLevel, startLevel, goToMenu, resetProgress } = useGameState();

  if (gameStatus !== 'levelSelect') return null;

  const handleLevelSelect = (lvl) => {
    if (lvl <= maxUnlockedLevel) {
      requestFullscreen();
      audioSynth.playSuccess();
      startLevel(lvl);
    } else {
      audioSynth.playFailure();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 overflow-hidden bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
      <div className="bg-white/95 border-4 border-slate-800 p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_rgba(30,41,59,1)] w-full max-w-2xl flex flex-col items-center max-h-[95vh] overflow-y-auto h-sm:max-h-[92vh] h-sm:p-4 h-xs:p-3 scrollbar-thin">
        
        <h1 className="text-3xl sm:text-5xl font-black text-slate-800 mb-2 uppercase tracking-tight text-center h-sm:text-2xl h-sm:mb-1 h-xs:text-xl">
          Select Level
        </h1>
        <p className="text-slate-500 font-bold mb-8 text-center text-sm sm:text-base h-sm:text-xs h-sm:mb-4 h-xs:mb-3">
          Unlock new coping strategies as you progress!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full mb-8 h-sm:gap-3 h-sm:mb-4 h-xs:gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const lvl = i + 1;
            const isUnlocked = lvl <= maxUnlockedLevel;
            
            return (
              <button
                key={lvl}
                onClick={() => handleLevelSelect(lvl)}
                className={`relative flex flex-col items-center justify-center p-4 sm:p-6 h-sm:p-2.5 h-xs:p-1.5 rounded-2xl h-sm:rounded-xl border-[3px] transition-all duration-200 
                  ${isUnlocked 
                    ? 'border-slate-800 bg-indigo-100 hover:bg-indigo-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(30,41,59,1)] active:translate-y-0 active:shadow-none cursor-pointer' 
                    : 'border-slate-300 bg-slate-100 opacity-60 cursor-not-allowed'}`}
              >
                {!isUnlocked && (
                  <div className="absolute top-2 right-2 text-xl sm:text-2xl h-sm:top-1.5 h-sm:right-1.5 h-sm:text-lg">
                    <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-slate-300 mx-auto opacity-75" />
                  </div>
                )}
                
                <span className={`text-3xl sm:text-5xl font-black mb-1 h-sm:text-2xl h-sm:mb-0 h-xs:text-xl ${isUnlocked ? 'text-indigo-900' : 'text-slate-400'}`}>
                  {lvl}
                </span>
                <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider h-sm:text-[0.65rem] h-xs:text-[0.55rem] ${isUnlocked ? 'text-indigo-700' : 'text-slate-400'}`}>
                  {lvl === 6 ? 'Endless' : `Level ${lvl}`}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            audioSynth.playClick();
            goToMenu();
          }}
          className="bg-slate-200 border-[3px] border-slate-800 px-6 py-3 h-sm:py-2 h-sm:px-4 h-sm:text-xs h-sm:rounded-xl rounded-2xl font-black text-slate-700 uppercase tracking-widest hover:bg-slate-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(30,41,59,1)] active:translate-y-0 active:shadow-none transition-all cursor-pointer"
        >
          Back to Menu
        </button>

        {/* Reset Data Button */}
        <button
          onClick={resetProgress}
          className="mt-6 text-xs sm:text-sm font-bold text-slate-400 hover:text-red-400 transition-colors underline decoration-dotted underline-offset-4"
        >
          Reset Game Data
        </button>
      </div>
    </div>
  );
}
