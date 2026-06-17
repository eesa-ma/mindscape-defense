import React, { useRef, useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export default function ManModel(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/Man.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)

  // Disable fog on all materials so the character is never dimmed by scene fog
  useEffect(() => {
    Object.values(materials).forEach(mat => {
      mat.fog = false
    })
  }, [materials])

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
