import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameState } from '../../hooks/useGameState';
import Threat from './Threat';
import FogRing from './FogRing';

function Environment() {
  const { connection, threats, spawnThreat, gameStatus, getStageModifiers } = useGameState();
  const fogDensity = 0.04 + (100 - connection) * 0.004;

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const categories = ['Burnout', 'Academic Pressure', 'Social Rejection', 'Negative Thoughts', 'Isolation', 'Social Comparison', 'Family Conflict'];
    const modifiers = getStageModifiers();

    const spawnLoop = () => {
      const randomType = categories[Math.floor(Math.random() * categories.length)];
      spawnThreat(randomType);
    };

    // Use a dynamic tracking execution system to handle interval timing updates mid-run
    const intervalId = setInterval(spawnLoop, modifiers.spawnRate);

    return () => clearInterval(intervalId);
  }, [spawnThreat, gameStatus, getStageModifiers]);


  return (
    <>
      {/* Keep ambient light steady so the human avatar and shards stay sharp, let the moving clouds handle the blindness */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />

      {/* Soft baseline environmental mist */}
      <fogExp2 attach="fog" color="#111319" density={0.03} />

      <FogRing />

      {/* The Central Player Anchor - Stylized Human Consciousness Silhouette */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 1.0, 8]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.4} flatShading />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} side={2} />
        </mesh>
      </group>

      {threats.map((threat) => (
        <Threat key={threat.id} threatData={threat} />
      ))}
    </>
  );
}

export default function MindscapeStage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#111319] z-10">
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        <Environment />
      </Canvas>
    </div>
  );
}