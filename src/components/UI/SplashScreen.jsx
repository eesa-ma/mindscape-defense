import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { requestFullscreen } from '../../utils/fullscreen';

export default function SplashScreen() {
  const { gameStatus, enterGame } = useGameState();

  if (gameStatus !== 'splash') return null;

  const handleEnter = () => {
    requestFullscreen();
    enterGame();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-linear-to-br from-[#ffe4e6] via-[#ffd3b6] to-[#dbeafe] cursor-pointer overflow-hidden p-4"
      onClick={handleEnter}
    >
      {/* Background Image nicely blended with the pastel gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-1000 scale-105 pointer-events-none" 
        style={{ backgroundImage: "url('/mindscape-bg.png')" }} 
      />
      
      {/* Dynamic Aura Background */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-300/30 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/30 rounded-full filter blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
      
      <div className="relative z-10 flex flex-col items-center animate-cloud-bob">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-800 mb-8 tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] text-center px-4">
          Mindscape Defense
        </h1>
        
        <div className="animate-pulse bg-white/80 backdrop-blur-md border-[3px] border-indigo-200 px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform duration-300">
          <p className="text-indigo-600 font-extrabold text-sm sm:text-lg tracking-widest uppercase drop-shadow-sm">
            Tap anywhere to enter
          </p>
        </div>
      </div>
    </div>
  );
}
