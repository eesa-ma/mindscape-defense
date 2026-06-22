
export default function OrientationGate() {
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-[#ffe4e6] via-[#ffd3b6] to-[#dbeafe] backdrop-blur-2xl p-6 text-center select-none pointer-events-auto transition-opacity duration-500 orientation-portrait-only"
      style={{ zIndex: 9999 }}
    >
      {/* Dynamic Aura Background */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-300/40 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/40 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

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
      <div className="relative z-10 w-28 h-28 mb-8 flex items-center justify-center">
        {/* Outer glowing halo */}
        <div className="absolute inset-0 bg-white/50 rounded-full blur-xl animate-pulse" />
        
        {/* SVG Phone Graphic */}
        <svg
          className="w-16 h-16 text-slate-800 animate-phone-rotation drop-shadow-[4px_4px_0px_rgba(30,41,59,0.15)]"
          fill="white"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
        
        {/* Rotation Arrow */}
        <svg
          className="absolute w-20 h-20 text-pink-400 opacity-90 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>

      <div className="relative z-10 bg-white/80 border-4 border-slate-800 p-6 rounded-3xl shadow-[6px_6px_0px_rgba(30,41,59,1)]">
        <h2 className="text-2xl font-black font-sans uppercase tracking-widest text-slate-800 mb-2">
          Landscape Mode
        </h2>
        <p className="max-w-xs text-sm font-extrabold text-indigo-500 uppercase tracking-wider leading-relaxed">
          Please rotate your device. Mindscape Defense is optimized to shield your focus in widescreen format.
        </p>
      </div>
    </div>
  );
}
