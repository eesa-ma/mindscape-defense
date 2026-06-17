import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameState } from '../../hooks/useGameState';

export default function Threat({ threatData }) {
  const meshRef = useRef();
  const visualGroupRef = useRef();
  const particlesRef = useRef();
  // Stable base X so sway oscillates around the spawn X
  const baseX = useRef(threatData.position[0]);

  const { handleThreatCollision, targetedThreat, setTargetedThreat, isPortrait, isPaused } = useGameState();
  const isTargeted = targetedThreat?.id === threatData.id;

  const [isDestroyed, setIsDestroyed] = useState(false);
  const [explodeTime, setExplodeTime] = useState(0);

  const particleCount = 30;
  const pVelocities = React.useMemo(() => {
    const v = [];
    for (let i = 0; i < particleCount; i++) {
      v.push([
        (Math.random() - 0.5) * 0.22,
        (Math.random() - 0.5) * 0.22,
        (Math.random() - 0.5) * 0.22,
      ]);
    }
    return v;
  }, []);

  useFrame((state) => {
    if (isPortrait || isPaused) return;

    // Explosion particle animation
    if (isDestroyed) {
      setExplodeTime((prev) => prev + 1);
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3]     += pVelocities[i][0];
          positions[i * 3 + 1] += pVelocities[i][1];
          positions[i * 3 + 2] += pVelocities[i][2];
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
      return;
    }

    if (!meshRef.current) return;

    // ── Vertical fall ──
    meshRef.current.position.y -= threatData.speed * 1.2;

    // ── Gentle X sway (like wind-driven rain) ──
    meshRef.current.position.x =
      baseX.current +
      Math.sin(state.clock.getElapsedTime() * 1.5 + threatData.speed * 100) * 0.38;

    // ── Spin the gem ──
    if (visualGroupRef.current) {
      visualGroupRef.current.rotation.y += 0.028;
      visualGroupRef.current.rotation.z += 0.009;
    }

    // ── Collision: threat reached player level at bottom ──
    if (meshRef.current.position.y < -3.5) {
      handleThreatCollision(threatData.id);
    }
  });

  // Unused effect kept for structural parity
  React.useEffect(() => {
    if (!isDestroyed && targetedThreat?.id !== threatData.id && meshRef.current === undefined) {}
  }, [targetedThreat, threatData.id, isDestroyed]);

  // Color spec per threat category (dark-storm palette)
  const specs = (() => {
    switch (threatData.type) {
      case 'Burnout': case 'Exhaustion': case 'Creative Block':
        return { color: '#f59e0b', labelColor: 'text-amber-900 border-amber-500 bg-amber-100/95' };
      case 'Academic Pressure': case 'Procrastination': case 'Overwhelm':
        return { color: '#3b82f6', labelColor: 'text-blue-900 border-blue-500 bg-blue-100/95' };
      case 'Social Rejection': case 'Loneliness': case 'Imposter Syndrome':
        return { color: '#a855f7', labelColor: 'text-purple-900 border-purple-500 bg-purple-100/95' };
      case 'Negative Thoughts': case 'Self-Doubt': case 'Anxiety':
        return { color: '#ef4444', labelColor: 'text-rose-900 border-rose-500 bg-rose-100/95' };
      case 'Isolation': case 'Ghosting': case 'Detachment':
        return { color: '#6366f1', labelColor: 'text-indigo-900 border-indigo-500 bg-indigo-100/95' };
      case 'Social Comparison': case 'FOMO': case 'Cyberbullying':
        return { color: '#14b8a6', labelColor: 'text-teal-900 border-teal-500 bg-teal-100/95' };
      case 'Family Conflict': case 'Misunderstandings': case 'Peer Pressure':
        return { color: '#ec4899', labelColor: 'text-pink-900 border-pink-500 bg-pink-100/95' };
      default:
        return { color: '#64748b', labelColor: 'text-slate-900 border-slate-400 bg-slate-100/95' };
    }
  })();

  const THREAT_EMOJIS = {
    'Burnout': '🤯', 'Exhaustion': '😫', 'Creative Block': '🎨❌',
    'Social Rejection': '🥺', 'Loneliness': '🥀', 'Imposter Syndrome': '🎭',
    'Academic Pressure': '📚', 'Procrastination': '⏳', 'Overwhelm': '🌀',
    'Negative Thoughts': '🌩️', 'Self-Doubt': '😰', 'Anxiety': '💭',
    'Isolation': '🚪', 'Ghosting': '🔇', 'Detachment': '❄️',
    'Social Comparison': '📱', 'FOMO': '👀', 'Cyberbullying': '💔',
    'Family Conflict': '💥', 'Misunderstandings': '🗣️❌', 'Peer Pressure': '👥',
  };

  const { threats } = useGameState();
  const stillExists = threats.some((t) => t.id === threatData.id);

  if (!stillExists && !isDestroyed) {
    setIsDestroyed(true);
  }

  if (isDestroyed && explodeTime > 25) {
    return null;
  }

  return (
    <group ref={meshRef} position={threatData.position}>
      {isDestroyed ? (
        // ── Burst particles ──
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(particleCount * 3), 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color={specs.color}
            size={0.28}
            transparent
            opacity={1 - explodeTime / 25}
          />
        </points>
      ) : (
        <>
          {/* ── Threat label (floats above gem) ── */}
          <Html distanceFactor={10} position={[0, 1.15, 0]} center className="select-none">
            <div
              onClick={(e) => { e.stopPropagation(); setTargetedThreat(threatData); }}
              className={`pointer-events-auto cursor-pointer whitespace-nowrap px-4 py-2.5 text-lg font-extrabold rounded-2xl border-[3px] transition-all duration-300 backdrop-blur-sm ${specs.labelColor} ${
                isTargeted
                  ? 'scale-110 border-yellow-500 shadow-[0_0_16px_rgba(234,179,8,0.6)]'
                  : 'shadow-[2px_3px_0px_rgba(30,41,59,0.35)] opacity-95'
              }`}
            >
              <span className="mr-1.5 text-base">{THREAT_EMOJIS[threatData.type] || '⚠️'}</span>
              {threatData.type}
            </div>
          </Html>

          {/* ── Storm raindrop gem ── */}
          <group
            ref={visualGroupRef}
            onClick={(e) => { e.stopPropagation(); setTargetedThreat(threatData); }}
          >
            {/* Elongated gem body */}
            <mesh position={[0, 0, 0]} scale={[0.82, 1.28, 0.82]}>
              <dodecahedronGeometry args={[0.38, 1]} />
              <meshStandardMaterial
                color={specs.color}
                emissive={specs.color}
                emissiveIntensity={isTargeted ? 2.8 : 1.1}
                flatShading
                fog={false}
                transparent
                opacity={0.92}
              />
            </mesh>

            {/* Teardrop tail pointing downward */}
            <mesh position={[0, -0.52, 0]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.11, 0.38, 6]} />
              <meshStandardMaterial
                color={specs.color}
                emissive={specs.color}
                emissiveIntensity={isTargeted ? 1.6 : 0.55}
                transparent
                opacity={0.72}
                fog={false}
              />
            </mesh>

            {/* Gold targeting ring when selected */}
            {isTargeted && (
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.72, 0.052, 8, 24]} />
                <meshBasicMaterial color="#facc15" transparent opacity={0.88} fog={false} />
              </mesh>
            )}
          </group>

          {/* Thin beam hinting at the targeted threat */}
          {isTargeted && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      0, 0, 0,
                      -threatData.position[0],
                      -threatData.position[1],
                      -threatData.position[2],
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#facc15" transparent opacity={0.22} linewidth={2} fog={false} />
            </line>
          )}
        </>
      )}
    </group>
  );
}