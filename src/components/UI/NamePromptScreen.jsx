import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle2, ArrowRight } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export default function NamePromptScreen() {
  const { gameStatus, hasSetPlayerName, updatePlayerName } = useGameState();
  const [tempName, setTempName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      updatePlayerName(tempName.trim());
    } else {
      updatePlayerName('Player');
    }
  };

  // Only show this screen when the game is at the menu and they haven't set their name yet
  if (gameStatus !== 'menu' || hasSetPlayerName) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto">
      <AnimatePresence>
        <motion.div
          key="name-prompt"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_rgba(30,41,59,1)] max-w-sm w-full relative overflow-hidden"
        >
          <div className="text-center mb-6">
            <div className="bg-indigo-100 text-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-200">
              <UserCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
              Who goes there?
            </h2>
            <p className="text-slate-500 font-bold text-sm">
              Enter your name to begin your journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Your Name..."
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-center text-lg"
              autoFocus
              maxLength={15}
            />
            
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 border-[3px] border-slate-800 text-white font-black uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
