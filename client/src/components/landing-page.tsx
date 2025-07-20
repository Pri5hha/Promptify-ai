import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useLocation } from 'wouter';

export function LandingPage() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation('/app');
  };

  const handleTryNow = () => {
    setLocation('/app');
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
              <Wand2 className="text-white w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Promptify</h1>
          </div>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            onClick={handleTryNow}
          >
            Try Now
          </Button>
        </div>
      </header>
      {/* Hero Section */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl leading-tight mb-8 font-normal">
            Master Prompt
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
              Engineering with AI
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
            Promptify is your AI-powered assistant that helps you
            <br />
            write, optimize, and master prompts for tools like GPT
            <br />
            and Claude -- whether you're a beginner or a pro.
          </p>

          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleGetStarted}
          >
            Get Started Free
          </Button>
        </div>
      </main>
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Promptify, All rights reserved.
          </p>
        </div>
      </footer>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main flowing gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"></div>
        
        {/* Flowing animated layers */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-blue-900/30 to-transparent animate-wave"></div>
          <div className="absolute w-full h-full bg-gradient-to-l from-transparent via-white/8 to-transparent animate-wave" style={{ animationDelay: '2s' }}></div>
          <div className="absolute w-full h-full bg-gradient-to-b from-black/20 via-blue-800/20 to-white/5 animate-wave" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Moving orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-drift" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-white/8 rounded-full blur-2xl animate-drift" style={{ animationDelay: '5s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-black/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Flowing gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-blue-900/20 to-white/5 animate-wave" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-l from-white/8 via-black/40 to-blue-800/25 animate-wave" style={{ animationDuration: '10s', animationDelay: '3s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-black/50 animate-drift" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}