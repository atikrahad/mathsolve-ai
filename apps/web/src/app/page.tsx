'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import {
  FloatingMathEquations,
  AnimatedCounter,
  MathFormula,
} from '@/components/animations/MathAnimation';
// import { AuthGuard } from "@/components/auth";
// import { useAuthStore } from "@/store/auth";
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Users,
  Trophy,
  BookOpen,
  Target,
  Smartphone,
  CheckCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';

// Dynamically import 3D components to avoid SSR issues
const MathScene3D = dynamic(() => import('@/components/3d/MathScene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-[#2A3B4E] via-[#1a2332] to-[#0f1419] flex items-center justify-center rounded-xl">
      <div className="text-[#4ECDC4] text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ECDC4] mx-auto mb-4"></div>
        <p>Loading 3D Math Visualization...</p>
      </div>
    </div>
  ),
});

const AdvancedMath3D = dynamic(() => import('@/components/3d/AdvancedMath3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-gradient-to-br from-[#2A3B4E] via-[#1a2332] to-[#0f1419] flex items-center justify-center rounded-xl">
      <div className="text-[#4ECDC4] text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4ECDC4] mx-auto mb-2"></div>
        <p className="text-sm">Loading Advanced Visualizations...</p>
      </div>
    </div>
  ),
});

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  // const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A3B4E] via-[#1a2332] to-[#0f1419] relative overflow-hidden">
      {/* Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] bg-clip-text text-transparent">
              MathSolve AI
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#95E1D3] hover:text-white hover:bg-white/10"
                  >
                    <LogIn size={16} className="mr-1" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] text-[#2A3B4E] hover:from-[#4ECDC4]/80 hover:to-[#FFE66D]/80"
                  >
                    <UserPlus size={16} className="mr-1" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Math Equations Background */}
      <FloatingMathEquations />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 lg:py-32">
        <motion.div
          className="text-center max-w-6xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-[#4ECDC4]/20 rounded-full text-[#4ECDC4] text-sm font-medium border border-[#4ECDC4]/30">
              🚀 Powered by Advanced AI Technology
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-[#4ECDC4] via-[#FFE66D] to-[#95E1D3] bg-clip-text text-transparent">
              MathSolve
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4] bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-[#95E1D3] mb-8 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform your mathematics learning with AI-powered solutions, interactive 3D
            visualizations, and a vibrant community of learners. From basic arithmetic to advanced
            calculus, master math at your own pace.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/auth/register">
              <Button
                size="lg"
                className="text-lg px-12 py-4 bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] hover:from-[#4ECDC4]/80 hover:to-[#FFE66D]/80 text-[#2A3B4E] font-bold transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-4 border-2 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/10 transform hover:scale-105 transition-all duration-200"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Math Formulas Preview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <MathFormula formula="∫ x² dx = x³/3 + C" delay={0.2} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <MathFormula formula="e^(iπ) + 1 = 0" delay={0.4} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <MathFormula formula="lim(x→0) sin(x)/x = 1" delay={0.6} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3D Mathematical Visualizations Section */}
      <section className="py-20 bg-gradient-to-br from-black/20 via-[#2A3B4E]/30 to-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-block mb-4 px-6 py-3 bg-[#FFE66D]/20 rounded-full text-[#FFE66D] text-sm font-semibold border border-[#FFE66D]/30 shadow-sm backdrop-blur-sm">
              🎯 Interactive 3D Mathematics
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience Mathematics in
              <span className="bg-gradient-to-r from-[#4ECDC4] via-[#FFE66D] to-[#95E1D3] bg-clip-text text-transparent">
                {' '}
                Three Dimensions
              </span>
            </h2>
            <p className="text-xl text-[#95E1D3] max-w-3xl mx-auto mb-4">
              Explore stunning 3D mathematical visualizations with professional animations and
              vibrant colors. Each visualization demonstrates complex mathematical concepts through
              interactive and engaging displays.
            </p>
          </motion.div>

          {/* Main 3D Scene */}
          <motion.div
            className="mb-16 rounded-2xl overflow-hidden shadow-2xl border border-[#4ECDC4]/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <MathScene3D />
          </motion.div>

          {/* Advanced Math Visualizations Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              className="bg-gradient-to-br from-[#2A3B4E]/90 via-[#4ECDC4]/10 to-[#2A3B4E]/90 backdrop-blur-sm p-6 rounded-2xl border border-[#4ECDC4]/20 shadow-xl"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-bold text-[#4ECDC4] mb-4 text-center">
                Advanced Mathematical Surfaces
              </h3>
              <div className="h-80 rounded-xl overflow-hidden">
                <AdvancedMath3D />
              </div>
              <p className="text-sm text-[#95E1D3] text-center mt-4">
                Interactive 3D surfaces demonstrating complex mathematical functions with real-time
                manipulation capabilities.
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#2A3B4E]/90 via-[#FF6B6B]/10 to-[#2A3B4E]/90 backdrop-blur-sm p-6 rounded-2xl border border-[#FF6B6B]/20 shadow-xl"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-bold text-[#FF6B6B] mb-4 text-center">
                AI Learning Analytics
              </h3>
              <div className="space-y-4">
                <div className="bg-[#2A3B4E]/50 p-4 rounded-lg border border-[#FF6B6B]/20">
                  <h4 className="text-[#FFE66D] font-semibold mb-2">Real-time Progress Tracking</h4>
                  <p className="text-[#95E1D3] text-sm">
                    AI analyzes your learning patterns and provides personalized recommendations for
                    optimal mathematical growth.
                  </p>
                </div>
                <div className="bg-[#2A3B4E]/50 p-4 rounded-lg border border-[#FF6B6B]/20">
                  <h4 className="text-[#FFE66D] font-semibold mb-2">
                    Adaptive Difficulty Matching
                  </h4>
                  <p className="text-[#95E1D3] text-sm">
                    Dynamic problem selection ensures you&apos;re always challenged at the perfect
                    level for maximum learning efficiency.
                  </p>
                </div>
                <div className="bg-[#2A3B4E]/50 p-4 rounded-lg border border-[#FF6B6B]/20">
                  <h4 className="text-[#FFE66D] font-semibold mb-2">
                    Predictive Performance Modeling
                  </h4>
                  <p className="text-[#95E1D3] text-sm">
                    Advanced algorithms predict your mathematical mastery timeline and suggest
                    optimal study strategies.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#4ECDC4]/10 via-[#FFE66D]/10 to-[#FF6B6B]/10 backdrop-blur-sm border-t border-[#4ECDC4]/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { number: 500000, label: 'Problems Solved', suffix: '+', color: '#4ECDC4' },
              { number: 100000, label: 'Active Students', suffix: '+', color: '#FF6B6B' },
              { number: 50, label: 'Math Categories', suffix: '+', color: '#FFE66D' },
              { number: 98, label: 'Success Rate', suffix: '%', color: '#95E1D3' },
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>
                  <AnimatedCounter end={stat.number} />
                  {stat.suffix}
                </div>
                <div className="text-[#95E1D3] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-[#95E1D3]/20 rounded-full text-[#95E1D3] text-sm font-medium border border-[#95E1D3]/30">
            ✨ Revolutionary Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Students Choose
            <span className="bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] bg-clip-text text-transparent">
              {' '}
              MathSolve AI
            </span>
          </h2>
          <p className="text-xl text-[#95E1D3] max-w-3xl mx-auto">
            Experience the next generation of mathematics education with cutting-edge AI technology
            and innovative 3D learning methods.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              icon: <Brain className="h-8 w-8" />,
              title: 'AI-Powered Solutions',
              description:
                'Get instant, step-by-step solutions with detailed explanations powered by advanced neural networks. Our AI understands context and provides personalized learning experiences.',
              color: 'from-[#4ECDC4] to-[#95E1D3]',
              delay: 0,
            },
            {
              icon: <Trophy className="h-8 w-8" />,
              title: '3D Gamified Learning',
              description:
                'Earn XP, climb rankings, and unlock achievements while exploring 3D mathematical worlds. Track your progress from Bronze to Master level with immersive visualizations.',
              color: 'from-[#FFE66D] to-[#FF6B6B]',
              delay: 0.1,
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: 'Global Community',
              description:
                'Connect with thousands of math enthusiasts worldwide. Share 3D mathematical models, discuss solutions, and learn from peers in our vibrant learning ecosystem.',
              color: 'from-[#95E1D3] to-[#4ECDC4]',
              delay: 0.2,
            },
            {
              icon: <BookOpen className="h-8 w-8" />,
              title: 'Comprehensive 3D Library',
              description:
                'Access over 50,000+ problems with interactive 3D visualizations covering topics from basic arithmetic to advanced multivariable calculus and beyond.',
              color: 'from-[#FF6B6B] to-[#FFE66D]',
              delay: 0.3,
            },
            {
              icon: <Target className="h-8 w-8" />,
              title: 'Adaptive 3D Learning',
              description:
                'Our AI analyzes your 3D interaction patterns and provides personalized recommendations. Experience mathematics through immersive visual learning paths.',
              color: 'from-[#FFE66D] to-[#95E1D3]',
              delay: 0.4,
            },
            {
              icon: <Smartphone className="h-8 w-8" />,
              title: 'Cross-Platform 3D',
              description:
                'Enjoy seamless 3D mathematical visualizations across all devices. Our responsive platform delivers consistent experiences on desktop, tablet, and mobile.',
              color: 'from-[#4ECDC4] to-[#FF6B6B]',
              delay: 0.5,
            },
          ].map((feature, index) => (
            <AnimatedCard key={index} delay={feature.delay}>
              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-[#95E1D3] leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </AnimatedCard>
          ))}
        </motion.div>
      </section>

      {/* Math Categories Section */}
      <section className="py-20 bg-gradient-to-r from-[#2A3B4E]/50 to-[#1a2332]/50 border-t border-[#4ECDC4]/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Master Every Branch of Mathematics
            </h2>
            <p className="text-xl text-[#95E1D3] max-w-3xl mx-auto">
              From fundamental concepts to advanced theories, explore our comprehensive curriculum
              with interactive 3D visualizations for each mathematical domain.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { name: 'Calculus', icon: '∫', problems: 5250, color: '#4ECDC4' },
              { name: 'Algebra', icon: '📐', problems: 4100, color: '#FF6B6B' },
              { name: 'Geometry', icon: '📊', problems: 3890, color: '#FFE66D' },
              { name: 'Trigonometry', icon: '📈', problems: 2950, color: '#95E1D3' },
              { name: 'Statistics', icon: '📊', problems: 2750, color: '#A8E6CF' },
              { name: 'Probability', icon: '🎲', problems: 1800, color: '#FFB3BA' },
              { name: 'Linear Algebra', icon: '🔢', problems: 1600, color: '#BAFFC9' },
              { name: 'Discrete Math', icon: '∂', problems: 1200, color: '#BAE1FF' },
            ].map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <AnimatedCard delay={index * 0.1}>
                  <CardContent className="text-center py-8 bg-gradient-to-br from-[#2A3B4E]/90 to-black/20 border border-white/10">
                    <div className="text-5xl mb-4" style={{ color: category.color }}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-[#95E1D3]">
                      {category.problems.toLocaleString()} problems
                    </p>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-[#2A3B4E] via-[#4ECDC4]/20 to-[#2A3B4E] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-block mb-4 px-4 py-2 bg-[#4ECDC4]/20 rounded-full text-[#4ECDC4] text-sm font-medium border border-[#4ECDC4]/30">
                🎉 Join Over 500,000+ Students
              </div>
            </motion.div>

            <motion.h2 className="text-4xl md:text-6xl font-bold mb-6" variants={fadeInUp}>
              Ready to Master Mathematics in 3D?
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto text-[#95E1D3]"
              variants={fadeInUp}
            >
              Start your journey today with personalized AI tutoring, immersive 3D visualizations,
              and a supportive community of learners.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              variants={fadeInUp}
            >
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="text-lg px-12 py-4 bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] text-[#2A3B4E] hover:from-[#4ECDC4]/80 hover:to-[#FFE66D]/80 font-bold transform hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-4 border-2 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/10 transform hover:scale-105 transition-all duration-200"
              >
                Explore 3D Demo
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left"
              variants={staggerContainer}
            >
              {[
                '✨ Free forever for basic features',
                '🚀 No credit card required',
                '📚 Access to 50,000+ 3D problems instantly',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center md:justify-start"
                  variants={fadeInUp}
                >
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-[#4ECDC4]" />
                  <span className="text-[#95E1D3]">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
