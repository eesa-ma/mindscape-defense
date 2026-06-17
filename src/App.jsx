import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Heart, Star } from 'lucide-react';
import './index.css';
import { GameStateProvider, useGameState } from './hooks/useGameState';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { toggleFullscreen, isFullscreen } from './utils/fullscreen';
import MindscapeStage from './components/Experience/MindscapeStage';
import CopingDock from './components/UI/CopingDock';
import InsightOverlay from './components/UI/InsightOverlay';
import EndScreen from './components/UI/EndScreen';
import OrientationGate from './components/UI/OrientationGate';
import LoadingScreen from './components/UI/LoadingScreen';
import StartMenu from './components/UI/StartMenu';
import CelebrationOverlay from './components/UI/CelebrationOverlay';
import FailureOverlay from './components/UI/FailureOverlay';
import LevelSelectScreen from './components/UI/LevelSelectScreen';
import OnboardingScreen from './components/UI/OnboardingScreen';
import SplashScreen from './components/UI/SplashScreen';
import NamePromptScreen from './components/UI/NamePromptScreen';

function MenuFullscreenToggle() {
  const { gameStatus } = useGameState();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setFullscreen(isFullscreen());
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    setFullscreen(isFullscreen());
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Don't show on Splash Screen (they haven't entered yet) or when Playing (HUD has its own button)
  if (gameStatus === 'playing' || gameStatus === 'splash') return null;

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-99999 bg-white/80 backdrop-blur-md border-[3px] border-slate-300 p-2 sm:p-2.5 rounded-xl text-slate-600 pointer-events-auto shadow-[3px_3px_0px_rgba(203,213,225,1)] hover:bg-white hover:text-slate-800 hover:-translate-y-0.5 active:translate-y-0.5 transition-all h-sm:p-1.5 h-xs:p-1 flex items-center justify-center"
      title="Toggle Fullscreen"
    >
      {fullscreen ? (
        <Minimize className="w-5 h-5 sm:w-6 sm:h-6" />
      ) : (
        <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
      )}
    </button>
  );
}

function HUD() {
  const { connection, score, lives, level, enemiesDefeatedThisLevel, isMuted, toggleMute, gameStatus, togglePause } = useGameState();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setFullscreen(isFullscreen());
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    // Set initial state
    setFullscreen(isFullscreen());
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

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
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hud-card bg-cyan-100 border-[3px] border-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl text-slate-800 pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] transition-all duration-500">
            <span className="hud-card-title text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 flex items-center gap-1"><Heart className="w-3 h-3" fill="currentColor" /> Connection Meter</span>
            <span className="hud-card-value text-lg sm:text-2xl font-black text-cyan-600">{connection}%</span>
          </div>
          <button
            onClick={togglePause}
            className="hud-card bg-pink-100 border-[3px] border-slate-800 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl text-slate-800 hover:text-slate-900 pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-105 active:scale-95 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center"
            title="Pause Game (P)"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none fill-slate-800"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>
        </div>
        <div className="hud-lives flex gap-1.5 text-lg sm:text-2xl pl-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="text-[12px] sm:text-[16px] filter drop-shadow-md transition-all duration-300 flex items-center justify-center">
              {i < lives ? <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" fill="currentColor" /> : <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 opacity-50" fill="currentColor" />}
            </span>
          ))}
        </div>
      </div>

      {/* Level & Progress Display */}
      <div className="hud-timer flex flex-col items-center bg-purple-100 border-[3px] border-slate-800 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-3xl text-center shadow-[3px_3px_0px_rgba(30,41,59,1)] pointer-events-auto">
        <span className="hud-timer-title text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-purple-800 flex items-center justify-center gap-1"><Star className="w-3 h-3" fill="currentColor" /> LEVEL {level}</span>
        <span className="hud-timer-value text-sm sm:text-xl font-black text-purple-950">
          {level < 6 ? `${enemiesDefeatedThisLevel} / ${level * 5}` : 'MAX'}
        </span>
      </div>

      <div className="flex gap-2 sm:gap-3 items-center">
        <button
          onClick={toggleMute}
          className="hud-card hud-mute-btn bg-pink-100 border-[3px] border-slate-800 p-2 sm:p-2.5 rounded-2xl text-slate-700 hover:text-slate-900 pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-105 active:scale-95 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center"
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

        <button
          onClick={toggleFullscreen}
          className="bg-sky-100 border-[3px] border-slate-800 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-slate-800 pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:bg-sky-200 hover:-translate-y-0.5 active:translate-y-0.5 transition-all h-sm:p-1.5 h-xs:p-1 flex items-center justify-center"
          title="Toggle Fullscreen"
        >
          {fullscreen ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M15 9V4.5M15 9h4.5M9 15v4.5M9 15H4.5M15 15v4.5M15 15h4.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>

        <div className="hud-card bg-amber-100 border-[3px] border-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl text-slate-800 text-right pointer-events-auto shadow-[3px_3px_0px_rgba(30,41,59,1)] transition-all duration-500">
          <span className="hud-card-title text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center justify-end gap-1"><Star className="w-3 h-3" fill="currentColor" /> Score</span>
          <span className="hud-card-value text-lg sm:text-2xl font-black text-amber-600">
            {score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}
          </span>
        </div>
      </div>
    </div>
  );
}

const CracksOverlay = ({ connection }) => {
  // Cracks only appear when connection is below 50%, reaching full opacity at 0%
  const opacity = connection < 50 ? (50 - connection) / 50 : 0;
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out mix-blend-multiply"
      style={{ opacity }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 L15,20 L10,40 L25,60 L20,80" stroke="#0f172a" strokeWidth="0.4" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M100,20 L80,30 L85,50 L70,80 L80,100" stroke="#0f172a" strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M40,100 L45,80 L35,60 L50,40" stroke="#0f172a" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M0,60 L15,70 L10,90" stroke="#0f172a" strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M60,0 L65,20 L55,40" stroke="#0f172a" strokeWidth="0.7" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
};

function BackgroundMusic() {
  const { gameStatus, isMuted } = useGameState();
  const audioRef = React.useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const playAudio = async () => {
      try {
        if (audioRef.current.paused) {
          await audioRef.current.play();
        }
      } catch (err) {
        // Autoplay might be blocked until user interacts
      }
    };

    if (gameStatus !== 'splash') {
      playAudio();
    }
  }, [gameStatus]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    // Lower volume for menus, higher for gameplay
    const targetVolume = gameStatus === 'playing' ? 0.6 : 0.2;
    audioRef.current.volume = targetVolume;
  }, [gameStatus]);

  return <audio ref={audioRef} src="/bg-music.mpeg" loop />;
}

function GameRunner() {
  const { executeCopingStrategy, connection, gameStatus, level } = useGameState();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 8. Slight Parallax Movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30; // Max 15px shift
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useKeyboardControls((strategy) => {
    executeCopingStrategy(strategy);
  });

  const getBackgroundImage = (lvl) => {
    switch(lvl) {
      case 1: return "url('/mindscape-bg.png')";
      case 2: return "url('/bg-2.png')";
      case 3: return "url('/bg-3.png')";
      case 4: return "url('/bg-4.png')";
      case 5: return "url('/bg-5.png')";
      case 6: return "url('/bg-6.png')";
      default: return "url('/mindscape-bg.png')";
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden select-none font-sans bg-[#0f172a] game-shake-target">

      {/* Preload images to prevent flickering on level up */}
      <div className="hidden">
        <img src="/bg-2.png" alt="preload" />
        <img src="/bg-3.png" alt="preload" />
        <img src="/bg-4.png" alt="preload" />
        <img src="/bg-5.png" alt="preload" />
        <img src="/bg-6.png" alt="preload" />
      </div>

      {/* 8. Parallax wrapper (slightly larger than screen to hide edges) */}
      <div
        className="absolute inset-[-5%] z-0 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
      >
        {/* 9. Slow breathing animation */}
        <div className="absolute inset-0 animate-breathing origin-center">

          {/* 1 & 2 & 10. Dynamic Background Image with Smooth Transition */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{
              backgroundImage: getBackgroundImage(level),
              filter: gameStatus === 'playing' ? `grayscale(${100 - connection}%) brightness(${0.5 + (connection / 200)})` : 'none',
              opacity: 0.95
            }}
          />

          {/* 7. Crack Overlay System */}
          <CracksOverlay connection={gameStatus === 'playing' ? connection : 100} />

          {/* 3. Radial Vignette */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(15,23,42,0.95) 100%)',
              opacity: gameStatus === 'playing' ? 1 - (connection / 100) : 0
            }}
          />
        </div>
      </div>

      <div className="relative z-10 w-full h-full">
        <MindscapeStage />
      </div>
      <HUD />
      <InsightOverlay />
      <CelebrationOverlay />
      <FailureOverlay />
      <CopingDock />
      <EndScreen /> {/* Active endgame layer checks */}
      <OnboardingScreen />
      <SplashScreen />
      <NamePromptScreen />
      <StartMenu />
      <LevelSelectScreen />
      <OrientationGate />
      <LoadingScreen />
      <BackgroundMusic />

      {/* Menu controls (hidden during gameplay) */}
      <MenuFullscreenToggle />
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