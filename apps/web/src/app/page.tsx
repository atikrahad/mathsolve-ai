import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MathSolve AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            AI-powered mathematics learning and problem-solving platform that combines intelligent tutoring, 
            community collaboration, and gamified learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Solving Problems
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Explore Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose MathSolve AI?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of mathematics education with our comprehensive platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI-Powered Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Get step-by-step solutions with detailed explanations powered by advanced AI algorithms.
                Perfect for learning and understanding complex mathematical concepts.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Gamified Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Earn XP, climb rankings, and unlock achievements as you solve problems.
                Track your progress from Bronze to Master level.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Community Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Share problems, discuss solutions, and learn from a community of math enthusiasts.
                Collaborate and grow together.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Comprehensive Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Access tutorials, guides, and references covering topics from basic arithmetic
                to advanced calculus and beyond.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Personalized Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Get personalized problem recommendations based on your skill level and learning patterns.
                Adaptive difficulty matching your progress.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                Multi-Platform Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Learn anywhere, anytime with our responsive web platform.
                Seamless experience across desktop, tablet, and mobile devices.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Math Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From basic arithmetic to advanced mathematics, we cover all levels and topics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Arithmetic", icon: "🔢" },
            { name: "Algebra", icon: "📐" },
            { name: "Geometry", icon: "📊" },
            { name: "Trigonometry", icon: "📈" },
            { name: "Calculus", icon: "∫" },
            { name: "Statistics", icon: "📊" },
            { name: "Probability", icon: "🎲" },
            { name: "Number Theory", icon: "🔢" },
          ].map((category) => (
            <Card key={category.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Math Learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already improving their math skills with MathSolve AI
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Get Started for Free
          </Button>
        </div>
      </section>
    </div>
  );
}
