import { useEffect, useState, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';

const COLORS = ['#fde047', '#f472b6', '#60a5fa', '#a78bfa', '#34d399', '#fb923c', '#ffffff'];

const ConfettiPiece = ({ style }) => (
  <div style={style} />
);

export default function CelebrationOverlay() {
  const { score } = useGameState();
  const [particles, setParticles] = useState([]);
  const prevScore = useRef(0);

  useEffect(() => {
    if (score > prevScore.current) {
      // Score went up! Trigger celebration
      const newParticles = [];
      
      for (let i = 0; i < 50; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const left = 30 + Math.random() * 40; // Spawn around center of screen
        const size = 6 + Math.random() * 10;
        const angle = Math.random() * 360;
        const velocityX = (Math.random() - 0.5) * 600;
        const velocityY = -(300 + Math.random() * 400); // Shoot upwards
        const rotation = Math.random() * 720 - 360;
        const delay = Math.random() * 0.15;
        const shape = Math.random() > 0.5 ? 'circle' : 'rect';
        
        newParticles.push({
          id: `${Date.now()}-${i}`,
          color,
          left,
          size,
          angle,
          velocityX,
          velocityY,
          rotation,
          delay,
          shape,
        });
      }
      
      setParticles(prev => [...prev, ...newParticles]);
      
      // Clean up after animation completes
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }, 2000);
    }
    prevScore.current = score;
  }, [score]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 60 }}>
      {particles.map((p) => (
        <ConfettiPiece
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '60%',
            width: p.shape === 'circle' ? `${p.size}px` : `${p.size * 0.6}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animation: `confetti-burst 1.5s ease-out ${p.delay}s forwards`,
            '--vx': `${p.velocityX}px`,
            '--vy': `${p.velocityY}px`,
            '--rot': `${p.rotation}deg`,
            opacity: 1,
          }}
        />
      ))}
    </div>
  );
}
