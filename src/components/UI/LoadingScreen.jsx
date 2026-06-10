import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_TIPS = [
  "Calming the storm...",
  "Gathering thoughts...",
  "Aligning core focus...",
  "Preparing your mindscape...",
  "Breathe in, breathe out...",
  "Reconnecting inner pathways..."
];

export default function LoadingScreen() {
  const { active, progress } = useProgress();
  const [show, setShow] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate tips every 2.5 seconds
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [show]);

  // Hide the loader once everything is loaded
  useEffect(() => {
    if (!active && progress === 100) {
      setShow(false);
    }
  }, [active, progress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-[#ffe4e6] via-[#ffd3b6] to-[#dbeafe] select-none pointer-events-auto"
          style={{ zIndex: 99999 }}
        >
          {/* Glowing Aura Spheres */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-300/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/30 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Pulsating Brain / Lotus Icon */}
            <div className="relative mb-6 w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/40 rounded-full blur-md animate-ping" />
              <div className="relative bg-white/80 p-4 rounded-full border border-white/60 shadow-lg text-indigo-500 shadow-slate-200/20">
                <svg
                  className="w-10 h-10 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 018.716 2.253M12 3a9.003 9.003 0 00-8.716 2.253"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-black font-sans uppercase tracking-widest text-slate-800 mb-1">
              Mindscape Defense
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
              Cultivating Resilience
            </p>

            {/* Progress Bar */}
            <div className="w-56 h-2 bg-white/50 rounded-full border border-white/40 overflow-hidden shadow-inner mb-3">
              <motion.div
                className="h-full bg-linear-to-r from-cyan-400 to-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-xs font-bold font-mono text-indigo-600 mb-6">
              {Math.round(progress)}%
            </span>

            {/* Rotating Tips text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-semibold text-slate-600 leading-relaxed font-sans min-h-10"
              >
                {LOADING_TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
