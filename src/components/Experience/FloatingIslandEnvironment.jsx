import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Cloud, Clouds, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export default function FloatingIslandEnvironment({ connection }) {
  const debrisRef = useRef();
  
  // Calculate visual state
  const factor = connection / 100; // 1 = healthy, 0 = isolated
  const healthyColor = new THREE.Color('#ffe4e6'); // Warm peach
  const lonelyColor = new THREE.Color('#64748b'); // Cool gray
  
  // Base island color slowly fades to gray when connection drops
  const islandColor = new THREE.Color('#fdf4ff').lerp(lonelyColor, 1 - factor);
  const cloudColor = new THREE.Color('#fff1f2').lerp(new THREE.Color('#475569'), 1 - factor);

  useFrame((state) => {
    if (debrisRef.current) {
      debrisRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Main Floating Platform */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1} floatingRange={[-0.2, 0.2]}>
        <group position={[0, -1.0, 5]}>
          {/* Top smooth layer */}
          <Cylinder args={[18, 16, 1.5, 64]} position={[0, 0, 0]} receiveShadow>
            <meshStandardMaterial color={islandColor} roughness={0.8} />
          </Cylinder>
          {/* Middle rocky layer */}
          <Cylinder args={[16, 12, 3, 32]} position={[0, -2.25, 0]} receiveShadow>
            <meshStandardMaterial color={islandColor.clone().multiplyScalar(0.9)} roughness={0.9} />
          </Cylinder>
          {/* Bottom tip */}
          <Cylinder args={[12, 0.1, 8, 16]} position={[0, -7.75, 0]}>
            <meshStandardMaterial color={islandColor.clone().multiplyScalar(0.8)} roughness={1} />
          </Cylinder>
        </group>
      </Float>

      {/* Magical Atmosphere / Sparkles */}
      <Sparkles 
        count={200} 
        scale={35} 
        size={6} 
        speed={0.4} 
        opacity={factor * 0.8} 
        color="#fde047" // Gold sparkles
        position={[0, 2, 5]}
      />

      {/* Endless Sea of Clouds Below */}
      <group position={[0, -15, 0]}>
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud segments={40} bounds={[40, 5, 40]} volume={30} color={cloudColor} opacity={0.5} position={[0, 0, 0]} />
          <Cloud seed={1} scale={4} volume={20} color={cloudColor} fade={100} position={[15, -5, -15]} />
          <Cloud seed={2} scale={4} volume={25} color={cloudColor} fade={100} position={[-15, -3, 15]} />
        </Clouds>
      </group>

      {/* Floating Symbolic Debris Orbiting the Island */}
      <group ref={debrisRef} position={[0, 0, 5]}>
        {/* Memory Fragments (Glowing Orbs) */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Sphere args={[0.8, 16, 16]} position={[12, 5, 6]}>
            <meshBasicMaterial color="#f472b6" transparent opacity={factor} />
          </Sphere>
        </Float>
        
        {/* Floating Books/Blocks */}
        <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
          <Box args={[1.5, 2.0, 0.3]} position={[-14, 4, -8]} rotation={[1, 0.5, 0]}>
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.8 * factor} />
          </Box>
        </Float>
        
        {/* Abstract Crystals */}
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
          <Sphere args={[1.2, 4, 2]} position={[8, 8, -12]}>
            <meshStandardMaterial color="#c084fc" wireframe={true} transparent opacity={factor} />
          </Sphere>
        </Float>

        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
          <Cylinder args={[0.6, 0.6, 3, 6]} position={[-9, 6, 10]} rotation={[0.5, 0, 0.5]}>
            <meshStandardMaterial color="#fef08a" transparent opacity={0.9 * factor} />
          </Cylinder>
        </Float>
      </group>

    </group>
  );
}
