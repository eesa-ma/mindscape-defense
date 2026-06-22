import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import { useGameState } from '../../hooks/useGameState';

export default function Threat({ threatData }) {
  const meshRef = useRef();
  const visualGroupRef = useRef();
  const particlesRef = useRef();

  const { handleThreatCollision, targetedThreat, setTargetedThreat, isPortrait, isPaused, gameStatus } = useGameState();
  const isTargeted = targetedThreat?.id === threatData.id;

  // New states for the destruction animation
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [explodeTime, setExplodeTime] = useState(0);

  // Generate random velocities for 30 explosion particles
  const particleCount = 30;
  const pVelocities = useMemo(() => {
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
    if (isPortrait || isPaused || gameStatus !== 'playing') return;

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

    // 1. Move closer to player at [0, 0, 5]
    const targetZ = 5;
    meshRef.current.position.x -= Math.sign(meshRef.current.position.x) * threatData.speed;
    meshRef.current.position.z -= Math.sign(meshRef.current.position.z - targetZ) * threatData.speed;

    // 2. Y-axis organic bobbing wave
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2 + threatData.speed * 100) * 0.2;

    // 3. Spin crystal shard geometry
    if (visualGroupRef.current) {
      visualGroupRef.current.rotation.y += 0.02;
    }

    // 4. Collision threshold check
    const distance = Math.sqrt(
      meshRef.current.position.x ** 2 + (meshRef.current.position.z - targetZ) ** 2
    );

    if (distance < 1.3) {
      handleThreatCollision(threatData.id);
    }
  });

  // Intercept the removal to play our animation first
  useEffect(() => {
    // If this threat was targeted but is suddenly missing from global state, it means it was successfully countered!
    if (!isDestroyed && targetedThreat?.id !== threatData.id && meshRef.current === undefined) {
      // Small trick: state updates happen instantly, we can listen to parent changes if needed, 
      // but to make it foolproof we will let the executeCopingStrategy trigger a local switch.
    }
  }, [targetedThreat, threatData.id, isDestroyed]);

  // Expose a way for the engine to shatter this crystal smoothly
  // To link this flawlessly, we update the removal sequence to trigger local destruction first
  // To prevent the game from being a simple "color-matching" puzzle,
  // ALL threats share the same neutral, dreamy visual style. 
  // It shouldn't look overly dark or negative, just like a neutral floating thought.
  const specs = {
    color: '#f8fafc', // Very light, frosty slate/white for the crystal
    labelColor: 'text-slate-700 border-slate-300 bg-white/95 backdrop-blur-sm' // Clean, bright UI label
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
            transform
            sprite
            distanceFactor={8}
            position={[0, 1.1, 0]}
            className="select-none"
          >
            <div
              onClick={(e) => { e.stopPropagation(); setTargetedThreat(threatData); }}
              className={`pointer-events-auto cursor-pointer whitespace-nowrap px-4 py-2 text-base sm:text-lg font-black rounded-3xl border-[3px] border-slate-800 transition-all duration-300 shadow-[3px_3px_0px_rgba(30,41,59,1)] ${specs.labelColor} ${isTargeted ? 'scale-110 border-slate-800 shadow-[4px_4px_0px_rgba(245,158,11,1)]' : 'opacity-95'
                }`}
            >
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

            {/* Shadowy loneliness aura */}
            <Sparkles count={20} scale={1.5} size={2} speed={0.4} color="#1e293b" opacity={0.6} />
            <Sparkles count={10} scale={2} size={1} speed={0.2} color="#475569" opacity={0.4} />
          </group>

          {/* LAZER BEAM HINT: If targeted, show a subtle connecting line to player */}
          {isTargeted && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 5, -threatData.position[0], -threatData.position[1], -(threatData.position[2] - 5)]), 3]}
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