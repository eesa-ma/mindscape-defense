import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { Shield, Heart } from 'lucide-react';
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
              
              {/* Floating Heart */}
              <motion.div 
                className="absolute -right-1 bottom-1 text-pink-500"
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
                <Heart size={32} fill="currentColor" />
              </motion.div>
            </div>

            <h1 className="text-3xl font-black text-slate-800 mb-1 tracking-wide h-sm:text-2xl h-sm:mb-0.5">
              Mindscape Defense
            </h1>
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-6 h-sm:text-[0.55rem] h-sm:mb-2">
              <Shield className="inline w-4 h-4 mr-2" /> Cultivating Resilience <Shield className="inline w-4 h-4 ml-2" />
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
