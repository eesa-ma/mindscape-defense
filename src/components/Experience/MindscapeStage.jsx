import { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, Sphere, Html, useTexture } from '@react-three/drei';
import { useGameState } from '../../hooks/useGameState';
import Threat from './Threat';
import ScreenSmoke from './ScreenSmoke';
import ManModel from './ManModel';

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



function GuideRings({ position = [0, 0, 0] }) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[position[0], position[1] + 0.02, position[2]]}>
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



function MagicCarpet({ connection }) {
  return (
    <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.15}>
      <group position={[0, -0.05, 0]}>
        {/* Main carpet fabric (flat plane) */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.5, 3.0]} />
          <meshStandardMaterial color="#881337" metalness={0.1} roughness={0.9} side={2} />
        </mesh>
        
        {/* Inner gold border */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.1, 2.6]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.6} roughness={0.3} side={2} />
        </mesh>

        {/* Inner blue center */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.7, 2.2]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.2} roughness={0.8} side={2} />
        </mesh>

        {/* Center Gold Star/Diamond */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[1.0, 1.0]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.6} roughness={0.3} side={2} />
        </mesh>

        {/* Glowing magic aura under the carpet */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.0, 3.5]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.3 * (connection/100)} side={2} fog={false} />
        </mesh>

        {/* Gold tassels at corners */}
        <mesh position={[2.25, -0.1, 1.5]}>
          <cylinderGeometry args={[0.05, 0.02, 0.4, 8]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
        <mesh position={[-2.25, -0.1, 1.5]}>
          <cylinderGeometry args={[0.05, 0.02, 0.4, 8]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
        <mesh position={[2.25, -0.1, -1.5]}>
          <cylinderGeometry args={[0.05, 0.02, 0.4, 8]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
        <mesh position={[-2.25, -0.1, -1.5]}>
          <cylinderGeometry args={[0.05, 0.02, 0.4, 8]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
      </group>
    </Float>
  );
}

function Environment() {
  const { connection, threats, spawnThreat, gameStatus, getStageModifiers, isPortrait, isPaused, playerName } = useGameState();
  
  // 4. Fog Thickens exponentially at low connection
  const fogDensity = 0.005 + Math.pow((100 - connection) / 100, 2.5) * 0.12;
  const factor = (100 - connection) / 100;
  
  // Transition from warm pastel to cool lonely gray fog
  const fogColor = interpolateColor('#ffd3b6', '#cbd5e1', factor);
  
  const ambientIntensity = 0.85 - (factor * 0.4); 
  const ambientColor = interpolateColor('#fff1f2', '#e2e8f0', factor);
  const dirIntensity = 2.2 - (factor * 1.0); 
  const dirColor = interpolateColor('#fffbeb', '#94a3b8', factor);

  useEffect(() => {
    if (gameStatus !== 'playing' || isPortrait || isPaused) return;

    const modifiers = getStageModifiers();

    const spawnLoop = () => {
      spawnThreat();
    };

    const intervalId = setInterval(spawnLoop, modifiers.spawnRate);

    return () => clearInterval(intervalId);
  }, [spawnThreat, gameStatus, getStageModifiers, isPortrait, isPaused]);

  return (
    <>
      {/* Dynamic ambient and directional light */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight position={[5, 12, 5]} intensity={dirIntensity} color={dirColor} />

      {/* Dynamic warm pastel environmental mist */}
      <fogExp2 attach="fog" color={fogColor} density={fogDensity} />

      {/* Volumetric Smoke covering the screen */}
      <ScreenSmoke />

      {/* The Central Player Anchor */}
      <group position={[0, 0, 6]} scale={0.4}>
        <Suspense fallback={
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.2, 0.35, 1.0, 8]} />
            <meshStandardMaterial color="#0ea5e9" wireframe fog={false} />
          </mesh>
        }>
          <group rotation={[0, Math.PI, 0]} scale={1.3}>
            <ManModel position={[0, 0, 0]} />
          </group>
        </Suspense>

        <Html position={[0, 3.2, 0]} center zIndexRange={[10, 0]}>
          <div className="bg-slate-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-black whitespace-nowrap shadow-[2px_2px_0px_rgba(0,0,0,0.5)] border-2 border-indigo-400 select-none">
            {playerName}
          </div>
        </Html>

        {/* Magic Flying Carpet with Texture */}
        <Suspense fallback={null}>
          <MagicCarpet connection={connection} />
        </Suspense>
      </group>

      {/* 5. Dynamic Floating Particles */}
      <Sparkles 
        count={Math.max(10, Math.floor(connection * 2))} 
        opacity={connection / 100} 
        scale={25} 
        size={5} 
        speed={0.4} 
        color="#fde047" 
        position={[0, 2, 6]} 
      />
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