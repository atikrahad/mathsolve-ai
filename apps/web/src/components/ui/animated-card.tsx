'use client';

import { motion } from 'framer-motion';
import { Card } from './card';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  whileHover?: object;
}

export const AnimatedCard = ({ 
  children, 
  className = "", 
  delay = 0,
  whileHover = { y: -5, scale: 1.02 }
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={whileHover}
      className={className}
    >
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20">
        {children}
      </Card>
    </motion.div>
  );
};