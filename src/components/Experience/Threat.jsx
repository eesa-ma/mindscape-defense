import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameState } from '../../hooks/useGameState';

export default function Threat({ threatData }) {
  const meshRef = useRef();
  const visualGroupRef = useRef();
  const particlesRef = useRef();
  
  const { handleThreatCollision, targetedThreat, setTargetedThreat, isPortrait, isPaused } = useGameState();
  const isTargeted = targetedThreat?.id === threatData.id;

  // New states for the destruction animation
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [explodeTime, setExplodeTime] = useState(0);

  // Generate random velocities for 30 explosion particles
  const particleCount = 30;
  const pVelocities = React.useMemo(() => {
    const v = [];
    for (let i = 0; i < particleCount; i++) {
      v.push([
        (Math.random() - 0.5) * 0.2, // x velocity
        (Math.random() - 0.5) * 0.2, // y velocity
        (Math.random() - 0.5) * 0.2  // z velocity
      ]);
    }
    return v;
  }, []);

  useFrame((state) => {
    // If screen is in portrait mode, freeze frame logic
    if (isPortrait || isPaused) return;

    // If destroyed, animate the explosion particles breaking outward
    if (isDestroyed) {
      setExplodeTime((prev) => prev + 1);
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += pVelocities[i][0];
          positions[i * 3 + 1] += pVelocities[i][1];
          positions[i * 3 + 2] += pVelocities[i][2];
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
      return;
    }

    if (!meshRef.current) return;

    // 1. Move closer to center [0, 0, 0]
    meshRef.current.position.x -= Math.sign(meshRef.current.position.x) * threatData.speed;
    meshRef.current.position.z -= Math.sign(meshRef.current.position.z) * threatData.speed;

    // 2. Y-axis organic bobbing wave
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2 + threatData.speed * 100) * 0.2;

    // 3. Spin crystal shard geometry
    if (visualGroupRef.current) {
      visualGroupRef.current.rotation.y += 0.02;
    }

    // 4. Collision threshold check
    const distance = Math.sqrt(
      meshRef.current.position.x ** 2 + meshRef.current.position.z ** 2
    );

    if (distance < 1.3) {
      handleThreatCollision(threatData.id);
    }
  });

  // Intercept the removal to play our animation first
  React.useEffect(() => {
    // If this threat was targeted but is suddenly missing from global state, it means it was successfully countered!
    if (!isDestroyed && targetedThreat?.id !== threatData.id && meshRef.current === undefined) {
      // Small trick: state updates happen instantly, we can listen to parent changes if needed, 
      // but to make it foolproof we will let the executeCopingStrategy trigger a local switch.
    }
  }, [targetedThreat, threatData.id, isDestroyed]);

  // Expose a way for the engine to shatter this crystal smoothly
  // To link this flawlessly, we update the removal sequence to trigger local destruction first
  const specs = (() => {
    switch (threatData.type) {
      case 'Burnout': case 'Exhaustion': case 'Creative Block':
        return { color: '#fbbf24', labelColor: 'text-amber-950 border-slate-800 bg-amber-100' };
      case 'Academic Pressure': case 'Procrastination': case 'Overwhelm':
        return { color: '#60a5fa', labelColor: 'text-blue-950 border-slate-800 bg-blue-100' };
      case 'Social Rejection': case 'Loneliness': case 'Imposter Syndrome':
        return { color: '#c084fc', labelColor: 'text-purple-950 border-slate-800 bg-purple-100' };
      case 'Negative Thoughts': case 'Self-Doubt': case 'Anxiety':
        return { color: '#f43f5e', labelColor: 'text-rose-950 border-slate-800 bg-rose-100' };
      case 'Isolation': case 'Ghosting': case 'Detachment':
        return { color: '#818cf8', labelColor: 'text-indigo-950 border-slate-800 bg-indigo-100' };
      case 'Social Comparison': case 'FOMO': case 'Cyberbullying':
        return { color: '#2dd4bf', labelColor: 'text-teal-950 border-slate-800 bg-teal-100' };
      case 'Family Conflict': case 'Misunderstandings': case 'Peer Pressure':
        return { color: '#f472b6', labelColor: 'text-pink-950 border-slate-800 bg-pink-100' };
      default:
        return { color: '#cbd5e1', labelColor: 'text-slate-900 border-slate-800 bg-slate-100' };
    }
  })();

  const THREAT_EMOJIS = {
    'Burnout': '🤯', 'Exhaustion': '😫', 'Creative Block': '🎨❌',
    'Social Rejection': '🥺', 'Loneliness': '🥀', 'Imposter Syndrome': '🎭',
    'Academic Pressure': '📚', 'Procrastination': '⏳', 'Overwhelm': '🌀',
    'Negative Thoughts': '🌩️', 'Self-Doubt': '😰', 'Anxiety': '💭',
    'Isolation': '🚪', 'Ghosting': '🔇', 'Detachment': '❄️',
    'Social Comparison': '📱', 'FOMO': '👀', 'Cyberbullying': '💔',
    'Family Conflict': '💥', 'Misunderstandings': '🗣️❌', 'Peer Pressure': '👥'
  };

  // Hack to make executeCopingStrategy trigger this component's local animation
  // We check if the global threats array still has us; if it doesn't, we show particles for 20 frames before vanishing completely.
  const { threats } = useGameState();
  const stillExists = threats.some(t => t.id === threatData.id);

  if (!stillExists && !isDestroyed) {
    setIsDestroyed(true);
  }

  if (isDestroyed && explodeTime > 25) {
    return null; // completely kill component once animation completes
  }

  return (
    <group ref={meshRef} position={threatData.position}>
      {isDestroyed ? (
        // EXPLOSION PARTICLES
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(particleCount * 3), 3]}
            />
          </bufferGeometry>
          <pointsMaterial color={specs.color} size={0.3} transparent opacity={1 - explodeTime / 25} />
        </points>
      ) : (
        // ACTIVE CRYSTAL SHARD
        <>
          <Html
            distanceFactor={15}
            position={[0, 1.1, 0]}
            center
            className="select-none"
          >
            <div 
              onClick={(e) => { e.stopPropagation(); setTargetedThreat(threatData); }}
              className={`pointer-events-auto cursor-pointer whitespace-nowrap px-3 py-1.5 text-[10px] font-extrabold rounded-2xl border-2 border-slate-800 transition-all duration-300 shadow-[2px_2px_0px_rgba(30,41,59,1)] ${specs.labelColor} ${
                isTargeted ? 'scale-110 border-slate-800 shadow-[2.5px_2.5px_0px_rgba(245,158,11,1)]' : 'opacity-90'
              }`}
            >
              <span className="mr-1">{THREAT_EMOJIS[threatData.type] || '⚠️'}</span>
              {threatData.type}
            </div>
          </Html>

          <group ref={visualGroupRef} onClick={(e) => { e.stopPropagation(); setTargetedThreat(threatData); }}>
            {/* Cute rotating candy gemstone */}
            <mesh position={[0, 0, 0]}>
              <dodecahedronGeometry args={[0.38, 1]} />
              <meshStandardMaterial color={specs.color} emissive={specs.color} emissiveIntensity={isTargeted ? 2.5 : 0.7} flatShading fog={false} />
            </mesh>
            
            {/* Bubbly white rotating halo ring when targeted */}
            {isTargeted && (
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.62, 0.045, 8, 24]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.75} fog={false} />
              </mesh>
            )}
          </group>

          {/* LAZER BEAM HINT: If targeted, show a subtle connecting line to player */}
          {isTargeted && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, -threatData.position[0], -threatData.position[1], -threatData.position[2]]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} linewidth={2} fog={false} />
            </line>
          )}
        </>
      )}
    </group>
  );
}