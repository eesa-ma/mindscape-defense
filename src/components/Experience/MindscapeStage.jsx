import { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGameState } from '../../hooks/useGameState';
import Threat from './Threat';
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
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/* ─────────────────────────────────────────────
   Player aura ring (pulses at feet)
───────────────────────────────────────────── */
function PlayerAura() {
  const auraRef = useRef();
  useFrame((state) => {
    if (auraRef.current) {
      auraRef.current.material.opacity =
        0.35 + Math.sin(state.clock.getElapsedTime() * 2.2) * 0.18;
    }
  });
  return (
    <mesh ref={auraRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.6, 0.76, 32]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} side={2} fog={false} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Player sparkle particles
───────────────────────────────────────────── */
function Sparkles() {
  const pointsRef = useRef();
  const particleCount = 18;
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.5 + Math.random() * 0.75;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos.push(
        radius * Math.sin(phi) * Math.cos(theta),
        0.55 + radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    return new Float32Array(pos);
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.22;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7dd3fc" size={0.09} transparent opacity={0.7} fog={false} />
    </points>
  );
}

/* ─────────────────────────────────────────────
   Storm Clouds  (5 dark drifting cloud masses)
───────────────────────────────────────────── */
function StormClouds() {
  const { connection } = useGameState();
  const groupRefs = useRef([]);

  const cloudConfigs = useMemo(() => [
    { x: -7.0, y: 6.2, z: -1.2, scale: 2.1, driftSpeed: 0.17,  driftAmp: 1.0 },
    { x: -1.5, y: 7.1, z:  0.0, scale: 2.6, driftSpeed: -0.12, driftAmp: 1.2 },
    { x:  4.5, y: 6.5, z: -0.6, scale: 2.0, driftSpeed:  0.21, driftAmp: 0.8 },
    { x:  9.5, y: 6.3, z: -1.0, scale: 1.7, driftSpeed: -0.19, driftAmp: 0.9 },
    { x: -10.5, y: 6.4, z: -0.7, scale: 1.8, driftSpeed: 0.15, driftAmp: 0.9 },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRefs.current.forEach((ref, i) => {
      if (ref) {
        const c = cloudConfigs[i];
        ref.position.x = c.x + Math.sin(t * c.driftSpeed) * c.driftAmp;
      }
    });
  });

  // Clouds are light grey-white; they darken slightly as the storm worsens
  const lightness = 82 - (100 - connection) * 0.22; // 82% (bright white) … 60% (mid-grey)
  const cloudColor  = `hsl(210, 20%, ${lightness}%)`;
  const cloudColor2 = `hsl(210, 18%, ${Math.max(lightness - 8, 50)}%)`;

  return (
    <group>
      {cloudConfigs.map((cfg, i) => (
        <group
          key={i}
          ref={(el) => (groupRefs.current[i] = el)}
          position={[cfg.x, cfg.y, cfg.z]}
          scale={cfg.scale}
        >
          {/* Main cloud body */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.66, 12, 12]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={0.96} fog={false} />
          </mesh>
          {/* Right lobe */}
          <mesh position={[0.58, -0.06, 0]}>
            <sphereGeometry args={[0.50, 12, 12]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={0.95} fog={false} />
          </mesh>
          {/* Left lobe */}
          <mesh position={[-0.58, -0.08, 0]}>
            <sphereGeometry args={[0.48, 12, 12]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={0.95} fog={false} />
          </mesh>
          {/* Upper bumps */}
          <mesh position={[0.28, 0.23, 0]}>
            <sphereGeometry args={[0.40, 10, 10]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={0.90} fog={false} />
          </mesh>
          <mesh position={[-0.28, 0.21, 0]}>
            <sphereGeometry args={[0.37, 10, 10]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={0.90} fog={false} />
          </mesh>
          {/* Dark flat underside */}
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.56, 10, 10]} />
            <meshStandardMaterial color={cloudColor2} transparent opacity={0.88} fog={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────
   3-D Rain particles (points recycled top→bottom)
───────────────────────────────────────────── */
function ThreeDRain() {
  const { connection, isPaused } = useGameState();
  const rainRef = useRef();
  const count = 150;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
      velocities.push(0.07 + Math.random() * 0.08);
    }
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (isPaused || !rainRef.current) return;
    const pos = rainRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= velocities[i];
      if (pos[i * 3 + 1] < -11) {
        pos[i * 3 + 1] = 11;
        pos[i * 3]     = (Math.random() - 0.5) * 24;
      }
    }
    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const rainOpacity = 0.25 + Math.max(0, (100 - connection) / 100) * 0.65;

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3b82f6" size={0.12} transparent opacity={rainOpacity} fog={false} />
    </points>
  );
}

/* ─────────────────────────────────────────────
   Scene root (lights + all 3-D objects)
───────────────────────────────────────────── */
function Environment() {
  const {
    connection, threats, spawnThreat, gameStatus,
    getStageModifiers, isPortrait, isPaused, difficulty,
  } = useGameState();

  // Map each coping key to the threat types it counters
  const THREAT_POOL = {
    Q: ['Burnout', 'Exhaustion', 'Creative Block'],
    W: ['Social Rejection', 'Loneliness', 'Imposter Syndrome'],
    E: ['Academic Pressure', 'Procrastination', 'Overwhelm'],
    R: ['Negative Thoughts', 'Self-Doubt', 'Anxiety'],
    A: ['Isolation', 'Ghosting', 'Detachment'],
    S: ['Social Comparison', 'FOMO', 'Cyberbullying'],
  };
  const DIFFICULTY_KEYS = {
    easy:   ['Q', 'W'],
    medium: ['Q', 'W', 'E', 'R'],
    hard:   ['Q', 'W', 'E', 'R', 'A', 'S'],
  };
  const activeCategories = (DIFFICULTY_KEYS[difficulty] || DIFFICULTY_KEYS.easy)
    .flatMap(k => THREAT_POOL[k]);

  const factor    = (100 - connection) / 100;
  const fogColor  = interpolateColor('#e0f2fe', '#c7d2fe', factor);
  const fogDensity = 0.008 + factor * 0.020;

  useEffect(() => {
    if (gameStatus !== 'playing' || isPortrait || isPaused) return;

    const categories = [
      'Burnout', 'Exhaustion', 'Creative Block',
      'Social Rejection', 'Loneliness', 'Imposter Syndrome',
      'Academic Pressure', 'Procrastination', 'Overwhelm',
      'Negative Thoughts', 'Self-Doubt', 'Anxiety',
      'Isolation', 'Ghosting', 'Detachment',
      'Social Comparison', 'FOMO', 'Cyberbullying',
      'Family Conflict', 'Misunderstandings', 'Peer Pressure',
    ];
    const modifiers = getStageModifiers();

    const spawnLoop = () => {
      spawnThreat(activeCategories[Math.floor(Math.random() * activeCategories.length)]);
    };

    const intervalId = setInterval(spawnLoop, modifiers.spawnRate);
    return () => clearInterval(intervalId);
  }, [spawnThreat, gameStatus, getStageModifiers, isPortrait, isPaused]);

  return (
    <>
      {/* Warm bright ambient */}
      <ambientLight intensity={0.85} color="#fff1f2" />
      {/* Soft sun from upper right */}
      <directionalLight position={[4, 14, 6]} intensity={2.0} color="#fffbeb" />
      {/* Sky-blue fill from below for player */}
      <pointLight position={[0, -3, 5]} intensity={0.9} color="#93c5fd" distance={12} />
      {/* Gentle cloud glow from above */}
      <pointLight position={[0, 8, 1]} intensity={0.5} color="#e0f2fe" distance={14} />

      <fogExp2 attach="fog" color={fogColor} density={fogDensity} />

      <StormClouds />
      <ThreeDRain />

      {/* ── Player — bottom centre ── */}
      <group position={[0, -5, 0]} scale={1.6}>
        <Suspense
          fallback={
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.2, 0.35, 1.0, 8]} />
              <meshStandardMaterial color="#0ea5e9" wireframe fog={false} />
            </mesh>
          }
        >
          <PlayerModel position={[0, 0, 0]} />
        </Suspense>
        <PlayerAura />
        <Sparkles />
      </group>

      {threats.map((threat) => (
        <Threat key={threat.id} threatData={threat} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Canvas shell — front-facing camera
───────────────────────────────────────────── */
export default function MindscapeStage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-transparent z-10">
      <Canvas camera={{ position: [0, 0, 18], fov: 55 }}>
        <Environment />
      </Canvas>
    </div>
  );
}