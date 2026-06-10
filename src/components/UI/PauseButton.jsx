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
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={togglePause}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 p-2.5 sm:p-3.5 bg-gradient-to-br from-violet-400/90 to-purple-500/90 hover:from-violet-500/95 hover:to-purple-600/95 text-white rounded-full shadow-lg shadow-purple-500/30 transition-all backdrop-blur-md border border-white/20"
      title="Pause Game (P)"
    >
      <svg 
        className="w-6 h-6 sm:w-7 sm:h-7" 
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
      </svg>
    </motion.button>
  );
}
