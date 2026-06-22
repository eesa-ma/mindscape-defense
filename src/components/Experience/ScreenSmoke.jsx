import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clouds, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../hooks/useGameState';

export default function ScreenSmoke() {
  const { connection } = useGameState();
  
  const leftRef = useRef();
  const rightRef = useRef();

  // Keep opacity high so they are thick and dark when they enter
  const opacity = 0.5 + ((100 - connection) / 100) * 0.5;
  
  useFrame((state, delta) => {
    if (leftRef.current && rightRef.current) {
      const factor = (100 - connection) / 100; // 0 = healthy, 1 = isolated
      
      // At 100% (factor=0): pushed completely off screen to the sides (x = 40)
      // At 0% (factor=1): pulled into the center (x = 3)
      const currentX = 40 - (factor * 37); 
      
      // They rise slightly as they come in
      const currentY = -2 + (factor * 4); 
      
      // They move slightly forward as they come in
      const currentZ = 4 + (factor * 4);

      const speed = 2 * delta;

      // Left Pillar
      leftRef.current.position.x += (-currentX - leftRef.current.position.x) * speed;
      leftRef.current.position.y += (currentY - leftRef.current.position.y) * speed;
      leftRef.current.position.z += (currentZ - leftRef.current.position.z) * speed;

      // Right Pillar
      rightRef.current.position.x += (currentX - rightRef.current.position.x) * speed;
      rightRef.current.position.y += (currentY - rightRef.current.position.y) * speed;
      rightRef.current.position.z += (currentZ - rightRef.current.position.z) * speed;
    }
  });

  // A tall, dense pillar of smoke. 
  // Notice bounds X is narrow (10) so it doesn't spill into the center when pushed to the sides.
  const SmokePillar = ({ seed }) => (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud seed={seed} segments={40} bounds={[10, 25, 8]} volume={30} color="#e2e8f0" opacity={opacity * 1.5} position={[0, 0, 0]} speed={0.5} />
      <Cloud seed={seed + 1} segments={40} bounds={[12, 30, 8]} volume={40} color="#cbd5e1" opacity={opacity * 2.0} position={[0, 0, 1]} speed={0.7} />
      <Cloud seed={seed + 2} segments={30} bounds={[14, 35, 10]} volume={50} color="#f8fafc" opacity={opacity * 1.8} position={[0, 0, -1]} speed={0.6} />
    </Clouds>
  );

  return (
    <>
      {/* Start pushed far left */}
      <group ref={leftRef} position={[-22, -2, 4]}>
        <SmokePillar seed={100} />
      </group>
      
      {/* Start pushed far right */}
      <group ref={rightRef} position={[22, -2, 4]}>
        <SmokePillar seed={200} />
      </group>
    </>
  );
}
