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
  // Lower connection = wider, darker vignette opacity coverage
  const intensity = (100 - connection) * 0.7; 

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-40 transition-all duration-1000 mix-blend-multiply"
      style={{
        background: `radial-gradient(circle, transparent ${110 - intensity}%, rgba(15, 17, 26, ${intensity / 100 + 0.2}) 100%)`
      }}
    />
  );
}

function HUD() {
  const { connection, score, lives, timer, gameStage } = useGameState();

  return (
    <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center pointer-events-none">
      <div className="flex flex-col gap-2">
        <div className="bg-slate-950/60 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl text-slate-200 pointer-events-auto">
          <span className="text-xs font-mono uppercase tracking-wider opacity-60 block">Connection Meter</span>
          <span className="text-xl font-black font-mono text-cyan-400">{connection}%</span>
        </div>
        <div className="flex gap-1.5 text-rose-500 text-lg drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>♥</span>
          ))}
        </div>
      </div>

      {/* Real-time Countdown Timer & Stage Tracking Display */}
      <div className="flex flex-col items-center bg-slate-950/40 border border-slate-800/40 px-6 py-1.5 rounded-full backdrop-blur-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Stage: {gameStage}</span>
        <span className="text-xl font-black font-mono text-slate-100">00:{timer < 10 ? `0${timer}` : timer}</span>
      </div>

      <div className="flex gap-4">
        <div className="bg-slate-950/60 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl text-slate-200 text-right pointer-events-auto">
          <span className="text-xs font-mono uppercase tracking-wider opacity-60 block">Score</span>
          <span className="text-xl font-black font-mono text-amber-400">
            {score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}
          </span>
        </div>
      </div>
    </div>
  );
}

function GameRunner() {
  const { executeCopingStrategy } = useGameState();

  useKeyboardControls((strategy) => {
    executeCopingStrategy(strategy);
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#111319] select-none">
      <MindscapeStage />
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