import { useEffect } from 'react';
import { COPING_MECHANISMS } from '../config/gameData';

export const useKeyboardControls = (onCopeExecuted) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      
      // Prevent standard browser keys from scrolling or behaving weirdly during game
      if (Object.keys(COPING_MECHANISMS).includes(key)) {
        event.preventDefault();
        onCopeExecuted(COPING_MECHANISMS[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCopeExecuted]);
};