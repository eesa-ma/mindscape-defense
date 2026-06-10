// src/components/Experience/FogRing.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '../../hooks/useGameState';

export default function FogRing() {
  const groupRef = useRef();
  const { connection } = useGameState();

  // Generate 12 large, overlapping cloud clusters in a wide perimeter ring
  const cloudCount = 12;
  const clouds = useMemo(() => {
    const data = [];
    for (let i = 0; i < cloudCount; i++) {
      const angle = (i / cloudCount) * Math.PI * 2;
      data.push({
        angle,
        scale: [3 + Math.random() * 2, 2 + Math.random() * 1.5, 3 + Math.random() * 2],
        rotationSpeed: 0.002 + Math.random() * 0.003,
        phase: Math.random() * 100
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Calculate how far the cloud banks should encroach toward the center player
    // Max distance is 15 (safe outer rim), min distance is 5 (closing in on the human)
    const compressionFactor = (100 - connection) / 100; 
    const currentRadius = 15 - (compressionFactor * 8.5);

    // Animate and update each cloud cluster's dynamic position matrix
    groupRef.current.children.forEach((child, i) => {
      const c = clouds[i];
      const time = state.clock.getElapsedTime();
      
      const currentAngle = c.angle + (time * c.rotationSpeed);
      
      child.position.x = Math.cos(currentAngle) * currentRadius;
      child.position.z = Math.sin(currentAngle) * currentRadius;
      
      // Gentle vertical billowing wave movement simulation
      child.position.y = Math.sin(time * 0.5 + c.phase) * 0.25 + 0.5;
      
      child.rotation.y += 0.002;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#1e293b" 
            emissive="#0f172a"
            transparent={true}
            opacity={0.65} 
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}