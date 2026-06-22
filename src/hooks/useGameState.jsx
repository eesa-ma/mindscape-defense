import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { audioSynth } from '../utils/audioSynth';
import { COPING_MECHANISMS } from '../config/gameData';

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [connection, setConnection] = useState(100); 
  const [lives, setLives] = useState(3);             
  const [score, setScore] = useState(0);
  const [activeInsight, setActiveInsight] = useState(null);
  const [threats, setThreats] = useState([]);
  const [targetedThreat, setTargetedThreat] = useState(null);
  const [gameStatus, setGameStatus] = useState('splash');
  const [isPaused, setIsPaused] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isMistake, setIsMistake] = useState(false);
  const [level, setLevel] = useState(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem('mindscapeMaxLevel');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [enemiesDefeatedThisLevel, setEnemiesDefeatedThisLevel] = useState(0); 
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('mindscapePlayerName') || 'Player';
  });
  const [hasSetPlayerName, setHasSetPlayerName] = useState(() => {
    return localStorage.getItem('mindscapeHasSetName') === 'true';
  });

  const updatePlayerName = useCallback((newName) => {
    setPlayerName(newName);
    localStorage.setItem('mindscapePlayerName', newName);
    setHasSetPlayerName(true);
    localStorage.setItem('mindscapeHasSetName', 'true');
  }, []);

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
    // Faster spawns at higher levels
    const spawnRate = Math.max(1500, 4500 - (level * 600)); 
    return { spawnRate }; 
  }, [level]);

  // Progression logic: Level completion
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    // Calculate enemies required for the CURRENT level
    const requiredForLevelComplete = level * 5;
    
    if (enemiesDefeatedThisLevel >= requiredForLevelComplete) {
      setGameStatus('won');
      // If we beat our highest unlocked level (and it's not the final level 6)
      if (level === maxUnlockedLevel && level < 6) {
        const nextLevel = level + 1;
        setMaxUnlockedLevel(nextLevel);
        localStorage.setItem('mindscapeMaxLevel', nextLevel.toString());
      }
    }
  }, [enemiesDefeatedThisLevel, gameStatus, level, maxUnlockedLevel]);

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
    setEnemiesDefeatedThisLevel(prev => prev + 1);
    setActiveInsight(insightText);
    setIsCelebrating(true);
    setTimeout(() => setActiveInsight(null), 3500);
    setTimeout(() => setIsCelebrating(false), 2000);
  };

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('mindscapeOnboardingCompleted', 'true');
    setGameStatus('menu');
  }, []);

  const enterGame = useCallback(() => {
    const hasSeenOnboarding = localStorage.getItem('mindscapeOnboardingCompleted');
    setGameStatus(hasSeenOnboarding ? 'menu' : 'onboarding');
  }, []);

  const spawnThreat = useCallback(() => {
    if (gameStatus !== 'playing' || isPaused) return;

    const spawnDistance = 15;
    
    // Determine which strategies are unlocked at this level
    // Level 1: 2 strategies (index 0, 1). Level 6: 7 strategies (index 0..6)
    const strategyKeys = ['1', '2', '3', '4', '5', '6', '7'];
    const unlockedKeys = strategyKeys.slice(0, level + 1);
    
    // Aggregate all possible threat types that the player can currently counter
    const possibleThreats = unlockedKeys.flatMap(k => COPING_MECHANISMS[k].counteracts);
    const selectedType = possibleThreats[Math.floor(Math.random() * possibleThreats.length)];

    // Faster speed at higher levels
    const speedMultiplier = 1 + (level * 0.15);

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
      type: selectedType,
      position: [spawnX, 0, spawnZ],
      speed: (0.02 + Math.random() * 0.02) * speedMultiplier,
    };

    setThreats(prev => {
      const updated = [...prev];
      if (updated.length === 0) setTargetedThreat(newThreat);
      return [...updated, newThreat];
    });
  }, [gameStatus, isPaused, level]);

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
      setIsMistake(true);
      setTimeout(() => setIsMistake(false), 2000);
      const penalty = level >= 4 ? 25 : 15;
      setConnection(prev => {
        const next = Math.max(prev - penalty, 0);
        if (next <= 0) setGameStatus('lost');
        return next;
      });
    }
  };

  const startGame = () => {
    setGameStatus('levelSelect');
    audioSynth.playSuccess();
  };

  const startLevel = (lvl) => {
    setLevel(lvl);
    setConnection(100);
    setLives(3);
    setScore(0);
    setEnemiesDefeatedThisLevel(0);
    setThreats([]);
    setTargetedThreat(null);
    setGameStatus('playing');
    setIsPaused(false);
    setWrongAnswerCount(0);
  };

  const restartLevel = () => {
    startLevel(level);
  };

  const returnToLevelSelect = () => {
    setThreats([]);
    setTargetedThreat(null);
    setGameStatus('levelSelect');
  };

  const goToMenu = () => {
    audioSynth.playClick();
    setThreats([]);
    setTargetedThreat(null);
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
    setThreats([]);
    setTargetedThreat(null);
    setGameStatus('menu'); // Quit redirects back to main menu
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const resetProgress = useCallback(() => {
    if (window.confirm("Are you sure you want to completely wipe your progress and start over? This cannot be undone.")) {
      localStorage.removeItem('mindscapeOnboardingCompleted');
      localStorage.removeItem('mindscapeMaxLevel');
      localStorage.removeItem('mindscapePlayerName');
      localStorage.removeItem('mindscapeHasSetName');
      setHasSetPlayerName(false);
      setPlayerName('Player');
      setMaxUnlockedLevel(1);
      setLevel(1);
      setGameStatus('splash');
    }
  }, []);

  useEffect(() => {
    audioSynth.setMuted(isMuted);
  }, [isMuted]);

  return (
    <GameStateContext.Provider value={{
      connection, lives, score, activeInsight, threats, targetedThreat, gameStatus, level, maxUnlockedLevel, enemiesDefeatedThisLevel, isPortrait, isPaused, isMuted, wrongAnswerCount, playerName, hasSetPlayerName, isCelebrating, isMistake,
      setTargetedThreat, spawnThreat, removeThreat, handleThreatCollision, executeCopingStrategy, restartLevel, togglePause, quitGame, toggleMute, getStageModifiers, completeOnboarding, enterGame, startGame, startLevel, returnToLevelSelect, goToMenu, resetProgress, updatePlayerName
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);