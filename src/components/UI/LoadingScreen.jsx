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

          <div className="loading-screen-container relative z-10 flex flex-col items-center max-w-sm px-6 text-center h-sm:px-2">
            {/* Cute Smiling Cloud Illustration */}
            <div className="loading-screen-logo-wrapper relative mb-8 h-sm:mb-2 flex items-center justify-center">
              <svg viewBox="0 0 120 80" className="w-32 h-24 animate-cloud-bob relative h-sm:w-20 h-sm:h-15 h-sm:mb-1.5">
                {/* Cloud body shadow */}
                <path 
                  d="M20,50 Q10,50 10,40 Q10,30 20,30 Q20,15 35,15 Q45,15 50,22 Q60,10 75,10 Q90,10 95,22 Q110,22 110,38 Q110,50 100,50 Z" 
                  fill="#cbd5e1" 
                  transform="translate(3, 4)"
                  opacity="0.5"
                />
                {/* Cloud body */}
                <path 
                  d="M20,50 Q10,50 10,40 Q10,30 20,30 Q20,15 35,15 Q45,15 50,22 Q60,10 75,10 Q90,10 95,22 Q110,22 110,38 Q110,50 100,50 Z" 
                  fill="white" 
                  stroke="#1e293b"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Cheeks */}
                <circle cx="28" cy="38" r="5.5" fill="#f472b6" opacity="0.85" />
                <circle cx="72" cy="38" r="5.5" fill="#f472b6" opacity="0.85" />
                {/* Bubbly happy eyes */}
                <path d="M23,32 Q26.5,28.5 30,32" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M67,32 Q70.5,28.5 74,32" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Smile */}
                <path d="M43,37.5 Q47.5,42.5 52,37.5" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Tiny stars */}
                <path d="M12,18 L14,20.5 L17,20.5 L15,22 L16,24.5 L13,23 L10,24.5 L11,22 L9,20.5 L12,20.5 Z" fill="#f59e0b" className="animate-pulse" />
                <path d="M88,8 L90,10.5 L93,10.5 L91,12 L92,14.5 L89,13 L86,14.5 L87,12 L85,10.5 L88,10.5 Z" fill="#f59e0b" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
              </svg>
              
              {/* Floating Heart */}
              <motion.div 
                className="absolute -right-1 bottom-1 text-3xl"
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
                💖
              </motion.div>
            </div>

            <h1 className="text-3xl font-black text-slate-800 mb-1 tracking-wide h-sm:text-2xl h-sm:mb-0.5">
              Mindscape Defense
            </h1>
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-6 h-sm:text-[0.55rem] h-sm:mb-2">
              🛡️ Cultivating Resilience 🛡️
            </p>

            {/* Bubbly Progress Bar */}
            <div className="w-60 h-5 bg-white border-[3px] border-slate-800 rounded-full overflow-hidden p-0.5 shadow-[3px_3px_0px_rgba(30,41,59,1)] mb-3 h-sm:w-48 h-sm:h-3.5 h-sm:border-2 h-sm:mb-1">
              <motion.div
                className="h-full bg-linear-to-r from-pink-400 to-rose-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-xs font-black text-rose-500 bg-rose-50 border-2 border-slate-800 px-3 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_rgba(30,41,59,1)] mb-6 h-sm:mb-2 h-sm:py-0.5 h-sm:px-2 h-sm:text-[0.55rem] h-sm:border-[1.5px]">
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
                className="text-xs font-bold text-slate-600 leading-relaxed min-h-10 px-4 h-sm:text-[0.65rem] h-sm:leading-tight h-sm:min-h-6"
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
