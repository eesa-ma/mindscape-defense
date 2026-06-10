// src/components/UI/OrientationGate.jsx
import React from 'react';

export default function OrientationGate() {
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-indigo-950/95 via-slate-900/95 to-purple-950/95 backdrop-blur-2xl text-white p-6 text-center select-none pointer-events-auto transition-opacity duration-500 orientation-portrait-only"
      style={{ zIndex: 9999 }}
    >
      <style>{`
        @media (orientation: landscape) {
          .orientation-portrait-only {
            display: none !important;
          }
        }
        @keyframes rotatePhone {
          0%, 10% {
            transform: rotate(0deg);
          }
          40%, 60% {
            transform: rotate(-90deg);
          }
          90%, 100% {
            transform: rotate(0deg);
          }
        }
        .animate-phone-rotation {
          animation: rotatePhone 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* Animated Rotation Device */}
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        {/* Outer glowing halo */}
        <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
        
        {/* SVG Phone Graphic */}
        <svg
          className="w-16 h-16 text-cyan-400 animate-phone-rotation drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
        
        {/* Rotation Arrow */}
        <svg
          className="absolute w-20 h-20 text-indigo-400 opacity-65"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-black font-sans uppercase tracking-wider mb-3 bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)]">
        Landscape Mode Required
      </h2>
      <p className="max-w-xs text-sm text-slate-300 leading-relaxed font-sans font-medium">
        Please rotate your device to landscape orientation. Mindscape Defense is optimized to shield your focus in widescreen format.
      </p>
    </div>
  );
}
