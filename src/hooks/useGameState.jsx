import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { audioSynth } from '../utils/audioSynth';

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [connection, setConnection] = useState(100); 
  const [lives, setLives] = useState(3);             
  const [score, setScore] = useState(0);
  const [activeInsight, setActiveInsight] = useState(null);
  const [threats, setThreats] = useState([]);
  const [targetedThreat, setTargetedThreat] = useState(null);
  const [lightningActive, setLightningActive] = useState(false);
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'medium' | 'hard'

  const [gameStatus, setGameStatus] = useState('menu'); 
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(60); 
  const [gameStage, setGameStage] = useState('early'); 
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Monitor orientation matches in sync with CSS
  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const checkOrientation = (e) => {
      setIsPortrait(e.matches);
    };
    
    setIsPortrait(mediaQuery.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', checkOrientation);
      return () => mediaQuery.removeEventListener('change', checkOrientation);
    } else {
      mediaQuery.addListener(checkOrientation);
      return () => mediaQuery.removeListener(checkOrientation);
    }
  }, []);

  // Spawn rate scales with stage + difficulty; speed NEVER changes (always 1.0)
  const getStageModifiers = useCallback(() => {
    const baseRate =
      difficulty === 'hard'   ? 2800 :
      difficulty === 'medium' ? 4000 : 5500;
    if (gameStage === 'mid')  return { spawnRate: Math.round(baseRate * 0.75), speedMultiplier: 1.0 };
    if (gameStage === 'late') return { spawnRate: Math.round(baseRate * 0.55), speedMultiplier: 1.0 };
    return { spawnRate: baseRate, speedMultiplier: 1.0 };
  }, [gameStage, difficulty]);

  useEffect(() => {
    if (gameStatus !== 'playing' || isPortrait || isPaused) return;

    const clock = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setGameStatus('won'); 
          clearInterval(clock);
          return 0;
        }
        
        // Progression triggers
        if (prev === 40) setGameStage('mid');
        if (prev === 20) setGameStage('late');
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(clock);
  }, [gameStatus, isPortrait, isPaused]);

  // Handle game music ambient pad playback
  useEffect(() => {
    if (gameStatus === 'playing' && !isPaused && !isPortrait) {
      audioSynth.startPad();
    } else {
      audioSynth.stopPad();
    }
  }, [gameStatus, isPaused, isPortrait]);

  // Handle ambient pad chord transition dynamically based on connection levels
  useEffect(() => {
    audioSynth.updateConnection(connection);
  }, [connection]);

  // Trigger victory/defeat sound effects on status changes
  useEffect(() => {
    if (gameStatus === 'won') {
      audioSynth.playVictory();
    } else if (gameStatus === 'lost' || gameStatus === 'quit') {
      audioSynth.playDefeat();
    }
  }, [gameStatus]);

  const handleSuccessfulCope = (points, insightText) => {
    if (gameStatus !== 'playing') return;
    audioSynth.playSuccess(); // play success arpeggio
    setScore(prev => prev + points); 
    setConnection(prev => Math.min(prev + 10, 100)); 
    setActiveInsight(insightText);
    setTimeout(() => setActiveInsight(null), 3500);
  };

  const spawnThreat = useCallback((type) => {
    if (gameStatus !== 'playing' || isPaused) return;

    // Front-facing scene: threats fall from top (high Y), random X spread
    const randomX = (Math.random() - 0.5) * 18;      // −9 … +9
    const topY    = 5.0 + Math.random() * 2.0;        // 5.0 … 7.0 (below clouds)
    const modifiers = getStageModifiers();

    const newThreat = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      position: [randomX, topY, 0],
      speed: (0.006 + Math.random() * 0.005) * modifiers.speedMultiplier,
    };

    setThreats(prev => {
      const updated = [...prev];
      if (updated.length === 0) setTargetedThreat(newThreat);
      return [...updated, newThreat];
    });
  }, [gameStatus, isPaused, getStageModifiers]);

  const removeThreat = (id) => {
    setThreats(prev => {
      const filtered = prev.filter(t => t.id !== id);
      setTargetedThreat(filtered.length > 0 ? filtered[0] : null);
      return filtered;
    });
  };

  const handleThreatCollision = (id) => {
    removeThreat(id);
    audioSynth.playFailure(); // play collision crash
    
    setConnection((prev) => {
      const nextConnection = Math.max(prev - 20, 0);
      if (nextConnection <= 0) setGameStatus('lost');
      return nextConnection;
    });

    setLives((prevLives) => {
      const nextLives = prevLives - 1;
      if (nextLives <= 0) setGameStatus('lost');
      return nextLives;
    });
  };

  const executeCopingStrategy = (strategy) => {
    if (gameStatus !== 'playing' || !targetedThreat) return;

    audioSynth.playClick(); // play input pop sound

    if (strategy.counteracts.includes(targetedThreat.type)) {
      // ✅ Correct coping — rain lightens, connection grows
      handleSuccessfulCope(100, strategy.insight);
      removeThreat(targetedThreat.id);
    } else {
      // ⚡ Wrong coping — lightning strike, lose a life
      audioSynth.playFailure();
      setLightningActive(true);
      setTimeout(() => setLightningActive(false), 750);
      setLives(prev => {
        const next = Math.max(prev - 1, 0);
        if (next <= 0) setGameStatus('lost');
        return next;
      });
    }
  };

  const startGame = (diff = 'easy') => {
    audioSynth.playClick();
    setDifficulty(diff);
    setConnection(100);
    setLives(3);
    setScore(0);
    setThreats([]);
    setTargetedThreat(null);
    setGameStage('early');
    setGameStatus('playing');
    setTimer(60);
    setIsPaused(false);
  };

  const restartGame = () => {
    startGame();
  };

  const goToMenu = () => {
    audioSynth.playClick();
    setGameStatus('menu');
  };

  const togglePause = () => {
    if (gameStatus === 'playing') {
      audioSynth.playClick();
      setIsPaused(prev => !prev);
    }
  };

  const quitGame = () => {
    audioSynth.playClick();
    setIsPaused(false);
    setGameStatus('menu'); // Quit redirects back to main menu
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  useEffect(() => {
    audioSynth.setMuted(isMuted);
  }, [isMuted]);

  return (
    <GameStateContext.Provider value={{
      connection, lives, score, activeInsight, threats, targetedThreat, gameStatus, timer, gameStage,
      isPortrait, isPaused, isMuted, lightningActive, difficulty,
      setTargetedThreat, spawnThreat, removeThreat, handleThreatCollision, executeCopingStrategy,
      restartGame, togglePause, quitGame, toggleMute, getStageModifiers, startGame, goToMenu
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);