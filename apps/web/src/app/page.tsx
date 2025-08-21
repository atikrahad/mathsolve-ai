'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { FloatingMathEquations, AnimatedCounter, MathFormula } from "@/components/animations/MathAnimation";
import { ArrowRight, Brain, Users, Trophy, BookOpen, Target, Smartphone, Zap, Star, CheckCircle } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      
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
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium">
              🚀 Powered by Advanced AI Technology
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MathSolve
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform your mathematics learning with AI-powered solutions, interactive problem-solving, 
            and a vibrant community of learners. From basic arithmetic to advanced calculus, 
            master math at your own pace.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" className="text-lg px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-xl">
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12 py-4 border-2 hover:bg-blue-50 dark:hover:bg-blue-900 transform hover:scale-105 transition-all duration-200">
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

      {/* Stats Section */}
      <section className="py-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { number: 50000, label: "Problems Solved", suffix: "+" },
              { number: 10000, label: "Active Students", suffix: "+" },
              { number: 25, label: "Math Categories", suffix: "" },
              { number: 95, label: "Success Rate", suffix: "%" }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  <AnimatedCounter end={stat.number} />{stat.suffix}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
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
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-800 dark:text-indigo-200 text-sm font-medium">
            ✨ Revolutionary Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Students Choose
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> MathSolve AI</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of mathematics education with cutting-edge AI technology 
            and innovative learning methods.
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
              title: "AI-Powered Solutions",
              description: "Get instant, step-by-step solutions with detailed explanations powered by advanced AI algorithms. Understand not just the answer, but the reasoning behind it.",
              color: "from-blue-500 to-cyan-500",
              delay: 0
            },
            {
              icon: <Trophy className="h-8 w-8" />,
              title: "Gamified Learning",
              description: "Earn XP, climb rankings, and unlock achievements as you solve problems. Track your progress from Bronze to Master level with our engaging reward system.",
              color: "from-amber-500 to-orange-500",
              delay: 0.1
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "Community Platform",
              description: "Connect with thousands of math enthusiasts worldwide. Share problems, discuss solutions, and learn from peers in our vibrant learning community.",
              color: "from-green-500 to-emerald-500",
              delay: 0.2
            },
            {
              icon: <BookOpen className="h-8 w-8" />,
              title: "Comprehensive Library",
              description: "Access over 10,000+ problems and resources covering topics from basic arithmetic to advanced calculus, differential equations, and beyond.",
              color: "from-purple-500 to-violet-500",
              delay: 0.3
            },
            {
              icon: <Target className="h-8 w-8" />,
              title: "Personalized Learning",
              description: "Our AI analyzes your learning patterns and provides personalized recommendations. Adaptive difficulty matching ensures optimal challenge levels.",
              color: "from-pink-500 to-rose-500",
              delay: 0.4
            },
            {
              icon: <Smartphone className="h-8 w-8" />,
              title: "Multi-Platform Access",
              description: "Learn seamlessly across all devices. Our responsive platform works perfectly on desktop, tablet, and mobile with offline support coming soon.",
              color: "from-indigo-500 to-blue-500",
              delay: 0.5
            }
          ].map((feature, index) => (
            <AnimatedCard key={index} delay={feature.delay}>
              <CardHeader>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </AnimatedCard>
          ))}
        </motion.div>
      </section>

      {/* Math Categories Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Master Every Branch of Mathematics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From fundamental concepts to advanced theories, explore our comprehensive curriculum 
              designed for learners at every level.
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
              { name: "Arithmetic", icon: "🔢", problems: 1250 },
              { name: "Algebra", icon: "📐", problems: 2100 },
              { name: "Geometry", icon: "📊", problems: 1890 },
              { name: "Trigonometry", icon: "📈", problems: 950 },
              { name: "Calculus", icon: "∫", problems: 1750 },
              { name: "Statistics", icon: "📊", problems: 1100 },
              { name: "Probability", icon: "🎲", problems: 800 },
              { name: "Linear Algebra", icon: "🔢", problems: 600 },
            ].map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <AnimatedCard delay={index * 0.1}>
                  <CardContent className="text-center py-8">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.problems.toLocaleString()} problems
                    </p>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Loved by Students Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of successful learners who have transformed their math skills with MathSolve AI
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              name: "Sarah Chen",
              role: "Computer Science Student",
              avatar: "👩‍💻",
              rating: 5,
              text: "MathSolve AI completely changed how I approach calculus. The step-by-step explanations are incredibly detailed, and the AI actually helps me understand the concepts rather than just giving me answers."
            },
            {
              name: "Marcus Johnson",
              role: "High School Teacher",
              avatar: "👨‍🏫",
              rating: 5,
              text: "I recommend MathSolve AI to all my students. The platform's ability to adapt to different learning styles and provide personalized recommendations is remarkable. My students' performance has improved significantly."
            },
            {
              name: "Elena Rodriguez",
              role: "Engineering Major",
              avatar: "👩‍🔬",
              rating: 5,
              text: "The community aspect is fantastic. I can discuss complex problems with peers and get help from more advanced students. The gamification keeps me motivated to practice daily."
            }
          ].map((testimonial, index) => (
            <AnimatedCard key={index} delay={index * 0.2}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </CardContent>
            </AnimatedCard>
          ))}
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-block mb-4 px-4 py-2 bg-white/20 rounded-full text-white/90 text-sm font-medium">
                🎉 Join Over 50,000+ Students
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={fadeInUp}
            >
              Ready to Master Mathematics?
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Start your journey today with personalized AI tutoring, interactive problem-solving, 
              and a supportive community of learners.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              variants={fadeInUp}
            >
              <Button size="lg" variant="secondary" className="text-lg px-12 py-4 bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-12 py-4 border-2 border-white text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-200">
                Schedule Demo
              </Button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left"
              variants={staggerContainer}
            >
              {[
                "✨ Free forever for basic features",
                "🚀 No credit card required",
                "📚 Access to 10,000+ problems instantly"
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-center md:justify-start"
                  variants={fadeInUp}
                >
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
