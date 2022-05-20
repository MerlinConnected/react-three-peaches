import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Depth, Fresnel, LayerMaterial } from "lamina";
import { useControls } from "leva";

function Peach({ z }) {
  const ref = useRef();
  const { nodes } = useGLTF("/peach-transformed.glb");
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
      material={nodes.Peaach.material}
    />
  );
}

function Sphere() {
  const { transmission, roughness, thickness, ior } = useControls({
    transmission: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
    },
    roughness: {
      value: 0.2,
      min: 0,
      max: 5,
      step: 0.1,
    },
    thickness: {
      value: 2,
      min: 0,
      max: 10,
      step: 0.1,
    },
    ior: {
      value: 1.1,
      min: 1,
      max: 10,
      step: 0.1,
    },
  });
  const ref = useRef();
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <LayerMaterial
        color={"#efd4c0"}
        lighting={"physical"}
        transmission={transmission}
        roughness={roughness}
        thickness={thickness}
        ior={ior}
        depthwrite={false}
      >
        <Depth
          near={0.3}
          far={0.1}
          origin={[-0.492, 0.425, 0]}
          colorA={"#fec5da"}
          colorB={"#00b8fe"}
        />
        <Fresnel
          color={"#efd4c0"}
          bias={-0.34}
          intensity={3.9}
          power={3.37}
          factor={2}
          mode={"screen"}
        />
      </LayerMaterial>
    </mesh>
  );
}

export default function App({ count = 100, depth = 80 }) {
  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }}>
      <color attach="background" args={["#fffff"]} />
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} intensity={2} />
      <Suspense fallback={null}>
        {Array.from({ length: count }, (_, i) => (
          <Peach key={i} z={-(i / count) * depth - 5} />
        ))}
        <Sphere position={[0, 0, 0]} />
        <Environment preset="dawn" />
        <EffectComposer>
          <DepthOfField
            target={[0, 0, 0]}
            focalLength={0.25}
            bokehScale={5}
            height={700}
          />
        </EffectComposer>
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}
