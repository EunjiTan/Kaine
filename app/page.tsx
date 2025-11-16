'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Zap, Shield, CheckCircle, ArrowRight, Sparkles, Brain, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatedHero } from '@/components/animated-hero';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [demoStep, setDemoStep] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [particles, setParticles] = useState([]);
  const observerRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    // Generate particles for atmosphere
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.dataset.observeId]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.2 }
    );

    observerRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const principles = [
    {
      icon: Users,
      title: 'Designed for Humans',
      description: 'Intuitive interface that feels natural from day one'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Review and approve emails in seconds, not minutes'
    },
    {
      icon: Brain,
      title: 'Smart AI',
      description: 'Context-aware responses that sound like you'
    }
  ];

  const demoSteps = [
    { title: 'Email Arrives', icon: Mail, desc: 'New email detected' },
    { title: 'AI Analyzes', icon: Brain, desc: 'Understanding context' },
    { title: 'Draft Created', icon: Sparkles, desc: 'Response generated' },
    { title: 'Your Review', icon: CheckCircle, desc: 'Approve or edit' }
  ];

  const stats = [
    { label: 'Response Time', value: '< 30s' },
    { label: 'Accuracy Rate', value: '98%' },
    { label: 'Time Saved', value: '5h/day' },
    { label: 'Happy Users', value: '10k+' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">Kaine</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-blue-400 transition-colors">FEATURES</a>
            <a href="#how-it-works" className="text-sm hover:text-blue-400 transition-colors">HOW IT WORKS</a>
            <a href="#stats" className="text-sm hover:text-blue-400 transition-colors">RESULTS</a>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button 
              size="sm"
              onClick={handleGetStarted}
            >
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <AnimatedHero />

      {/* Features Section */}
      <div 
        ref={el => observerRefs.current[0] = el}
        data-observe-id="features"
        className="relative py-20 px-6"
        id="features"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Design for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Humans
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our goal is to design an ergonomic, sensible, and productive workflow that even beginners can use easily
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, i) => {
              const Icon = principle.icon;
              return (
                <Card 
                  key={i}
                  className={`border transition-all duration-500 ${
                    isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${i * 0.2}s`
                  }}
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{principle.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div 
        ref={el => observerRefs.current[1] = el}
        data-observe-id="how-it-works"
        className="relative py-20 px-6 bg-gray-900"
        id="how-it-works"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              See Kaine in
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Action
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">Watch how AI transforms your email workflow</p>
          </div>

          {/* Demo Steps */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {demoSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = demoStep === i;
              const isPast = demoStep > i;
              
              return (
                <Card
                  key={i}
                  className={`relative border transition-all duration-500 ${
                    isActive 
                      ? 'scale-105 bg-blue-50 dark:bg-blue-950 border-blue-500' 
                      : isPast
                      ? 'bg-green-50 dark:bg-green-950 border-green-500'
                      : ''
                  }`}
                >
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">{step.desc}</CardDescription>
                    {isPast && (
                      <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-green-600" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats */}
          <div 
            ref={el => observerRefs.current[2] = el}
            data-observe-id="stats"
            id="stats"
            className="grid md:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <Card 
                key={i}
                className={`text-center transition-all duration-500 ${
                  isVisible.stats ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  transitionDelay: `${i * 0.1}s`
                }}
              >
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-blue-600">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{stat.label}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-4xl">
                Ready to transform your
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  email workflow?
                </span>
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of professionals who save hours every day with Kaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="gap-2"
                onClick={handleGetStarted}
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Kaine. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateZ(20px);
          }
          50% {
            transform: translateY(-20px) translateZ(20px);
          }
        }
      `}</style>
    </div>
  );
}
