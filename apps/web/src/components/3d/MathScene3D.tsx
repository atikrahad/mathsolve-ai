'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Torus, Plane, Stars } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

// Mathematical Equation 3D Component
function MathEquation3D({
  position,
  text,
  color = '#4ECDC4',
}: {
  position: [number, number, number];
  text: string;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      <Text ref={meshRef} fontSize={0.8} color={color} anchorX="center" anchorY="middle">
        {text}
      </Text>
      <Sphere args={[0.1, 16, 16]} position={[0, 0, -0.5]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </Sphere>
    </group>
  );
}

// 3D Mathematical Cube with Equations
function MathCube3D({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const equations = ['∫ f(x)dx', '∂f/∂x', 'Σ n=1', '∇ × F', 'e^(iπ)', 'lim x→∞'];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[2, 2, 2]}>
        <meshStandardMaterial
          color="#2A3B4E"
          emissive="#4ECDC4"
          emissiveIntensity={0.1}
          transparent
          opacity={0.8}
        />
      </Box>
      {equations.map((eq, index) => (
        <Text
          key={index}
          position={[
            index === 0 ? 1.1 : index === 1 ? -1.1 : 0,
            index === 2 ? 1.1 : index === 3 ? -1.1 : 0,
            index === 4 ? 1.1 : index === 5 ? -1.1 : 0,
          ]}
          fontSize={0.3}
          color="#4ECDC4"
          anchorX="center"
          anchorY="middle"
        >
          {eq}
        </Text>
      ))}
    </group>
  );
}

// 3D Mathematical Sphere with Grid
function MathSphere3D({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
    if (gridRef.current) {
      gridRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#2A3B4E"
          emissive="#FF6B6B"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
          wireframe
        />
      </Sphere>
      <group ref={gridRef}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Torus key={i} args={[1.6, 0.02, 8, 32]} rotation={[0, 0, (i / 10) * Math.PI]}>
            <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4" emissiveIntensity={0.3} />
          </Torus>
        ))}
      </group>
      <Text position={[0, 0, 0]} fontSize={0.4} color="#FFE66D" anchorX="center" anchorY="middle">
        x²+y²+z²=r²
      </Text>
    </group>
  );
}

// 3D Function Graph Visualization
function FunctionGraph3D({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(4, 4, 50, 50);
    const vertices = geom.attributes.position.array as Float32Array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      vertices[i + 2] = Math.sin(x) * Math.cos(y) * 0.5;
    }

    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#4ECDC4"
          emissive="#2A3B4E"
          emissiveIntensity={0.1}
          wireframe
        />
      </mesh>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color="#FFE66D"
        anchorX="center"
        anchorY="middle"
      >
        f(x,y) = sin(x)cos(y)
      </Text>
    </group>
  );
}

// Floating Mathematical Particles
function MathParticles() {
  const count = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = new THREE.Object3D();
    const positions = [];

    for (let i = 0; i < count; i++) {
      temp.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30
      );
      temp.updateMatrix();
      positions.push(temp.matrix.clone());
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((matrix, i) => {
        const temp = new THREE.Object3D();
        temp.position.setFromMatrixPosition(matrix);
        temp.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
        temp.rotation.x = state.clock.elapsedTime * 0.5;
        temp.rotation.y = state.clock.elapsedTime * 0.3;
        temp.updateMatrix();
        meshRef.current!.setMatrixAt(i, temp.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4" emissiveIntensity={0.2} />
    </instancedMesh>
  );
}

// Interactive Mathematical Object
function InteractiveMathObject({ position }: { position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[1, 1, 1]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#FFE66D' : '#FF6B6B'}
          emissive={hovered ? '#FFE66D' : '#FF6B6B'}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          transparent
          opacity={0.8}
        />
      </Box>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.25}
        color="#95E1D3"
        anchorX="center"
        anchorY="middle"
      >
        Interactive Math
      </Text>
    </group>
  );
}

// Main 3D Scene Component
export default function MathScene3D() {
  return (
    <div className="w-full h-96">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 75 }}
        style={{
          background: 'linear-gradient(135deg, #2A3B4E 0%, #1a2332 50%, #0f1419 100%)',
        }}
      >
        <color attach="background" args={['#2A3B4E']} />
        <fog attach="fog" args={['#2A3B4E', 15, 40]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#4ECDC4" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#FF6B6B" />
        <spotLight position={[0, 20, 0]} intensity={1} color="#FFE66D" />

        {/* Environment */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        {/* 3D Mathematical Objects */}
        <MathCube3D position={[-5, 1, 0]} />
        <MathSphere3D position={[5, -1, 0]} />
        <FunctionGraph3D position={[0, -3, -2]} />
        <InteractiveMathObject position={[0, 2, 0]} />

        {/* Floating Equations */}
        <MathEquation3D position={[-7, 0, 2]} text="∫₀^∞ e^(-x²)dx = √π/2" color="#4ECDC4" />
        <MathEquation3D position={[7, 3, -1]} text="∇·E = ρ/ε₀" color="#FF6B6B" />
        <MathEquation3D position={[0, 5, 1]} text="e^(iπ) + 1 = 0" color="#FFE66D" />
        <MathEquation3D position={[-3, -2, 3]} text="∂²u/∂t² = c²∇²u" color="#95E1D3" />

        {/* Floating Particles */}
        <MathParticles />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxDistance={20}
          minDistance={8}
        />
      </Canvas>
    </div>
  );
}

// 3D Information Panel Component
export function Info3DPanel({
  position,
  title,
  content,
  color = '#4ECDC4',
}: {
  position: [number, number, number];
  title: string;
  content: string[];
  color?: string;
}) {
  return (
    <group position={position}>
      <Plane args={[4, 3]} position={[0, 0, -0.1]}>
        <meshStandardMaterial
          color="#2A3B4E"
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Plane>
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
      >
        {title}
      </Text>
      {content.map((text, index) => (
        <Text
          key={index}
          position={[0, 0.5 - index * 0.3, 0]}
          fontSize={0.15}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
        >
          • {text}
        </Text>
      ))}
    </group>
  );
}
