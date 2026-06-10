// src/components/UI/PauseButton.jsx
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
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 p-3 bg-pink-100 border-[3px] border-slate-800 text-slate-800 rounded-full shadow-[3px_3px_0px_rgba(30,41,59,1)] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center h-sm:bottom-2 h-sm:left-2 h-sm:p-2 h-xs:bottom-1.5 h-xs:left-1.5 h-xs:p-1.5"
      title="Pause Game (P)"
    >
      <svg 
        className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 fill-slate-800 h-sm:w-4.5 h-sm:h-4.5 h-xs:w-4 h-xs:h-4" 
        viewBox="0 0 24 24"
      >
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
      </svg>
    </motion.button>
  );
}
