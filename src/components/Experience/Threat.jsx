import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameState } from '../../hooks/useGameState';

export default function Threat({ threatData }) {
  const meshRef = useRef();
  const visualGroupRef = useRef();
  const particlesRef = useRef();
  
  const { handleThreatCollision, targetedThreat, setTargetedThreat } = useGameState();
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
      case 'Burnout': return { color: '#f59e0b', labelColor: 'text-amber-400 border-amber-500/30' };
      case 'Academic Pressure': return { color: '#3b82f6', labelColor: 'text-blue-400 border-blue-500/30' };
      case 'Social Rejection': return { color: '#c084fc', labelColor: 'text-purple-400 border-purple-500/30' };
      case 'Negative Thoughts': return { color: '#f43f5e', labelColor: 'text-rose-400 border-rose-500/30' };
      case 'Isolation': return { color: '#6366f1', labelColor: 'text-indigo-400 border-indigo-500/30' };
      case 'Social Comparison': return { color: '#14b8a6', labelColor: 'text-teal-400 border-teal-500/30' };
      case 'Family Conflict': return { color: '#ec4899', labelColor: 'text-pink-400 border-pink-500/30' };
      default: return { color: '#94a3b8', labelColor: 'text-slate-400 border-slate-500/30' };
    }
  })();

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
            position={[0, 1.0, 0]}
            center
            className="pointer-events-none select-none"
          >
            <div className={`whitespace-nowrap px-2.5 py-1 text-[10px] font-black font-mono uppercase tracking-wider rounded-md border bg-slate-950/90 backdrop-blur-sm transition-all duration-300 shadow-xl ${specs.labelColor} ${
              isTargeted ? 'scale-110 ring-2 ring-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'opacity-80'
            }`}>
              {threatData.type}
            </div>
          </Html>

          <group ref={visualGroupRef} onClick={(e) => { e.stopPropagation(); setTargetedThreat(threatData); }}>
            <mesh position={[0, 0.3, 0]}>
              <coneGeometry args={[0.35, 0.7, 5]} />
              <meshStandardMaterial color={specs.color} emissive={specs.color} emissiveIntensity={isTargeted ? 2.0 : 0.4} flatShading />
            </mesh>
            <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.35, 0.7, 5]} />
              <meshStandardMaterial color={specs.color} emissive={specs.color} emissiveIntensity={isTargeted ? 2.0 : 0.4} flatShading />
            </mesh>
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
              <lineBasicMaterial color="#22d3ee" transparent opacity={0.15} linewidth={2} />
            </line>
          )}
        </>
      )}
    </group>
  );
}