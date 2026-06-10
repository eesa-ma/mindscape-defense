import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useGraph, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useGameState } from '../../hooks/useGameState'

export default function PlayerModel(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/player-transformed.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)

  const { score, connection, isPortrait } = useGameState()
  const prevScoreRef = useRef(score)
  const prevConnectionRef = useRef(connection)

  const [reaction, setReaction] = useState(null) // 'success' | 'failure' | null
  const originalEmissive = useRef(null)

  // Cache original material settings and turn off fog
  useEffect(() => {
    if (materials && materials.Ch03_Body) {
      materials.Ch03_Body.fog = false
      if (originalEmissive.current === null) {
        originalEmissive.current = materials.Ch03_Body.emissive.getHex()
      }
    }
  }, [materials])

  // Log runtime node keys for diagnosing bone names
  useEffect(() => {
    if (nodes) {
      console.log('Runtime Arm bone keys:', Object.keys(nodes).filter(k => k.toLowerCase().includes('arm')));
    }
  }, [nodes])

  // Track success (score increase) -> "YAAAY" hands up celebration
  useEffect(() => {
    if (score > prevScoreRef.current) {
      setReaction('success')

      const timer = setTimeout(() => {
        setReaction(null)
      }, 2000)

      return () => clearTimeout(timer)
    }
    prevScoreRef.current = score
  }, [score])

  // Track failure (connection decrease) -> Shudder and flash red
  useEffect(() => {
    if (connection < prevConnectionRef.current) {
      setReaction('failure')

      const timer = setTimeout(() => {
        setReaction(null)
      }, 800)

      return () => clearTimeout(timer)
    }
    prevConnectionRef.current = connection
  }, [connection])

  // Frame loop for dynamic, responsive movements
  useFrame((state) => {
    if (isPortrait) return
    if (!group.current) return

    let targetLeftArmZ = 1.35
    let targetLeftArmY = 0
    let targetRightArmZ = -1.35
    let targetRightArmY = 0
    let targetLeftForeArmX = 0
    let targetRightForeArmX = 0
    let targetHeadX = 0
    let targetSpine2X = 0
    let targetYRotation = 0
    let targetXOffset = 0
    let targetZOffset = 0
    let targetYOffset = 0

    if (reaction === 'success') {
      // Rhythmic fist-pumping celebration (arms pump up/down, elbows flex)
      const time = state.clock.getElapsedTime()
      const pump = Math.sin(time * 16) * 0.18

      targetLeftArmZ = 0.9 + pump
      targetLeftArmY = 0.5 + Math.cos(time * 16) * 0.08
      targetRightArmZ = -0.9 - pump
      targetRightArmY = -0.5 - Math.cos(time * 16) * 0.08

      targetLeftForeArmX = 1.6 + Math.sin(time * 16) * 0.2
      targetRightForeArmX = 1.6 + Math.sin(time * 16) * 0.2

      // Head tilts back slightly looking up in triumph
      targetHeadX = -0.22

      // Spine2 (chest) arches forward slightly
      targetSpine2X = 0.12

      // Happy bouncing up and down in sync with the pump
      targetYOffset = Math.abs(Math.sin(time * 12)) * 0.3

      // Slight body sway
      targetYRotation = Math.sin(time * 12) * 0.12
    } else if (reaction === 'failure') {
      // Shuddering impact reaction (arms hang down)
      const elapsed = state.clock.getElapsedTime() * 70
      targetXOffset = Math.sin(elapsed) * 0.12
      targetZOffset = Math.cos(elapsed) * 0.12

      // Flash body color warning red
      if (materials && materials.Ch03_Body) {
        materials.Ch03_Body.emissive.set('#ef4444')
      }
    } else {
      // Baseline: Arms hang down, normal position, restore body color
      targetLeftArmZ = 1.35
      targetLeftArmY = 0
      targetRightArmZ = -1.35
      targetRightArmY = 0
      targetLeftForeArmX = 0
      targetRightForeArmX = 0
      targetHeadX = 0
      targetSpine2X = 0
      targetYRotation = 0
      targetXOffset = 0
      targetZOffset = 0
      targetYOffset = 0

      if (materials && materials.Ch03_Body && originalEmissive.current !== null) {
        materials.Ch03_Body.emissive.setHex(originalEmissive.current)
      }
    }

    // Identify bones securely (checking both sanitized and raw string keys)
    const leftArm = nodes.mixamorigLeftArm || nodes['mixamorig:LeftArm']
    const rightArm = nodes.mixamorigRightArm || nodes['mixamorig:RightArm']
    const leftForeArm = nodes.mixamorigLeftForeArm || nodes['mixamorig:LeftForeArm']
    const rightForeArm = nodes.mixamorigRightForeArm || nodes['mixamorig:RightForeArm']
    const head = nodes.mixamorigHead || nodes['mixamorig:Head']
    const spine2 = nodes.mixamorigSpine2 || nodes['mixamorig:Spine2']

    // Smooth transition interpolation (lerping)
    if (leftArm) {
      leftArm.rotation.z += (targetLeftArmZ - leftArm.rotation.z) * 0.25
      leftArm.rotation.y += (targetLeftArmY - leftArm.rotation.y) * 0.25
    }
    if (rightArm) {
      rightArm.rotation.z += (targetRightArmZ - rightArm.rotation.z) * 0.25
      rightArm.rotation.y += (targetRightArmY - rightArm.rotation.y) * 0.25
    }
    if (leftForeArm) {
      leftForeArm.rotation.x += (targetLeftForeArmX - leftForeArm.rotation.x) * 0.25
    }
    if (rightForeArm) {
      rightForeArm.rotation.x += (targetRightForeArmX - rightForeArm.rotation.x) * 0.25
    }
    if (head) {
      head.rotation.x += (targetHeadX - head.rotation.x) * 0.2
    }
    if (spine2) {
      spine2.rotation.x += (targetSpine2X - spine2.rotation.x) * 0.2
    }

    group.current.rotation.y += (targetYRotation - group.current.rotation.y) * 0.2
    group.current.position.x += (targetXOffset - group.current.position.x) * 0.3
    group.current.position.z += (targetZOffset - group.current.position.z) * 0.3
    group.current.position.y += (targetYOffset - group.current.position.y) * 0.3
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Character" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes['mixamorig:Hips'] || nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          name="Ch03"
          geometry={nodes.Ch03.geometry}
          material={materials.Ch03_Body}
          skeleton={nodes.Ch03.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/player-transformed.glb')
