// src/App.jsx
import React from 'react';
import { GameStateProvider, useGameState } from './hooks/useGameState';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import MindscapeStage from './components/Experience/MindscapeStage';
import CopingDock from './components/UI/CopingDock';
import InsightOverlay from './components/UI/InsightOverlay';
import EndScreen from './components/UI/EndScreen'; // Import the overlay

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
    <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center pointer-events-none select-none">
      <div className="flex flex-col gap-2">
        <div className="bg-white/75 backdrop-blur-md border border-white/50 px-4 py-2.5 rounded-2xl text-slate-800 pointer-events-auto shadow-lg shadow-slate-200/20 transition-all duration-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Connection Meter</span>
          <span className="text-2xl font-black text-cyan-600 drop-shadow-[0_1px_2px_rgba(8,145,178,0.1)]">{connection}%</span>
        </div>
        <div className="flex gap-1.5 text-rose-500 text-xl drop-shadow-[0_2px_8px_rgba(244,63,94,0.35)] pl-1">
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>♥</span>
          ))}
        </div>
      </div>

      {/* Real-time Countdown Timer & Stage Tracking Display */}
      <div className="flex flex-col items-center bg-white/60 border border-white/50 px-6 py-2 rounded-full backdrop-blur-md shadow-md shadow-slate-200/10 text-center">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Stage: {gameStage}</span>
        <span className="text-xl font-black text-slate-800">00:{timer < 10 ? `0${timer}` : timer}</span>
      </div>

      <div className="flex gap-4">
        <div className="bg-white/75 backdrop-blur-md border border-white/50 px-4 py-2.5 rounded-2xl text-slate-800 text-right pointer-events-auto shadow-lg shadow-slate-200/20 transition-all duration-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Score</span>
          <span className="text-2xl font-black text-amber-600 drop-shadow-[0_1px_2px_rgba(217,119,6,0.1)]">
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