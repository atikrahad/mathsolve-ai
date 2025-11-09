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
    <div className="w-full h-96 bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center rounded-xl">
      <div className="text-emerald-300 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-300 mx-auto mb-4"></div>
        <p>Loading 3D Code Simulation...</p>
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

const theme = {
  accentGradient: 'from-emerald-400 via-cyan-300 to-teal-400',
  secondaryGradient: 'from-cyan-300 via-sky-400 to-emerald-300',
  accentText: 'text-emerald-300',
  mutedText: 'text-slate-400',
  panelBackground: 'bg-slate-900/60 border border-slate-800 shadow-xl',
  highlightPill:
    'px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 text-emerald-200 text-sm font-medium tracking-wide',
};

export default function Home() {
  // const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen max-w-screen-lg bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent">
              CodeSolve AI
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-slate-800/70"
                  >
                    <LogIn size={16} className="mr-1" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300 text-slate-900 hover:opacity-90 shadow-lg shadow-emerald-500/30"
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

      {/* Floating Code Stream Background */}
      <FloatingMathEquations />

      {/* Hero Section */}
      <section className="relative w-full px-4 py-20 lg:py-32">
        <motion.div
          className="text-center w-full"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`${theme.highlightPill} inline-flex items-center gap-2 mb-4`}>
              🚀 Built for Elite Problem Solvers
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span
              className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent drop-shadow-2xl`}
            >
              CodeSolve
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-400 mb-8 leading-relaxed w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ship production-ready code faster with AI copilots, interactive debugging visualizers,
            and a thriving developer community. Practice algorithms, crush coding interviews, and
            automate workflows across every major programming language.
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
                className="text-lg px-12 py-4 bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-400 hover:opacity-90 text-slate-950 font-bold transform hover:scale-105 transition-all duration-200 shadow-xl shadow-emerald-500/40"
              >
                Start Solving Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-4 border-2 border-emerald-400/50 text-emerald-200 hover:bg-emerald-400/10 transform hover:scale-105 transition-all duration-200"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Code Snippets Preview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <MathFormula formula="function quickSort(arr) { ... }" delay={0.2} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <MathFormula formula="const dp = new Array(n).fill(0);" delay={0.4} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <MathFormula formula="for (let bit of bitmask) { ... }" delay={0.6} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Immersive Problem Visualizer */}
      <section className="relative w-full h-screen bg-slate-950/60 border-y border-slate-900 backdrop-blur-sm py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-slate-950/30 to-slate-950 pointer-events-none" />
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col gap-10 h-full">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={`${theme.highlightPill} inline-flex items-center gap-2 px-6 py-3 mb-4 shadow-sm`}>
              🎯 Immersive Problem Visualizer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Watch AI orchestrate complex coding challenges in
              <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>
                {' '}
                real time
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Trace every decision, optimization, and test run across your entire challenge stack from a single, cinematic control center.
            </p>
          </motion.div>

          <div className="flex-1 h-full">
            <div className="h-full">
              <MathScene3D />
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Adaptive Playbooks',
                description: 'AI converts every unsolved prompt into a decomposed battle plan, then updates it live as you iterate.',
              },
              {
                title: 'Confidence Heatmaps',
                description: 'Visual overlays show coverage, edge cases, and stress points for each submission before you hit ship.',
              },
              {
                title: 'Team-wide Telemetry',
                description: 'Replay collaborative attempts with synchronized logs, code, and commentary in a single stream.',
              },
            ].map((card, index) => (
              <motion.div key={card.title} className={`${theme.panelBackground} p-6 rounded-2xl`} variants={fadeInUp}>
                <h4 className="text-xl font-semibold text-white mb-2">{card.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-950/50 backdrop-blur-sm border-y border-slate-900">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { number: 850000, label: 'Bugs Squashed', suffix: '+', colorClass: 'text-emerald-300' },
              { number: 120000, label: 'Active Developers', suffix: '+', colorClass: 'text-sky-300' },
              { number: 75, label: 'Programming Stacks', suffix: '+', colorClass: 'text-amber-300' },
              { number: 99, label: 'Resolution Rate', suffix: '%', colorClass: 'text-teal-300' },
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.colorClass}`}>
                  <AnimatedCounter end={stat.number} />
                  {stat.suffix}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={`${theme.highlightPill} inline-flex items-center gap-2 mb-4`}>
            ✨ Ship Faster Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Builders Choose
            <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>
              {' '}
              CodeSolve AI
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Experience the next generation of software development with AI copilots, instant code
            reviews, and immersive debugging flows.
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
              title: 'AI Pair-Programming',
              description:
                'Autocomplete complex functions, refactor legacy code, and generate tests with copilots tuned for your stack and coding style.',
              color: 'from-emerald-400 to-cyan-300',
              delay: 0,
            },
            {
              icon: <Trophy className="h-8 w-8" />,
              title: 'Quest-Based Upskilling',
              description:
                'Earn badges, climb engineering ladders, and unlock interview tiers while conquering scenario-driven incident drills.',
              color: 'from-amber-300 to-rose-300',
              delay: 0.1,
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: 'Global Dev Community',
              description:
                'Pair with senior engineers, swap snippets, review code, and crowdsource debugging tactics from 150+ countries.',
              color: 'from-sky-300 to-emerald-300',
              delay: 0.2,
            },
            {
              icon: <BookOpen className="h-8 w-8" />,
              title: 'Scenario Library',
              description:
                'Access 50,000+ real-world incidents across microservices, mobile, and data infra with annotated solutions and postmortems.',
              color: 'from-rose-300 to-amber-300',
              delay: 0.3,
            },
            {
              icon: <Target className="h-8 w-8" />,
              title: 'Adaptive Coaching',
              description:
                'Our AI studies your commit history and IDE habits to deliver hyper-personalized drills that target blind spots.',
              color: 'from-amber-300 to-emerald-300',
              delay: 0.4,
            },
            {
              icon: <Smartphone className="h-8 w-8" />,
              title: 'Cross-Platform Tooling',
              description:
                'Enjoy lightning-fast experiences on desktop, terminal, or mobile. Start a kata on your phone and finish the deployment fix on your laptop.',
              color: 'from-cyan-300 to-sky-400',
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
                <CardDescription className="text-base text-slate-400 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </AnimatedCard>
          ))}
        </motion.div>
      </section>

      {/* Programming Categories Section */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-900">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Master Every Programming Stack
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From embedded systems to cloud-native platforms, explore curated tracks with
              interactive simulations for each language and framework.
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
              { name: 'JavaScript', icon: '</>', problems: 6800, color: 'text-emerald-300' },
              { name: 'Python', icon: '🐍', problems: 7200, color: 'text-sky-300' },
              { name: 'Go', icon: '🐹', problems: 3400, color: 'text-amber-300' },
              { name: 'Rust', icon: '🦀', problems: 2750, color: 'text-teal-300' },
              { name: 'Java', icon: '☕', problems: 5100, color: 'text-purple-300' },
              { name: 'C++', icon: '{}', problems: 4600, color: 'text-rose-300' },
              { name: 'Kotlin', icon: 'λ', problems: 1900, color: 'text-lime-300' },
              { name: 'Swift', icon: '🕊️', problems: 1600, color: 'text-cyan-300' },
            ].map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <AnimatedCard delay={index * 0.1}>
                  <CardContent className="text-center py-8 bg-slate-950/70 border border-slate-800">
                    <div className={`text-5xl mb-4 ${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-slate-400">
                      {category.problems.toLocaleString()} challenges
                    </p>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-slate-950/80 text-white py-20 relative overflow-hidden border-t border-slate-900">
        <div className="absolute inset-0 bg-slate-950/40"></div>
        <div className="w-full max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <div className={`${theme.highlightPill} inline-flex items-center gap-2 mb-4`}>
                🎉 Join 500,000+ Engineers
              </div>
            </motion.div>

            <motion.h2 className="text-4xl md:text-6xl font-bold mb-6" variants={fadeInUp}>
              Ready to Ship Better Software?
            </motion.h2>

            <motion.p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto text-slate-400" variants={fadeInUp}>
              Build unstoppable velocity with personalized AI coaching, immersive debugging sims,
              and a supportive engineering community.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              variants={fadeInUp}
            >
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="text-lg px-12 py-4 bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-400 text-slate-900 hover:opacity-90 font-bold transform hover:scale-105 transition-all duration-200 shadow-xl shadow-emerald-500/30"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-4 border-2 border-emerald-400/60 text-emerald-200 hover:bg-emerald-400/10 transform hover:scale-105 transition-all duration-200"
              >
                Explore Product Tour
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left"
              variants={staggerContainer}
            >
              {[
                '✨ Free forever for personal repos',
                '🚀 No credit card required',
                '📚 Access to 50,000+ engineering scenarios instantly',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center md:justify-start"
                  variants={fadeInUp}
                >
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-emerald-300" />
                  <span className="text-slate-400">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
