'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Stars } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Hero Section 3D
function Hero3D() {
  const titleRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (titleRef.current) {
      titleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (cubeRef.current) {
      cubeRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      cubeRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      cubeRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      {/* Main Title */}
      <group ref={titleRef}>
        <Text
          position={[0, 1.5, 0]}
          fontSize={1.5}
          color="#4ECDC4"
          anchorX="center"
          anchorY="middle"
          maxWidth={12}
        >
          MathSolve AI
        </Text>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.5}
          color="#FFE66D"
          anchorX="center"
          anchorY="middle"
          maxWidth={18}
        >
          Advanced AI-Powered Mathematics Learning Platform
        </Text>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.3}
          color="#95E1D3"
          anchorX="center"
          anchorY="middle"
          maxWidth={25}
        >
          Transform your mathematical understanding with cutting-edge AI technology, interactive 3D
          visualizations, and personalized learning experiences
        </Text>
      </group>

      {/* Floating Mathematical Cube */}
      <Box ref={cubeRef} args={[1, 1, 1]} position={[5, 0, -1]}>
        <meshStandardMaterial
          color="#2A3B4E"
          emissive="#4ECDC4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </Box>

      {/* Surrounding Complex Equations */}
      <Text position={[-6, 2, 2]} fontSize={0.35} color="#FF6B6B">
        ∇²φ + k²φ = 0
      </Text>
      <Text position={[6, 2, 2]} fontSize={0.35} color="#4ECDC4">
        ∮ F⃗·dr⃗ = ∬(∇×F⃗)·n̂dS
      </Text>
      <Text position={[-5, -1, 3]} fontSize={0.35} color="#FFE66D">
        ∂u/∂t = α∇²u
      </Text>
      <Text position={[5, -1, 3]} fontSize={0.35} color="#95E1D3">
        ∫∫∫ ρ(x,y,z) dV
      </Text>
      <Text position={[0, 3, -2]} fontSize={0.35} color="#A8E6CF">
        lim[n→∞] Σ[k=1 to n] f(k/n)/n
      </Text>
    </group>
  );
}

// Enhanced Features Section 3D
function Features3D() {
  const features = [
    {
      title: 'AI-Powered Neural Networks',
      description: [
        'Deep learning algorithms for pattern recognition',
        'Adaptive step-by-step solution generation',
        'Personalized learning path optimization',
        'Real-time error detection and correction',
        'Intelligent difficulty progression matching',
        'Natural language mathematical explanations',
      ],
      position: [-10, 0, 0] as [number, number, number],
      color: '#4ECDC4',
      icon: '🧠',
    },
    {
      title: 'Immersive 3D Visualizations',
      description: [
        'Interactive 3D geometric model rendering',
        'Real-time function surface plotting',
        'Complex mathematical object manipulation',
        'Multi-dimensional vector field displays',
        'Dynamic equation transformation views',
        'Augmented reality mathematical experiences',
      ],
      position: [0, 0, 0] as [number, number, number],
      color: '#FF6B6B',
      icon: '📐',
    },
    {
      title: 'Collaborative Learning Ecosystem',
      description: [
        'Global peer-to-peer problem solving',
        'Expert tutor matching and mentorship',
        'Real-time collaborative whiteboarding',
        'Community-driven solution sharing',
        'Competitive mathematical challenges',
        'Cross-cultural learning experiences',
      ],
      position: [10, 0, 0] as [number, number, number],
      color: '#FFE66D',
      icon: '👥',
    },
  ];

  return (
    <group position={[0, -5, 0]}>
      <Text position={[0, 3, 0]} fontSize={0.8} color="#4ECDC4" anchorX="center" anchorY="middle">
        Revolutionary Features
      </Text>
      {features.map((feature, index) => (
        <FeatureCard3D key={index} {...feature} />
      ))}
    </group>
  );
}

// Enhanced Feature Card 3D
function FeatureCard3D({
  position,
  title,
  description,
  color,
  icon,
}: {
  position: [number, number, number];
  title: string;
  description: string[];
  color: string;
  icon: string;
}) {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.15;
      if (hovered) {
        cardRef.current.scale.setScalar(1.15);
      } else {
        cardRef.current.scale.setScalar(1);
      }
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1;
    }
  });

  return (
    <group
      ref={cardRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Enhanced Card Background */}
      <Box args={[6, 8, 0.5]} position={[0, 0, -0.2]}>
        <meshStandardMaterial
          color="#2A3B4E"
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </Box>

      {/* Icon */}
      <Text position={[0, 3.5, 0]} fontSize={1} color={color} anchorX="center" anchorY="middle">
        {icon}
      </Text>

      {/* Title */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={5.5}
      >
        {title}
      </Text>

      {/* Enhanced Description */}
      {description.map((text, index) => (
        <Text
          key={index}
          position={[0, 1.8 - index * 0.4, 0]}
          fontSize={0.18}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          maxWidth={5.5}
        >
          • {text}
        </Text>
      ))}
    </group>
  );
}

// Enhanced Statistics Section 3D
function Statistics3D() {
  const stats = [
    { number: '500K+', label: 'Students Worldwide', color: '#4ECDC4', detail: 'Active Learners' },
    { number: '2M+', label: 'Problems Solved', color: '#FF6B6B', detail: 'Daily Solutions' },
    { number: '99.2%', label: 'Success Rate', color: '#FFE66D', detail: 'Achievement Score' },
    { number: '50+', label: 'Math Categories', color: '#95E1D3', detail: 'Subject Areas' },
    { number: '24/7', label: 'AI Support', color: '#A8E6CF', detail: 'Always Available' },
  ];

  return (
    <group position={[0, -12, 0]}>
      <Text position={[0, 3, 0]} fontSize={0.8} color="#4ECDC4" anchorX="center" anchorY="middle">
        Platform Impact Statistics
      </Text>

      {stats.map((stat, index) => (
        <StatCard3D
          key={index}
          position={[(-2 + index) * 5, 0, 0]}
          number={stat.number}
          label={stat.label}
          detail={stat.detail}
          color={stat.color}
        />
      ))}
    </group>
  );
}

// Enhanced Stat Card 3D
function StatCard3D({
  position,
  number,
  label,
  detail,
  color,
}: {
  position: [number, number, number];
  number: string;
  label: string;
  detail: string;
  color: string;
}) {
  const cardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      cardRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.8 + position[0]) * 0.1;
    }
  });

  return (
    <group ref={cardRef} position={position}>
      <Cylinder args={[1.5, 1.5, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#2A3B4E"
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Cylinder>

      <Text position={[0, 0.8, 0]} fontSize={0.6} color={color} anchorX="center" anchorY="middle">
        {number}
      </Text>

      <Text
        position={[0, 0, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {label}
      </Text>

      <Text
        position={[0, -0.6, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {detail}
      </Text>
    </group>
  );
}

// Cylinder component (using Box as substitute)
function Cylinder({
  args,
  position,
  children,
}: {
  args: [number, number, number];
  position: [number, number, number];
  children: React.ReactNode;
}) {
  return (
    <Box args={[args[0], args[2], args[0]]} position={position}>
      {children}
    </Box>
  );
}

// Advanced Mathematical Categories 3D
function MathCategories3D() {
  const categories = [
    {
      name: 'Advanced Calculus',
      icon: '∫',
      color: '#4ECDC4',
      problems: 3500,
      difficulty: 'Expert',
    },
    { name: 'Linear Algebra', icon: '⊗', color: '#FF6B6B', problems: 2800, difficulty: 'Advanced' },
    {
      name: 'Differential Equations',
      icon: '∂',
      color: '#FFE66D',
      problems: 2100,
      difficulty: 'Expert',
    },
    { name: 'Complex Analysis', icon: 'ℂ', color: '#95E1D3', problems: 1800, difficulty: 'Master' },
    { name: 'Abstract Algebra', icon: '∈', color: '#A8E6CF', problems: 1500, difficulty: 'Expert' },
    { name: 'Real Analysis', icon: 'ℝ', color: '#FFB3BA', problems: 1200, difficulty: 'Master' },
    { name: 'Number Theory', icon: 'ℤ', color: '#BAFFC9', problems: 1000, difficulty: 'Advanced' },
    { name: 'Topology', icon: '∂', color: '#BAE1FF', problems: 800, difficulty: 'Expert' },
  ];

  return (
    <group position={[0, -18, 0]}>
      <Text position={[0, 4, 0]} fontSize={0.8} color="#4ECDC4" anchorX="center" anchorY="middle">
        Advanced Mathematical Domains
      </Text>

      {categories.map((category, index) => {
        const angle = (index / categories.length) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <CategoryCard3D
            key={index}
            position={[x, 0, z]}
            category={category}
            rotation={[0, -angle, 0]}
          />
        );
      })}
    </group>
  );
}

// Enhanced Category Card 3D
function CategoryCard3D({
  position,
  category,
  rotation,
}: {
  position: [number, number, number];
  category: { name: string; icon: string; problems: number; color: string };
  rotation: [number, number, number];
}) {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <group
      ref={cardRef}
      position={position}
      rotation={rotation}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Box args={[2.5, 3, 0.8]}>
        <meshStandardMaterial
          color="#2A3B4E"
          emissive={category.color}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          transparent
          opacity={0.9}
        />
      </Box>

      <Text
        position={[0, 1, 0.5]}
        fontSize={0.5}
        color={category.color}
        anchorX="center"
        anchorY="middle"
      >
        {category.icon}
      </Text>

      <Text
        position={[0, 0.3, 0.5]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
      >
        {category.name}
      </Text>

      <Text
        position={[0, -0.2, 0.5]}
        fontSize={0.15}
        color={category.color}
        anchorX="center"
        anchorY="middle"
      >
        {category.problems} problems
      </Text>

      <Text
        position={[0, -0.5, 0.5]}
        fontSize={0.12}
        color="#95E1D3"
        anchorX="center"
        anchorY="middle"
      >
        {category.difficulty} Level
      </Text>
    </group>
  );
}

// Advanced Mathematical Visualizations
function AdvancedMathVisualizations() {
  return (
    <group position={[0, -26, 0]}>
      <Text position={[0, 4, 0]} fontSize={0.8} color="#4ECDC4" anchorX="center" anchorY="middle">
        Advanced Mathematical Visualizations
      </Text>

      {/* Complex Function Surface */}
      <ComplexFunctionSurface position={[-8, 0, 0]} />

      {/* 3D Vector Field */}
      <VectorField3D position={[0, 0, 0]} />

      {/* Fractal Geometry */}
      <FractalGeometry position={[8, 0, 0]} />

      {/* Mathematical Equations in 3D */}
      <Equation3D position={[-6, 3, 2]} text="∇²φ + k²φ = 0" color="#4ECDC4" />
      <Equation3D position={[6, 3, 2]} text="∂u/∂t = α∇²u" color="#FF6B6B" />
      <Equation3D position={[0, 4, 3]} text="∮ F⃗·dr⃗ = ∬(∇×F⃗)·n̂dS" color="#FFE66D" />
    </group>
  );
}

// Complex Function Surface
function ComplexFunctionSurface({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(4, 4, 60, 60);
    const vertices = geom.attributes.position.array as Float32Array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const r2 = x * x + y * y;
      vertices[i + 2] = (Math.sin(r2) / (r2 + 1)) * 2;
    }

    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#4ECDC4"
          emissive="#2A3B4E"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text position={[0, -3, 0]} fontSize={0.3} color="#4ECDC4" anchorX="center" anchorY="middle">
        Complex Function Surface
      </Text>
    </group>
  );
}

// 3D Vector Field
function VectorField3D({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  const vectors = useMemo(() => {
    const vectorData = [];
    for (let x = -2; x <= 2; x += 1) {
      for (let y = -2; y <= 2; y += 1) {
        for (let z = -1; z <= 1; z += 1) {
          vectorData.push({
            position: [x, y, z] as [number, number, number],
            direction: [Math.sin(x) * 0.5, Math.cos(y) * 0.5, Math.sin(z) * 0.3] as [
              number,
              number,
              number,
            ],
          });
        }
      }
    }
    return vectorData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {vectors.map((vector, index) => (
        <group key={index} position={vector.position}>
          <Box args={[0.1, 0.1, 0.8]}>
            <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.3} />
          </Box>
        </group>
      ))}
      <Text position={[0, -4, 0]} fontSize={0.3} color="#FF6B6B" anchorX="center" anchorY="middle">
        3D Vector Field
      </Text>
    </group>
  );
}

// Fractal Geometry
function FractalGeometry({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  const sierpinski = useMemo(() => {
    const points = [];
    const depth = 3;

    function generateSierpinski(level: number, x: number, y: number, z: number, size: number) {
      if (level === 0) {
        points.push([x, y, z, size]);
        return;
      }

      const newSize = size / 2;
      const offset = size / 4;

      generateSierpinski(level - 1, x - offset, y - offset, z - offset, newSize);
      generateSierpinski(level - 1, x + offset, y - offset, z - offset, newSize);
      generateSierpinski(level - 1, x, y + offset, z - offset, newSize);
      generateSierpinski(level - 1, x, y, z + offset, newSize);
    }

    generateSierpinski(depth, 0, 0, 0, 2);
    return points;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {sierpinski.map((point, index) => (
        <Box
          key={index}
          args={[point[3], point[3], point[3]]}
          position={[point[0], point[1], point[2]]}
        >
          <meshStandardMaterial
            color="#FFE66D"
            emissive="#FFE66D"
            emissiveIntensity={0.2}
            transparent
            opacity={0.7}
          />
        </Box>
      ))}
      <Text position={[0, -3, 0]} fontSize={0.3} color="#FFE66D" anchorX="center" anchorY="middle">
        Fractal Geometry
      </Text>
    </group>
  );
}

// 3D Mathematical Equation Display
function Equation3D({
  position,
  text,
  color,
}: {
  position: [number, number, number];
  text: string;
  color: string;
}) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      textRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.4}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

// Main 3D Landing Page Component
export function LandingPage3D() {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <Canvas
        camera={{ position: [0, 5, 25], fov: 75 }}
        style={{
          background:
            'linear-gradient(135deg, #2A3B4E 0%, #1a2332 25%, #3d5a80 50%, #2A3B4E 75%, #0f1419 100%)',
        }}
      >
        <color attach="background" args={['#2A3B4E']} />
        <fog attach="fog" args={['#2A3B4E', 25, 120]} />

        {/* Enhanced Lighting System */}
        <ambientLight intensity={0.3} />
        <pointLight position={[15, 15, 15]} intensity={1.8} color="#4ECDC4" />
        <pointLight position={[-15, -15, -15]} intensity={1.2} color="#FF6B6B" />
        <pointLight position={[0, 30, 8]} intensity={1.5} color="#FFE66D" />
        <spotLight position={[20, 20, 20]} intensity={1.8} color="#95E1D3" angle={0.3} />
        <spotLight position={[-20, 20, -20]} intensity={1.3} color="#A8E6CF" angle={0.4} />

        {/* Enhanced Environment */}
        <Stars radius={250} depth={120} count={15000} factor={10} saturation={0} fade speed={1.2} />

        {/* All Enhanced 3D Sections */}
        <Hero3D />
        <Features3D />
        <Statistics3D />
        <MathCategories3D />
        <AdvancedMathVisualizations />

        {/* Enhanced Interactive Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.15}
          maxDistance={60}
          minDistance={10}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Enhanced HTML Overlay for Navigation */}
      <div className="absolute top-4 left-4 text-white z-10">
        <motion.div
          className="bg-black/40 backdrop-blur-md rounded-lg p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-lg font-bold text-[#4ECDC4] mb-3">3D Navigation Guide</h3>
          <ul className="text-sm space-y-2">
            <li>• Drag to rotate the mathematical universe</li>
            <li>• Scroll to zoom into detailed visualizations</li>
            <li>• Hover over elements for interactions</li>
            <li>• Auto-rotation showcases all features</li>
            <li>• Explore advanced mathematical concepts</li>
          </ul>
        </motion.div>
      </div>

      {/* Enhanced Call to Action Overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          className="bg-gradient-to-r from-[#4ECDC4] via-[#2A3B4E] to-[#FF6B6B] text-white px-10 py-5 rounded-full shadow-2xl backdrop-blur-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button className="font-bold text-xl">Begin Your 3D Mathematical Adventure</button>
        </motion.div>
      </div>

      {/* Mathematical Complexity Indicator */}
      <div className="absolute top-4 right-4 text-white z-10">
        <motion.div
          className="bg-black/40 backdrop-blur-md rounded-lg p-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h4 className="text-sm font-bold text-[#FFE66D] mb-2">Active Visualizations</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-2"></div>
              <span>Complex Analysis</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mr-2"></div>
              <span>Vector Fields</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#FFE66D] rounded-full mr-2"></div>
              <span>Fractal Geometry</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#95E1D3] rounded-full mr-2"></div>
              <span>AI Neural Networks</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
