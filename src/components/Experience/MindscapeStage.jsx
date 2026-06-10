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

function GuideRings() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      {/* Outer boundary indicator */}
      <mesh>
        <ringGeometry args={[9.5, 9.6, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.15} side={2} fog={false} />
      </mesh>
      {/* Middle indicator */}
      <mesh>
        <ringGeometry args={[6.5, 6.6, 64]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.2} side={2} fog={false} />
      </mesh>
      {/* Warning/Target zone indicator */}
      <mesh>
        <ringGeometry args={[3.5, 3.6, 64]} />
        <meshBasicMaterial color="#fda4af" transparent opacity={0.25} side={2} fog={false} />
      </mesh>
    </group>
  );
}

function FloraItem({ x, z, scale, type, color, phase }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(time * 1.5 + phase) * 0.08;
      meshRef.current.rotation.x = Math.cos(time * 1.2 + phase) * 0.08;
    }
  });

  if (type === 'flower') {
    return (
      <group ref={meshRef} position={[x, 0, z]} scale={scale}>
        {/* Stem */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
          <meshStandardMaterial color="#86efac" />
        </mesh>
        {/* Flower Head */}
        <group position={[0, 0.3, 0]}>
          {/* Center */}
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#fef08a" roughness={0.6} />
          </mesh>
          {/* Petals */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * Math.PI * 2) / 5;
            const px = Math.cos(angle) * 0.11;
            const py = Math.sin(angle) * 0.11;
            return (
              <mesh key={i} position={[px, py, 0]}>
                <sphereGeometry args={[0.06, 6, 6]} />
                <meshStandardMaterial color={color} roughness={0.5} />
              </mesh>
            );
          })}
        </group>
      </group>
    );
  }

  // Grass patch
  return (
    <group ref={meshRef} position={[x, 0, z]} scale={scale}>
      <mesh position={[-0.04, 0.12, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.005, 0.015, 0.25, 4]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.015, 0.3, 4]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[0.04, 0.12, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.005, 0.015, 0.22, 4]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
    </group>
  );
}

function DecorativeFlora() {
  const floraItems = useMemo(() => {
    const items = [];
    const flowerColors = ['#f472b6', '#f43f5e', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24'];
    for (let i = 0; i < 35; i++) {
      const r = 2.2 + Math.random() * 11.3;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const scale = 0.5 + Math.random() * 0.7;
      const type = Math.random() > 0.4 ? 'flower' : 'grass';
      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      items.push({ id: i, x, z, scale, type, color, phase: Math.random() * Math.PI * 2 });
    }
    return items;
  }, []);

  return (
    <group>
      {floraItems.map((item) => (
        <FloraItem key={item.id} {...item} />
      ))}
    </group>
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
      <GuideRings />
      <DecorativeFlora />

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