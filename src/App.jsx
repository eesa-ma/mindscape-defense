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
import PauseButton from './components/UI/PauseButton';
import StartMenu from './components/UI/StartMenu';

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
  const { connection, score, lives, timer, gameStage, isMuted, toggleMute, gameStatus } = useGameState();

  if (gameStatus !== 'playing') return null;

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
          .hud-mute-btn svg {
            width: 1.125rem !important;
            height: 1.125rem !important;
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
          .hud-mute-btn svg {
            width: 0.95rem !important;
            height: 0.95rem !important;
          }
        }
      `}</style>
      
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="hud-card bg-cyan-100 border-[3px] border-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl text-slate-800 pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] transition-all duration-500">
          <span className="hud-card-title text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 block">💖 Connection Meter</span>
          <span className="hud-card-value text-lg sm:text-2xl font-black text-cyan-600">{connection}%</span>
        </div>
        <div className="hud-lives flex gap-1.5 text-lg sm:text-2xl pl-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`inline-block transition-transform duration-500 ${
                i < lives ? 'scale-100 animate-heart-pulse text-rose-500' : 'scale-95 text-slate-400 opacity-40'
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Real-time Countdown Timer & Stage Tracking Display */}
      <div className="hud-timer flex flex-col items-center bg-purple-100 border-[3px] border-slate-800 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-3xl text-center shadow-[3px_3px_0px_rgba(30,41,59,1)] pointer-events-auto">
        <span className="hud-timer-title text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-purple-800">⏰ Stage: {gameStage}</span>
        <span className="hud-timer-value text-sm sm:text-xl font-black text-purple-950">00:{timer < 10 ? `0${timer}` : timer}</span>
      </div>

      <div className="flex gap-2 sm:gap-3 items-center">
        <button
          onClick={toggleMute}
          className="hud-card hud-mute-btn bg-pink-100 border-[3px] border-slate-800 p-2 sm:p-2.5 rounded-2xl text-slate-700 hover:text-slate-900 pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-105 active:scale-95 active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6H4.51c-.88 0-1.704.507-1.938 1.354A9.01 9.01 0 002.25 12c0 .83.112 1.633.322 2.396C2.806 15.244 3.63 15.75 4.51 15.75H6.75l4.72 4.72a.75.75 0 001.28-.53V3.06a.75.75 0 00-1.28-.53L6.75 7.25z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>
        
        <div className="hud-card bg-amber-100 border-[3px] border-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl text-slate-800 text-right pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] transition-all duration-500">
          <span className="hud-card-title text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">⭐ Score</span>
          <span className="hud-card-value text-lg sm:text-2xl font-black text-amber-600">
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
      <PauseButton />
      <InsightOverlay />
      <CopingDock />
      <EndScreen /> {/* Active endgame layer checks */}
      <StartMenu />
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