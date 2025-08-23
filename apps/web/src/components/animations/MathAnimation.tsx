'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MathEquation {
  equation: string;
  solution: string;
  id: number;
}

const mathEquations: MathEquation[] = [
  { equation: '∫ x² dx', solution: 'x³/3 + C', id: 1 },
  { equation: 'lim(x→0) sin(x)/x', solution: '1', id: 2 },
  { equation: '∇²φ = 0', solution: "Laplace's equation", id: 3 },
  { equation: 'e^(iπ) + 1', solution: '0', id: 4 },
  { equation: '∑(n=1 to ∞) 1/n²', solution: 'π²/6', id: 5 },
  { equation: "f'(x) = lim(h→0)", solution: '[f(x+h)-f(x)]/h', id: 6 },
];

export const FloatingMathEquations = () => {
  const [currentEquations, setCurrentEquations] = useState<MathEquation[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEquation = mathEquations[Math.floor(Math.random() * mathEquations.length)];
      setCurrentEquations((prev) => {
        const newEquations = [...prev, { ...randomEquation, id: Date.now() }];
        return newEquations.slice(-6); // Keep only last 6 equations
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {currentEquations.map((eq, index) => (
        <motion.div
          key={eq.id}
          className="absolute text-blue-200 dark:text-blue-800 font-mono text-sm opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          animate={{
            y: -100,
            opacity: [0, 0.6, 0],
            rotate: Math.random() * 360 + 180,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            ease: 'linear',
          }}
          style={{
            left: `${10 + ((index * 15) % 80)}%`,
          }}
        >
          {eq.equation}
        </motion.div>
      ))}
    </div>
  );
};

export const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export const MathFormula = ({ formula, delay = 0 }: { formula: string; delay?: number }) => {
  return (
    <motion.div
      className="font-mono text-lg text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
    >
      {formula}
    </motion.div>
  );
};
