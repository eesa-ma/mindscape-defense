import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export default function PauseButton() {
  const { gameStatus, togglePause } = useGameState();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toUpperCase() === 'P' && gameStatus === 'playing') {
        event.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, togglePause]);

  if (gameStatus !== 'playing') return null;

  return (
    <motion.button
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      onClick={togglePause}
      className="fixed top-22 left-3 sm:top-24 sm:left-6 z-50 p-2 sm:p-2.5 bg-pink-100 border-[3px] border-slate-800 text-slate-800 rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
      title="Pause Game (P)"
    >
      <svg 
        className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-800" 
        viewBox="0 0 24 24"
      >
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
      </svg>
      <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wide hidden sm:inline">Pause</span>
    </motion.button>
  );
}
