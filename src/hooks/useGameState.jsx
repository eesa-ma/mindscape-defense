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
  
  const [gameStatus, setGameStatus] = useState('menu'); 
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(60); 
  const [gameStage, setGameStage] = useState('early'); 
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);

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

  // Difficulty scaling logic based on game plan stages
  const getStageModifiers = useCallback(() => {
    if (gameStage === 'mid') return { spawnRate: 3000, speedMultiplier: 1.5 }; 
    if (gameStage === 'late') return { spawnRate: 1800, speedMultiplier: 2.2 }; 
    return { spawnRate: 4500, speedMultiplier: 1.0 }; 
  }, [gameStage]);

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

    const spawnDistance = 15;
    const modifiers = getStageModifiers();

    // Threats come from: top, left (upper half), right (upper half)
    // In 3D: camera is behind (positive Z), so:
    //   top    = negative Z (far from camera)
    //   left   = negative X, upper half = Z from -spawnDistance to 0
    //   right  = positive X, upper half = Z from -spawnDistance to 0
    const zone = Math.floor(Math.random() * 3); // 0=top, 1=left, 2=right
    let spawnX, spawnZ;
    if (zone === 0) {
      // Top: spread across X, far negative Z
      spawnX = (Math.random() - 0.5) * spawnDistance * 1.5;
      spawnZ = -spawnDistance;
    } else if (zone === 1) {
      // Left upper half
      spawnX = -spawnDistance;
      spawnZ = -spawnDistance + Math.random() * spawnDistance;
    } else {
      // Right upper half
      spawnX = spawnDistance;
      spawnZ = -spawnDistance + Math.random() * spawnDistance;
    }

    const newThreat = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      position: [spawnX, 0, spawnZ],
      speed: (0.02 + Math.random() * 0.02) * modifiers.speedMultiplier,
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
      handleSuccessfulCope(100, strategy.insight);
      removeThreat(targetedThreat.id);
    } else {
      audioSynth.playFailure(); // play warning slide on incorrect cope
      setWrongAnswerCount(prev => prev + 1);
      const penalty = gameStage === 'late' ? 25 : 15;
      setConnection(prev => {
        const next = Math.max(prev - penalty, 0);
        if (next <= 0) setGameStatus('lost');
        return next;
      });
    }
  };

  const startGame = () => {
    audioSynth.playClick();
    setConnection(100);
    setLives(3);
    setScore(0);
    setThreats([]);
    setTargetedThreat(null);
    setGameStage('early');
    setGameStatus('playing');
    setTimer(60);
    setIsPaused(false);
    setWrongAnswerCount(0);
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
      connection, lives, score, activeInsight, threats, targetedThreat, gameStatus, timer, gameStage, isPortrait, isPaused, isMuted, wrongAnswerCount,
      setTargetedThreat, spawnThreat, removeThreat, handleThreatCollision, executeCopingStrategy, restartGame, togglePause, quitGame, toggleMute, getStageModifiers, startGame, goToMenu
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);