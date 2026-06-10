// src/components/Experience/FogRing.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '../../hooks/useGameState';

export default function FogRing() {
  const groupRef = useRef();
  const { connection } = useGameState();

  // Generate 16 dense, overlapping cloud meshes to form a solid perimeter wall
  const cloudCount = 16;
  const clouds = useMemo(() => {
    const data = [];
    for (let i = 0; i < cloudCount; i++) {
      const angle = (i / cloudCount) * Math.PI * 2;
      data.push({
        angle,
        scale: [3.5 + Math.random() * 2, 2.5 + Math.random() * 1.5, 3.5 + Math.random() * 2],
        rotationSpeed: 0.003 + Math.random() * 0.003,
        phase: Math.random() * 100
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // PHYSICAL MOVEMENT LOGIC BASED ON YOUR GAME PLAN:
    // When connection is 100, targetRadius is 16 (pushed far back)
    // When connection drops toward 0, targetRadius drops toward 1.5 (swallowing the center)
    const targetRadius = 1.5 + (connection / 100) * 14.5;

    // Smoothly interpolate (lerp) the cloud positions so they glide organically
    groupRef.current.children.forEach((child, i) => {
      const c = clouds[i];
      const time = state.clock.getElapsedTime();
      
      // Let the clouds slowly swirl around the player
      const currentAngle = c.angle + (time * c.rotationSpeed);
      
      const targetX = Math.cos(currentAngle) * targetRadius;
      const targetZ = Math.sin(currentAngle) * targetRadius;

      // Smooth transition easing (lerp) so the fog slides fluidly when values change
      child.position.x += (targetX - child.position.x) * 0.05;
      child.position.z += (targetZ - child.position.z) * 0.05;
      
      // Billowing vertical wave animation
      child.position.y = Math.sin(time * 0.4 + c.phase) * 0.3 + 0.5;
      child.rotation.y += 0.001;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} scale={c.scale}>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color="#161925" // Dense, heavy dark shadow mist tone
            emissive="#090b11"
            transparent={true}
            opacity={0.75} // High opacity so overlapping clusters block out the screen
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}