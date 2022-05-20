import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Depth, Fresnel, LayerMaterial } from "lamina";

function Peach({ z }) {
  const ref = useRef();
  const { nodes, materials } = useGLTF("/peach-transformed.glb");
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);
  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(1.5),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state) => {
    ref.current.rotation.set(
      (data.rX += 0.001),
      (data.rY += 0.001),
      (data.rZ += 0.001)
    );
    ref.current.position.set(data.x * width, (data.y += 0.01), z);
    if (data.y > height) {
      data.y = -height;
    }
  });

  return (
    <mesh
      ref={ref}
      scale={3}
      geometry={nodes.Peaach.geometry}
      // material={materials.Skin}
      material={materials.Skin}
    />
  );
}

function Plane() {
  const ref = useRef();
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      {/* <planeGeometry args={[1, 1, 1]} /> */}
      <LayerMaterial
        color={"#fffff"}
        lighting={"physical"}
        transmission={1}
        roughness={0.67}
        thickness={2}
        ior={1.5}
        depthwrite={false}
      >
        <Depth
          near={0.000003}
          far={0.0000001}
          origin={[-0.4920000000000004, 0.4250000000000003, 0]}
          colorA={"#fec5da"}
          colorB={"#00b8fe"}
        />
        <Fresnel
          color={"#fefefe"}
          bias={-0.3430000000000002}
          intensity={3.8999999999999946}
          power={3.3699999999999903}
          factor={1.119999999999999}
          mode={"screen"}
        />
      </LayerMaterial>
    </mesh>
  );
}

export default function App({ count = 100, depth = 80 }) {
  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }}>
      <color attach="background" args={["#efd4c0"]} />
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} intensity={2} />
      <Suspense fallback={null}>
        {Array.from({ length: count }, (_, i) => (
          <Peach key={i} z={-(i / count) * depth - 5} />
        ))}
        <Plane position={[0, 0, 0]} />
        <Environment preset="sunset" />
        <EffectComposer>
          <DepthOfField
            target={[0, 0, 0]}
            focalLength={0.25}
            bokehScale={5}
            height={700}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
