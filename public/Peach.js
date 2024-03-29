/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/peach-transformed.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Peaach.geometry} material={materials.Skin} position={[0.04, 0.12, -0.04]} rotation={[-0.41, -0.04, -1.29]} />
    </group>
  )
}

useGLTF.preload('/peach-transformed.glb')
