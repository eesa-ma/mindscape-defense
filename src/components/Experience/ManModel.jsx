import { useRef, useEffect, useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useGameState } from '../../hooks/useGameState'

export default function ManModel(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/Man.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, names } = useAnimations(animations, group)
  const { isCelebrating, isMistake } = useGameState()

  // Disable fog on all materials so the character is never dimmed by scene fog
  useEffect(() => {
    Object.values(materials).forEach(mat => {
      mat.fog = false
    })
  }, [materials])

  useEffect(() => {
    if (!actions || names.length === 0) return;
    
    // Log animation names so we can see what's available if we guessed wrong
    console.log("Available animations:", names);
    
    // Find the right animations based on common names
    const idleAnim = names.find(n => n.toLowerCase().includes('idle')) || names[0];
    const cheerAnim = names.find(n => n.toLowerCase().includes('cheer') || n.toLowerCase().includes('jump') || n.toLowerCase().includes('yeah') || n.toLowerCase().includes('celebrate')) || names[1] || names[0];
    const mistakeAnim = names.find(n => n.toLowerCase().includes('death') || n.toLowerCase().includes('sad') || n.toLowerCase().includes('defeat') || n.toLowerCase().includes('flinch') || n.toLowerCase().includes('hit')) || idleAnim;
    
    // Stop all currently playing actions
    Object.values(actions).forEach(action => action.fadeOut(0.2));
    
    let activeAnim = idleAnim;
    if (isCelebrating) activeAnim = cheerAnim;
    else if (isMistake) activeAnim = mistakeAnim;
    
    if (actions[activeAnim]) {
      actions[activeAnim].reset().fadeIn(0.2).play();
    }
  }, [isCelebrating, isMistake, actions, names]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group name="HumanArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Bone} />
          </group>
          <group name="BaseHuman" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh name="BaseHuman_1" geometry={nodes.BaseHuman_1.geometry} material={materials.Shirt} skeleton={nodes.BaseHuman_1.skeleton} />
            <skinnedMesh name="BaseHuman_2" geometry={nodes.BaseHuman_2.geometry} material={materials.Skin} skeleton={nodes.BaseHuman_2.skeleton} />
            <skinnedMesh name="BaseHuman_3" geometry={nodes.BaseHuman_3.geometry} material={materials.Pants} skeleton={nodes.BaseHuman_3.skeleton} />
            <skinnedMesh name="BaseHuman_4" geometry={nodes.BaseHuman_4.geometry} material={materials.Eyes} skeleton={nodes.BaseHuman_4.skeleton} />
            <skinnedMesh name="BaseHuman_5" geometry={nodes.BaseHuman_5.geometry} material={materials.Socks} skeleton={nodes.BaseHuman_5.skeleton} />
            <skinnedMesh name="BaseHuman_6" geometry={nodes.BaseHuman_6.geometry} material={materials.Hair} skeleton={nodes.BaseHuman_6.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/Man.glb')
