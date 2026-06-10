// src/hooks/useGameState.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [connection, setConnection] = useState(100); 
  const [lives, setLives] = useState(3);             
  const [score, setScore] = useState(0);
  const [activeInsight, setActiveInsight] = useState(null);
  const [threats, setThreats] = useState([]);
  const [targetedThreat, setTargetedThreat] = useState(null);
  
  const [gameStatus, setGameStatus] = useState('playing'); 
  const [timer, setTimer] = useState(60); 
  const [gameStage, setGameStage] = useState('early'); 
  const [isPortrait, setIsPortrait] = useState(false);

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
    if (gameStatus !== 'playing' || isPortrait) return;

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
  }, [gameStatus, isPortrait]);

  const handleSuccessfulCope = (points, insightText) => {
    if (gameStatus !== 'playing') return;
    setScore(prev => prev + points); 
    setConnection(prev => Math.min(prev + 10, 100)); 
    setActiveInsight(insightText);
    setTimeout(() => setActiveInsight(null), 3500);
  };

  const spawnThreat = useCallback((type) => {
    if (gameStatus !== 'playing') return;

    const angle = Math.random() * Math.PI * 2;
    const spawnDistance = 15;
    const modifiers = getStageModifiers();
    
    const newThreat = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      position: [Math.cos(angle) * spawnDistance, 0, Math.sin(angle) * spawnDistance],
      speed: (0.02 + Math.random() * 0.02) * modifiers.speedMultiplier,
    };

    setThreats(prev => {
      const updated = [...prev];
      if (updated.length === 0) setTargetedThreat(newThreat);
      return [...updated, newThreat];
    });
  }, [gameStatus, getStageModifiers]);

  const removeThreat = (id) => {
    setThreats(prev => {
      const filtered = prev.filter(t => t.id !== id);
      setTargetedThreat(filtered.length > 0 ? filtered[0] : null);
      return filtered;
    });
  };

  const handleThreatCollision = (id) => {
    removeThreat(id);
    
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

    if (strategy.counteracts === targetedThreat.type) {
      handleSuccessfulCope(100, strategy.insight);
      removeThreat(targetedThreat.id);
    } else {
      const penalty = gameStage === 'late' ? 25 : 15;
      setConnection(prev => {
        const next = Math.max(prev - penalty, 0);
        if (next <= 0) setGameStatus('lost');
        return next;
      });
    }
  };

  const restartGame = () => {
    setConnection(100);
    setLives(3);
    setScore(0);
    setThreats([]);
    setTargetedThreat(null);
    setGameStage('early');
    setGameStatus('playing');
    setTimer(60);
  };

  return (
    <GameStateContext.Provider value={{
      connection, lives, score, activeInsight, threats, targetedThreat, gameStatus, timer, gameStage, isPortrait,
      setTargetedThreat, spawnThreat, removeThreat, handleThreatCollision, executeCopingStrategy, restartGame, getStageModifiers
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);