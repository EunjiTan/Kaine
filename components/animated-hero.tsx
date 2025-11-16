'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ShaderCanvas } from './shader-canvas';

export function AnimatedHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <ShaderCanvas />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${15 + Math.random() * 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className={`space-y-6 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-block">
            <span className="text-xs tracking-widest text-blue-300 uppercase px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 animate-pulse">
              AI Email Intelligence
            </span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-bold leading-tight text-white">
            Respond faster with
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              AI magic
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Kaine drafts, reviews, and optimizes your emails. Save hours every week while keeping your personal voice.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="gap-2 bg-white text-black hover:bg-gray-200 animate-bounce-subtle"
              onClick={() => router.push('/auth/signup')}
            >
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white/20 text-white hover:bg-white/10"
              onClick={() => router.push('/auth/login')}
            >
              Sign In
            </Button>
          </div>

          <p className="text-xs text-gray-400 pt-4">
            Trusted by 10M+ professionals • No credit card required
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? 100 : -100}px);
            opacity: 0;
          }
        }

        @keyframes animate-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: animate-gradient 8s ease infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
