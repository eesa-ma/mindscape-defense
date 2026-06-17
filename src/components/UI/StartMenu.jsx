import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { requestMobileFullscreen } from '../../utils/fullscreen';

export default function StartMenu() {
  const { gameStatus, startGame } = useGameState();
  const [showInstructions, setShowInstructions] = useState(false);

  if (gameStatus !== 'menu') return null;

  const handleStartGame = () => {
    requestMobileFullscreen();
    startGame();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-[#ffe4e6] via-[#ffd3b6] to-[#dbeafe] select-none pointer-events-auto z-50 p-4">
      {/* Dynamic Aura Background */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-300/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <AnimatePresence mode="wait">
        {!showInstructions ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-sm sm:max-w-md w-full bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl text-center shadow-[6px_6px_0px_rgba(30,41,59,1)] flex flex-col items-center animate-cloud-bob h-sm:p-4 h-sm:rounded-3xl h-sm:max-h-[92vh] h-sm:w-[95%] h-sm:max-w-84 h-xs:p-3 h-xs:max-w-76"
          >
            {/* Cute Mascot cloud illustration */}
            <div className="relative mb-6 h-sm:mb-4 flex items-center justify-center">
              <svg viewBox="0 0 120 80" className="w-32 h-24 h-sm:w-18 h-sm:h-14 h-sm:mb-1 h-xs:w-15 h-xs:h-11 relative">
                {/* Shield shadow */}
                <ellipse cx="60" cy="72" rx="30" ry="6" fill="#cbd5e1" opacity="0.6" />
                
                {/* Outer Shield Border */}
                <path d="M 60 10 L 95 20 C 95 45 80 65 60 75 C 40 65 25 45 25 20 Z" fill="#e0e7ff" stroke="#818cf8" strokeWidth="4" strokeLinejoin="round" />
                
                {/* Inner Shield Body */}
                <path d="M 60 18 L 85 26 C 85 43 75 57 60 65 C 45 57 35 43 35 26 Z" fill="#8b5cf6" />
                
                {/* Mind Core / Star */}
                <path d="M 60 25 L 63 35 L 73 38 L 63 41 L 60 51 L 57 41 L 47 38 L 57 35 Z" fill="#fde047" className="animate-pulse" />
                
                {/* Floating Sparks */}
                <path d="M 45 25 L 47 30 L 52 32 L 47 34 L 45 39 L 43 34 L 38 32 L 43 30 Z" fill="#fde047" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <path d="M 75 45 L 76.5 49 L 81 50.5 L 76.5 52 L 75 56 L 73.5 52 L 69 50.5 L 73.5 49 Z" fill="#fde047" opacity="0.8" className="animate-pulse" style={{ animationDelay: '1s' }} />
              </svg>
              
              <motion.div 
                className="absolute -right-2 bottom-1 text-3xl h-sm:text-2xl h-xs:text-xl"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, -8, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 tracking-wide h-sm:text-[1.35rem] h-sm:mb-0.5 h-xs:text-[1.15rem]">
              Mindscape Defense
            </h1>
            <p className="text-xs sm:text-sm font-extrabold text-indigo-500 uppercase tracking-widest mb-8 leading-relaxed h-sm:text-[0.55rem] h-sm:mb-2.5 h-xs:mb-1.5">
              🛡️ Shield Your Focus, Cultivate Resilience 🛡️
            </p>

            <div className="flex flex-col gap-4 w-full h-sm:gap-2.5 h-xs:gap-2">
              <button
                onClick={handleStartGame}
                className="w-full py-3 sm:py-4 h-sm:py-2 h-sm:rounded-[0.85rem] h-sm:text-[0.75rem] h-sm:border-[2.5px] h-xs:py-1.5 bg-violet-300 hover:bg-violet-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                🎮 Start Game
              </button>

              <button
                onClick={() => setShowInstructions(true)}
                className="w-full py-3 sm:py-4 h-sm:py-2 h-sm:rounded-[0.85rem] h-sm:text-[0.75rem] h-sm:border-[2.5px] h-xs:py-1.5 bg-amber-300 hover:bg-amber-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                📖 How to Play
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-4xl bg-white border-4 border-slate-800 p-5 sm:p-7 rounded-3xl shadow-[6px_6px_0px_rgba(30,41,59,1)] flex flex-col h-sm:p-3 h-sm:rounded-3xl h-sm:w-[95%] h-sm:max-w-136 h-sm:h-[92vh] h-xs:p-2 h-xs:rounded-[1.25rem]"
          >
            {/* Header */}
            <div className="text-center mb-4 shrink-0 h-sm:mb-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1 h-sm:text-[1.25rem] h-xs:text-[1rem]">
                📖 How to Play
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider h-sm:text-[0.55rem]">
                Resilience Guide & Controls
              </p>
            </div>

            {/* Content Body - Scrollable */}
            <div className="overflow-y-auto pr-1.5 flex-1 min-h-0 flex gap-4 text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 scrollbar-thin h-sm:flex-col h-sm:gap-2.5 h-sm:mb-1.5 h-xs:gap-2">
              {/* Rules description */}
              <div className="bg-sky-50 border-2 border-slate-800 p-3 rounded-2xl shadow-[2.5px_2.5px_0px_rgba(30,41,59,1)] flex-1 h-sm:flex-none h-sm:w-full h-sm:p-2.5 h-sm:shrink-0">
                <p className="font-extrabold text-sky-950 mb-1 h-sm:text-[0.65rem] h-sm:leading-tight">🎮 Core Objective:</p>
                <p className="font-medium text-slate-600 h-sm:text-[0.65rem] h-sm:leading-tight">
                  Emotional threats (Burnout, Loneliness, Anxiety, etc.) will float in from the surrounding fog. If they reach your character in the center, your Connection decreases and you lose a life.
                </p>
                <p className="font-extrabold text-sky-950 mt-2.5 mb-1 h-sm:text-[0.65rem] h-sm:mt-1 h-sm:leading-tight">🕹️ Controls:</p>
                <p className="font-medium text-slate-600 h-sm:text-[0.65rem] h-sm:leading-tight">
                  1. **Target**: The closest threat is automatically targeted! (Or click/tap any threat or its label bubble to target it manually).<br />
                  2. **Cope**: Click the matching coping button on the bottom dock (or press its corresponding key: **1, 2, 3, 4, 5, 6, 7**).
                </p>
              </div>

              {/* Cheat Sheet Table */}
              <div className="border-2 border-slate-800 rounded-2xl overflow-hidden shadow-[2.5px_2.5px_0px_rgba(30,41,59,1)] bg-white flex-1 h-sm:flex-none h-sm:w-full h-sm:shrink-0">
                <div className="bg-purple-100 border-b-2 border-slate-800 p-2 text-center text-slate-800 font-black uppercase text-[10px] tracking-wider h-sm:p-1.5">
                  💡 Resilience Cheat Sheet
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-300 font-extrabold text-slate-600">
                        <th className="p-2 w-12 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Key</th>
                        <th className="p-2 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Coping Strategy</th>
                        <th className="p-2 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Threats Counteracted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      <tr>
                        <td className="p-2 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]"><kbd className="bg-amber-100 border border-slate-400 px-1 py-0.5 rounded font-mono h-sm:text-[0.55rem] h-sm:px-0.5 h-sm:py-0">1</kbd></td>
                        <td className="p-2 text-amber-900 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">😴 Rest & Recharge</td>
                        <td className="p-2 text-slate-500 font-medium h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Burnout, Exhaustion, Creative Block</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]"><kbd className="bg-purple-100 border border-slate-400 px-1 py-0.5 rounded font-mono h-sm:text-[0.55rem] h-sm:px-0.5 h-sm:py-0">2</kbd></td>
                        <td className="p-2 text-purple-900 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">🫂 Seek Support</td>
                        <td className="p-2 text-slate-500 font-medium h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Social Rejection, Loneliness, Imposter Syndrome</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]"><kbd className="bg-sky-100 border border-slate-400 px-1 py-0.5 rounded font-mono h-sm:text-[0.55rem] h-sm:px-0.5 h-sm:py-0">3</kbd></td>
                        <td className="p-2 text-sky-900 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">⏰ Time Management</td>
                        <td className="p-2 text-slate-500 font-medium h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Academic Pressure, Procrastination, Overwhelm</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]"><kbd className="bg-emerald-100 border border-slate-400 px-1 py-0.5 rounded font-mono h-sm:text-[0.55rem] h-sm:px-0.5 h-sm:py-0">4</kbd></td>
                        <td className="p-2 text-emerald-900 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">✨ Reflection</td>
                        <td className="p-2 text-slate-500 font-medium h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Negative Thoughts, Self-Doubt, Anxiety</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]"><kbd className="bg-indigo-100 border border-slate-400 px-1 py-0.5 rounded font-mono h-sm:text-[0.55rem] h-sm:px-0.5 h-sm:py-0">5</kbd></td>
                        <td className="p-2 text-indigo-900 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">💌 Reach Out</td>
                        <td className="p-2 text-slate-500 font-medium h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Isolation, Ghosting, Detachment</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]"><kbd className="bg-teal-100 border border-slate-400 px-1 py-0.5 rounded font-mono h-sm:text-[0.55rem] h-sm:px-0.5 h-sm:py-0">6</kbd></td>
                        <td className="p-2 text-teal-900 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">📵 Digital Detox</td>
                        <td className="p-2 text-slate-500 font-medium h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Social Comparison, FOMO, Cyberbullying</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]"><kbd className="bg-pink-100 border border-slate-400 px-1 py-0.5 rounded font-mono h-sm:text-[0.55rem] h-sm:px-0.5 h-sm:py-0">7</kbd></td>
                        <td className="p-2 text-pink-900 h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">💬 Communication</td>
                        <td className="p-2 text-slate-500 font-medium h-sm:p-0.5 h-sm:px-1.5 h-sm:text-[0.625rem]">Family Conflict, Misunderstandings, Peer Pressure</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full shrink-0 py-3 h-sm:py-2 h-sm:text-[0.75rem] h-sm:rounded-[0.85rem] h-sm:border-[2.5px] bg-pink-200 hover:bg-pink-300 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer text-center"
            >
              ⬅️ Back to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
