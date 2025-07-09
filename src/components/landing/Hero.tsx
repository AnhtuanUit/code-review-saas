import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github, Star, Shield, Zap, Users } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_70%)]" />
      
      <div className="container mx-auto max-w-6xl relative w-full">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-cyan-600/20 border border-cyan-600/30 rounded-full px-4 py-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Trusted by 10,000+ developers</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Automated Code Review
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> 
              {' '}That Actually Works
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop wasting time on manual code reviews. Our AI-powered platform catches bugs, 
            security issues, and code quality problems before they reach production.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-8 py-6 rounded-lg font-medium transition-all duration-200"
              onClick={onGetStarted}
            >
              <Github className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-6 rounded-lg font-medium transition-all duration-200"
            >
              View Live Demo
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-slate-300">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-slate-300">10,000+ users</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="text-slate-300">99.9% uptime</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
          <Card className="bg-slate-800/80 border-slate-700 p-6 text-center hover:bg-slate-800 transition-all duration-200">
            <div className="bg-cyan-600/20 rounded-lg p-3 w-fit mx-auto mb-4">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Security First</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Detect vulnerabilities and security issues before they reach production
            </p>
          </Card>
          
          <Card className="bg-slate-800/80 border-slate-700 p-6 text-center hover:bg-slate-800 transition-all duration-200">
            <div className="bg-blue-600/20 rounded-lg p-3 w-fit mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Get instant feedback on every pull request with sub-second analysis
            </p>
          </Card>
          
          <Card className="bg-slate-800/80 border-slate-700 p-6 text-center hover:bg-slate-800 transition-all duration-200">
            <div className="bg-purple-600/20 rounded-lg p-3 w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Team Ready</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Built for teams with advanced collaboration and reporting features
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}