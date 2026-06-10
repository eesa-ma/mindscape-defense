// src/App.jsx
import React from 'react';
import { GameStateProvider, useGameState } from './hooks/useGameState';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import MindscapeStage from './components/Experience/MindscapeStage';
import CopingDock from './components/UI/CopingDock';
import InsightOverlay from './components/UI/InsightOverlay';
import EndScreen from './components/UI/EndScreen'; // Import the overlay
import OrientationGate from './components/UI/OrientationGate';
import LoadingScreen from './components/UI/LoadingScreen';

function DynamicVignette() {
  const { connection } = useGameState();
  
  // Calculate how intensely the screen border should close in
  // Lower connection = wider, soft lavender/violet calming aura coverage
  const intensity = (100 - connection) * 0.6; 

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-40 transition-all duration-1000"
      style={{
        background: `radial-gradient(circle, transparent ${115 - intensity}%, rgba(139, 92, 246, ${intensity / 200}) 100%)`
      }}
    />
  );
}

function HUD() {
  const { connection, score, lives, timer, gameStage } = useGameState();

  return (
    <div className="hud-container absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-6 z-50 flex justify-between items-center pointer-events-none select-none">
      <style>{`
        @media (max-height: 640px) {
          .hud-container {
            top: 0.5rem !important;
            left: 0.5rem !important;
            right: 0.5rem !important;
          }
          .hud-card {
            padding: 0.375rem 0.625rem !important;
            border-radius: 0.75rem !important;
          }
          .hud-card-title {
            font-size: 0.55rem !important;
            line-height: 1.1 !important;
          }
          .hud-card-value {
            font-size: 1.125rem !important;
            line-height: 1.15 !important;
          }
          .hud-lives {
            font-size: 0.85rem !important;
            gap: 0.25rem !important;
            margin-top: 0.125rem !important;
          }
          .hud-timer {
            padding: 0.25rem 0.75rem !important;
          }
          .hud-timer-title {
            font-size: 0.5rem !important;
            line-height: 1.1 !important;
          }
          .hud-timer-value {
            font-size: 1rem !important;
            line-height: 1.15 !important;
          }
        }
        @media (max-height: 480px) {
          .hud-container {
            top: 0.375rem !important;
            left: 0.375rem !important;
            right: 0.375rem !important;
          }
          .hud-card {
            padding: 0.25rem 0.5rem !important;
            border-radius: 0.5rem !important;
          }
          .hud-card-title {
            font-size: 0.45rem !important;
          }
          .hud-card-value {
            font-size: 0.95rem !important;
          }
          .hud-lives {
            font-size: 0.75rem !important;
            gap: 0.125rem !important;
            margin-top: 0.1rem !important;
          }
          .hud-timer {
            padding: 0.2rem 0.5rem !important;
          }
          .hud-timer-title {
            font-size: 0.4rem !important;
          }
          .hud-timer-value {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
      
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="hud-card bg-white/75 backdrop-blur-md border border-white/50 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-slate-800 pointer-events-auto shadow-lg shadow-slate-200/20 transition-all duration-500">
          <span className="hud-card-title text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Connection Meter</span>
          <span className="hud-card-value text-lg sm:text-2xl font-black text-cyan-600 drop-shadow-[0_1px_2px_rgba(8,145,178,0.1)]">{connection}%</span>
        </div>
        <div className="hud-lives flex gap-1 text-rose-500 text-sm sm:text-xl drop-shadow-[0_2px_8px_rgba(244,63,94,0.35)] pl-1">
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>♥</span>
          ))}
        </div>
      </div>

      {/* Real-time Countdown Timer & Stage Tracking Display */}
      <div className="hud-timer flex flex-col items-center bg-white/60 border border-white/50 px-3 py-1 sm:px-6 sm:py-2 rounded-full backdrop-blur-md shadow-md shadow-slate-200/10 text-center">
        <span className="hud-timer-title text-[7px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-500">Stage: {gameStage}</span>
        <span className="hud-timer-value text-sm sm:text-xl font-black text-slate-800">00:{timer < 10 ? `0${timer}` : timer}</span>
      </div>

      <div className="flex gap-4">
        <div className="hud-card bg-white/75 backdrop-blur-md border border-white/50 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-slate-800 text-right pointer-events-auto shadow-lg shadow-slate-200/20 transition-all duration-500">
          <span className="hud-card-title text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Score</span>
          <span className="hud-card-value text-lg sm:text-2xl font-black text-amber-600 drop-shadow-[0_1px_2px_rgba(217,119,6,0.1)]">
            {score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}
          </span>
        </div>
      </div>
    </div>
  );
}

function GameRunner() {
  const { executeCopingStrategy, connection } = useGameState();

  useKeyboardControls((strategy) => {
    executeCopingStrategy(strategy);
  });

  const factor = (100 - connection) / 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans">
      {/* Dynamic Background Gradient Layers */}
      <div 
        className="absolute inset-0 bg-linear-to-tr from-[#ffe4e6] via-[#ffd3b6] to-[#dbeafe] transition-opacity duration-1000 ease-in-out z-0"
        style={{ opacity: 1 - factor }}
      />
      <div 
        className="absolute inset-0 bg-linear-to-tr from-[#e0e7ff] via-[#e2e8f0] to-[#ddd6fe] transition-opacity duration-1000 ease-in-out z-0"
        style={{ opacity: factor }}
      />

      <div className="relative z-10 w-full h-full">
        <MindscapeStage />
      </div>
      <DynamicVignette />
      <HUD />
      <InsightOverlay />
      <CopingDock />
      <EndScreen /> {/* Active endgame layer checks */}
      <OrientationGate />
      <LoadingScreen />
    </div>
  );
}

function App() {
  return (
    <GameStateProvider>
      <GameRunner />
    </GameStateProvider>
  );
}

export default App;