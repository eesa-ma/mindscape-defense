// src/components/UI/EndScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export default function EndScreen() {
  const { gameStatus, score, restartGame } = useGameState();

  if (gameStatus === 'playing') return null;

  const isVictory = gameStatus === 'won';

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-2xl"
      >
        <h2 className={`text-3xl font-black font-mono uppercase tracking-wider mb-2 ${
          isVictory ? 'text-emerald-400' : 'text-rose-500'
        }`}>
          {isVictory ? 'Mindscape Restored' : 'Mindscape Overwhelmed'}
        </h2>
        
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {isVictory 
            ? 'Splendid! You maintained mental resilience and successfully managed your connections.'
            : 'The fog became too thick, but remember: emotional health is an ongoing practice. Every storm passes.'}
        </p>

        <div className="bg-slate-950/50 border border-slate-800/60 p-4 rounded-xl mb-6">
          <span className="text-xs font-mono uppercase tracking-wider opacity-50 block mb-1">Final Score Summary</span>
          <span className="text-3xl font-black font-mono text-amber-400">{score}</span>
        </div>

        <button
          onClick={restartGame}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 active:scale-[0.98] text-slate-950 font-bold font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          Re-Enter Mindscape
        </button>
      </motion.div>
    </div>
  );
}