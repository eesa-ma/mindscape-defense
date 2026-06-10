// src/components/UI/EndScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export default function EndScreen() {
  const { gameStatus, score, restartGame, togglePause, isPaused, quitGame } = useGameState();

  // Show pause menu
  if (isPaused && gameStatus === 'playing') {
    return (
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs sm:max-w-md w-full bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl text-center shadow-[5px_5px_0px_rgba(30,41,59,1)]"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 tracking-tight">
            😴 Game Paused 😴
          </h2>
          
          <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8 font-extrabold uppercase tracking-wide">
            🌟 Take a moment to breathe 🌟
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={togglePause}
              className="w-full py-3 sm:py-3.5 bg-violet-300 hover:bg-violet-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer"
            >
              Resume Play
            </button>
            
            <button
              onClick={restartGame}
              className="w-full py-3 sm:py-3.5 bg-amber-300 hover:bg-amber-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer"
            >
              Restart
            </button>
            
            <button
              onClick={quitGame}
              className="w-full py-3 sm:py-3.5 bg-rose-300 hover:bg-rose-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer"
            >
              Quit Game
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs sm:max-w-md w-full bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl text-center shadow-[5px_5px_0px_rgba(30,41,59,1)] max-h-[95vh] sm:max-h-none overflow-y-auto"
        >
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mb-2 text-slate-800`}>
            {isVictory ? '🎉 Mindscape Restored 🌈' : isQuit ? '👋 Thanks for Playing 👋' : '💔 Mindscape Overwhelmed 🌧️'}
          </h2>
          
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed font-bold">
            {isVictory 
              ? 'Splendid! You maintained mental resilience and successfully managed all emotional challenges.'
              : isQuit
              ? 'Remember: emotional health is an ongoing practice. Take care of yourself.'
              : 'The fog became too thick, but remember: emotional health is an ongoing practice. Every storm passes.'}
          </p>

          {!isQuit && (
            <div className="bg-yellow-50 border-[3px] border-slate-800 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 shadow-[3px_3px_0px_rgba(30,41,59,1)]">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 block mb-0.5 sm:mb-1">⭐ Final Score Summary ⭐</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-500">{score}</span>
            </div>
          )}

          <button
            onClick={restartGame}
            className="w-full py-3 sm:py-3.5 bg-violet-300 hover:bg-violet-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer"
          >
            Re-Enter Mindscape
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}