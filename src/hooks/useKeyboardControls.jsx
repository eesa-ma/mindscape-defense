import { useEffect } from 'react';
import { COPING_MECHANISMS } from '../config/gameData';

export const useKeyboardControls = (onCopeExecuted) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent standard browser keys from scrolling or behaving weirdly during game
      if (['Q', 'W', 'E', 'R'].includes(event.key.toUpperCase())) {
        event.preventDefault();
      }

      const key = event.key.toUpperCase();
      if (COPING_MECHANISMS[key]) {
        onCopeExecuted(COPING_MECHANISMS[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCopeExecuted]);
};