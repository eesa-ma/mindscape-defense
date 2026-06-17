import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '../../hooks/useGameState';
import * as THREE from 'three';

const Particle = ({ particle, startTime }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const progress = Math.min(elapsed / 1.5, 1);
    const scale = Math.max(0, 1 - progress);
    
    // Move particle physically
    particle.position.addScaledVector(particle.velocity, 0.016);
    particle.velocity.y -= 25 * 0.016; // Gravity
    
    meshRef.current.position.copy(particle.position);
    meshRef.current.scale.set(scale, scale, scale);
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshBasicMaterial color={particle.color} toneMapped={false} />
    </mesh>
  );
};

const Burst = ({ startTime }) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const vx = Math.sin(phi) * Math.cos(theta);
      const vy = Math.abs(Math.cos(phi)) + 0.3; // Upwards bias
      const vz = Math.sin(phi) * Math.sin(theta);
      
      const speed = 15 + Math.random() * 15; // Explosive speed
      
      const colors = ['#fde047', '#f472b6', '#60a5fa', '#a78bfa', '#34d399', '#ffffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      temp.push({ 
        position: new THREE.Vector3(0, 1, 0), 
        velocity: new THREE.Vector3(vx * speed, vy * speed, vz * speed), 
        color 
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {particles.map((p, i) => (
        <Particle key={i} particle={p} startTime={startTime} />
      ))}
    </group>
  );
};

export default function CelebrationSystem() {
  const { score } = useGameState();
  const [bursts, setBursts] = useState([]);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score > prevScore.current) {
      prevScore.current = score;
      
      const id = Date.now();
      setBursts(prev => [...prev, id]);
      
      // Clean up after 2 seconds
      const timeout = setTimeout(() => {
        setBursts(prev => prev.filter(b => b !== id));
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [score]);

  return (
    <group position={[0, 0, 6]}> {/* Spawns exactly at player location */}
      {bursts.map(id => (
        <Burst key={id} startTime={id} />
      ))}
    </group>
  );
}
