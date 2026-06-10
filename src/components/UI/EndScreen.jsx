// src/components/UI/EndScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export default function EndScreen() {
  const { gameStatus, score, restartGame } = useGameState();

  if (gameStatus === 'playing') return null;

  const isVictory = gameStatus === 'won';

  return (
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-white/60 p-8 rounded-3xl text-center shadow-2xl shadow-slate-300/40"
      >
        <h2 className={`text-3xl font-black font-sans uppercase tracking-tight mb-2 ${
          isVictory ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {isVictory ? 'Mindscape Restored' : 'Mindscape Overwhelmed'}
        </h2>
        
        <p className="text-slate-600 text-sm mb-6 leading-relaxed font-sans font-medium">
          {isVictory 
            ? 'Splendid! You maintained mental resilience and successfully managed your connections.'
            : 'The fog became too thick, but remember: emotional health is an ongoing practice. Every storm passes.'}
        </p>

        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl mb-6 shadow-inner">
          <span className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400 block mb-1">Final Score Summary</span>
          <span className="text-3xl font-black font-mono text-amber-600">{score}</span>
        </div>

        <button
          onClick={restartGame}
          className="w-full py-3.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white font-bold font-sans uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
        >
          Re-Enter Mindscape
        </button>
      </motion.div>
    </div>
  );
}