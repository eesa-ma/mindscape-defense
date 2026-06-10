import { Canvas } from '@react-three/fiber';
import { useGameState } from '../../hooks/useGameState';

function Environment() {
  const { connection } = useGameState();
  
  // Dynamically calculate fog density based on emotional well-being [cite: 91, 92, 93]
  // Lower connection = thicker, more intense fog [cite: 93]
  const fogDensity = 0.05 + (100 - connection) * 0.002;

  return (
    <>
      <ambientLight intensity={connection * 0.01} /> {/* Brightness ties to connection [cite: 95] */}
      <directionalLight position={[5, 10, 5]} intensity={1} />
      
      {/* Three.js FogExp2 element built directly into the scene */}
      <fogExp2 attach="fog" color="#111319" density={fogDensity} />
      
      {/* The Player Anchor in the center [cite: 20] */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" intensity={2} />
      </mesh>
    </>
  );
}

export default function MindscapeStage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#111319] z-10">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Environment />
        {/* ThreatManager component containing moving obstacles goes here */}
      </Canvas>
    </div>
  );
}