// src/components/UI/EndScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export default function EndScreen() {
  const { gameStatus, score, restartGame, togglePause, isPaused, quitGame } = useGameState();

  // Show pause menu
  if (isPaused && gameStatus === 'playing') {
    return (
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs sm:max-w-md w-full bg-gradient-to-br from-white/98 to-purple-50/98 backdrop-blur-xl border border-white/80 border-purple-100/50 p-6 sm:p-8 rounded-3xl text-center shadow-2xl shadow-purple-500/20"
        >
          <h2 className="text-3xl sm:text-4xl font-black font-sans uppercase tracking-tight mb-2 sm:mb-3 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Game Paused
          </h2>
          
          <p className="text-purple-600/70 text-xs sm:text-sm mb-6 sm:mb-8 font-medium">Take a moment to breathe</p>
          
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={togglePause}
              className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 active:scale-[0.98] text-white font-bold font-sans uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-violet-500/30 cursor-pointer"
            >
              Resume
            </button>
            
            <button
              onClick={restartGame}
              className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white font-bold font-sans uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              Restart
            </button>
            
            <button
              onClick={quitGame}
              className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 active:scale-[0.98] text-white font-bold font-sans uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-rose-500/30 cursor-pointer"
            >
              Quit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show game over/win screen
  if (gameStatus !== 'playing') {
    const isVictory = gameStatus === 'won';
    const isQuit = gameStatus === 'quit';

    return (
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs sm:max-w-md w-full bg-gradient-to-br from-white/98 to-purple-50/98 backdrop-blur-xl border border-white/80 border-purple-100/50 p-4 sm:p-8 rounded-3xl text-center shadow-2xl shadow-purple-500/20 max-h-[95vh] sm:max-h-none overflow-y-auto"
        >
          <h2 className={`text-xl sm:text-3xl font-black font-sans uppercase tracking-tight mb-1 sm:mb-2 ${
            isVictory ? 'bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent' : isQuit ? 'bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent'
          }`}>
            {isVictory ? 'Mindscape Restored' : isQuit ? 'Thanks for Playing' : 'Mindscape Overwhelmed'}
          </h2>
          
          <p className="text-purple-700/70 text-xs sm:text-sm mb-3 sm:mb-6 leading-relaxed font-sans font-medium">
            {isVictory 
              ? 'Splendid! You maintained mental resilience and successfully managed your connections.'
              : isQuit
              ? 'Remember: emotional health is an ongoing practice. Take care of yourself.'
              : 'The fog became too thick, but remember: emotional health is an ongoing practice. Every storm passes.'}
          </p>

          {!isQuit && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/60 p-2 sm:p-4 rounded-2xl mb-3 sm:mb-6 shadow-inner">
              <span className="text-[10px] sm:text-xs font-bold font-sans uppercase tracking-wider text-purple-500 block mb-0.5 sm:mb-1">Final Score Summary</span>
              <span className="text-xl sm:text-3xl font-black font-mono bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{score}</span>
            </div>
          )}

          <button
            onClick={restartGame}
            className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 active:scale-[0.98] text-white font-bold font-sans uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-purple-500/30 cursor-pointer"
          >
            Re-Enter Mindscape
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}