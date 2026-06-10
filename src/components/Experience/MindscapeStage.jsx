import { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGameState } from '../../hooks/useGameState';
import Threat from './Threat';
import FogRing from './FogRing';
import PlayerModel from './PlayerModel';

const interpolateColor = (color1, color2, factor) => {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  const rs = r.toString(16).padStart(2, '0');
  const gs = g.toString(16).padStart(2, '0');
  const bs = b.toString(16).padStart(2, '0');

  return `#${rs}${gs}${bs}`;
};

function Sparkles() {
  const pointsRef = useRef();
  const particleCount = 25;
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.5 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      pos.push(
        radius * Math.sin(phi) * Math.cos(theta),
        0.5 + radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    return new Float32Array(pos);
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#fef08a" size={0.12} transparent opacity={0.8} />
    </points>
  );
}

function Environment() {
  const { connection, threats, spawnThreat, gameStatus, getStageModifiers, isPortrait, isPaused } = useGameState();
  const fogDensity = 0.03 + (100 - connection) * 0.003;
  const factor = (100 - connection) / 100;
  const fogColor = interpolateColor('#ffd3b6', '#e0e7ff', factor);

  useEffect(() => {
    if (gameStatus !== 'playing' || isPortrait || isPaused) return;

    const categories = [
      'Burnout', 'Exhaustion', 'Creative Block',
      'Social Rejection', 'Loneliness', 'Imposter Syndrome',
      'Academic Pressure', 'Procrastination', 'Overwhelm',
      'Negative Thoughts', 'Self-Doubt', 'Anxiety',
      'Isolation', 'Ghosting', 'Detachment',
      'Social Comparison', 'FOMO', 'Cyberbullying',
      'Family Conflict', 'Misunderstandings', 'Peer Pressure'
    ];
    const modifiers = getStageModifiers();

    const spawnLoop = () => {
      const randomType = categories[Math.floor(Math.random() * categories.length)];
      spawnThreat(randomType);
    };

    const intervalId = setInterval(spawnLoop, modifiers.spawnRate);

    return () => clearInterval(intervalId);
  }, [spawnThreat, gameStatus, getStageModifiers, isPortrait, isPaused]);

  return (
    <>
      {/* Warm ambient and golden sun directional light */}
      <ambientLight intensity={0.75} color="#fff1f2" />
      <directionalLight position={[5, 12, 5]} intensity={2.2} color="#fffbeb" />

      {/* Dynamic warm pastel environmental mist */}
      <fogExp2 attach="fog" color={fogColor} density={fogDensity} />

      <FogRing />

      {/* The Central Player Anchor - Now a Real Human Avatar */}
      <group position={[0, 0, 0]} scale={1.6}>
        <Suspense fallback={
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.2, 0.35, 1.0, 8]} />
            <meshStandardMaterial color="#0ea5e9" wireframe fog={false} />
          </mesh>
        }>
          <PlayerModel position={[0, 0, 0]} />
        </Suspense>

        {/* Keep the awesome aura ring at the feet! */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} side={2} fog={false} />
        </mesh>
        <Sparkles />
      </group>

      {threats.map((threat) => (
        <Threat key={threat.id} threatData={threat} />
      ))}
    </>
  );
}

export default function MindscapeStage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-transparent z-10">
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        <Environment />
      </Canvas>
    </div>
  );
}