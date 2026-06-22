import { useEffect, useState, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';

export default function FailureOverlay() {
  const { wrongAnswerCount } = useGameState();
  const [activeStrikes, setActiveStrikes] = useState([]);

  useEffect(() => {
    if (wrongAnswerCount > 0) {
      const id = `strike-${wrongAnswerCount}-${Date.now()}`;
      setActiveStrikes(prev => [...prev, id]);

      // Remove after animation completes
      setTimeout(() => {
        setActiveStrikes(prev => prev.filter(s => s !== id));
      }, 1000);
    }
  }, [wrongAnswerCount]);

  if (activeStrikes.length === 0) return null;

  return (
    <>
      {activeStrikes.map(id => (
        <div key={id} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 55 }}>

          {/* Lightning bolt strike from top to character */}
          <svg 
            className="absolute" 
            style={{
              left: '50%', 
              top: '0',
              width: '120px',
              height: '65%',
              transform: 'translateX(-50%)',
              animation: 'strike-flash 0.8s ease-out forwards',
            }}
            viewBox="0 0 120 400" 
            preserveAspectRatio="none"
          >
            <path 
              d="M60,0 L45,80 L70,100 L35,200 L65,220 L40,320 L75,340 L55,400" 
              stroke="#fbbf24" 
              strokeWidth="6" 
              fill="none" 
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 15px #fbbf24) drop-shadow(0 0 30px #f59e0b)' }}
            />
            <path 
              d="M60,0 L45,80 L70,100 L35,200 L65,220 L40,320 L75,340 L55,400" 
              stroke="#ffffff" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Impact burst at character position */}
          <div 
            className="absolute"
            style={{
              left: '50%',
              top: '60%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              animation: 'impact-burst 0.6s ease-out forwards',
            }}
          >
            {/* Radiating impact lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '3px',
                  height: '80px',
                  background: 'linear-gradient(to bottom, #fbbf24, transparent)',
                  transformOrigin: 'center top',
                  transform: `rotate(${i * 30}deg) translateY(-20px)`,
                  opacity: 0.9,
                  animation: `impact-line 0.5s ease-out ${i * 0.02}s forwards`,
                }}
              />
            ))}

            {/* Central white flash */}
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffffff 0%, #fbbf24 40%, transparent 70%)',
                animation: 'impact-glow 0.4s ease-out forwards',
              }}
            />
          </div>

          {/* Quick red vignette flash */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(220,38,38,0.4) 100%)',
              animation: 'red-pulse 0.5s ease-out forwards',
            }}
          />
        </div>
      ))}
    </>
  );
}
