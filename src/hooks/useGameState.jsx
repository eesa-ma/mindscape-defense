import { createContext, useContext, useState, useEffect } from 'react';

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [connection, setConnection] = useState(100); // Starts at 100% [cite: 39]
  const [lives, setLives] = useState(3);             // Starts with 3 lives [cite: 44]
  const [score, setScore] = useState(0);
  const [gameStage, setGameStage] = useState('early'); // early, mid, late [cite: 64, 68, 72]
  const [activeInsight, setActiveInsight] = useState(null);

  // Example handler when a player successfully copes [cite: 34]
  const handleSuccessfulCope = (points, insightText) => {
    setScore(prev => prev + points);
    setConnection(prev => Math.min(prev + 10, 100)); // Restore connection [cite: 41, 56]
    
    // Trigger the brief educational popup [cite: 86]
    setActiveInsight(insightText);
    setTimeout(() => setActiveInsight(null), 3500); 
  };

  // Example handler when a challenge hits the player [cite: 35, 40]
  const handlePlayerDamage = (impact) => {
    setConnection(prev => {
      const next = prev - impact;
      if (next <= 0) {
        // Handle Game Over [cite: 17, 42]
      }
      return Math.max(next, 0);
    });
  };

  return (
    <GameStateContext.Provider value={{
      connection, lives, score, gameStage, activeInsight,
      handleSuccessfulCope, handlePlayerDamage
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);