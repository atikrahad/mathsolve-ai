'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Advanced Function Surface
function AdvancedFunctionSurface() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(6, 6, 80, 80);
    const vertices = geom.attributes.position.array as Float32Array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      // Advanced mathematical function: z = sin(sqrt(x²+y²)) * cos(x) * sin(y)
      const r = Math.sqrt(x * x + y * y);
      vertices[i + 2] = Math.sin(r) * Math.cos(x) * Math.sin(y) * 1.5;
    }

    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      (meshRef.current.material as THREE.ShaderMaterial).uniforms = {
        time: { value: state.clock.elapsedTime },
      };
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#4ECDC4"
          emissive="#2A3B4E"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Mathematical equation display */}
      <Text position={[0, -4, 0]} fontSize={0.4} color="#4ECDC4" anchorX="center" anchorY="middle">
        f(x,y) = sin(√(x²+y²)) × cos(x) × sin(y)
      </Text>
    </group>
  );
}

// Parametric Surface
function ParametricSurface() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(4, 4, 60, 60);
    const vertices = geom.attributes.position.array as Float32Array;

    for (let i = 0; i < vertices.length; i += 3) {
      const u = vertices[i];
      const v = vertices[i + 1];
      // Parametric surface: Klein bottle projection
      vertices[i] = u;
      vertices[i + 1] = v;
      vertices[i + 2] = Math.sin(u) * Math.cos(v) + Math.cos(u) * Math.sin(v) * 0.5;
    }

    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[3, 1, 0]}>
      <meshStandardMaterial
        color="#FF6B6B"
        emissive="#FF6B6B"
        emissiveIntensity={0.1}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// Floating Mathematical Elements
function FloatingElements() {
  const groupRef = useRef<THREE.Group>(null);

  const elements = useMemo(() => {
    const items = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 4;
      items.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle * 0.5) * 2,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
          number,
          number,
          number,
        ],
        scale: 0.3 + Math.random() * 0.3,
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {elements.map((element, index) => (
        <Box
          key={index}
          args={[element.scale, element.scale, element.scale]}
          position={element.position}
          rotation={element.rotation}
        >
          <meshStandardMaterial
            color="#FFE66D"
            emissive="#FFE66D"
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </Box>
      ))}
    </group>
  );
}

// Main Advanced Math 3D Component
export default function AdvancedMath3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 60 }}
        style={{
          background: 'linear-gradient(135deg, #2A3B4E 0%, #1a2332 50%, #0f1419 100%)',
        }}
      >
        <color attach="background" args={['#2A3B4E']} />
        <fog attach="fog" args={['#2A3B4E', 10, 30]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4ECDC4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF6B6B" />
        <spotLight position={[0, 15, 0]} intensity={0.8} color="#FFE66D" />

        {/* 3D Mathematical Objects */}
        <AdvancedFunctionSurface />
        <ParametricSurface />
        <FloatingElements />

        {/* Interactive Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxDistance={20}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}
