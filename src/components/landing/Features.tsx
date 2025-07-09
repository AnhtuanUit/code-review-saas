import { Card } from '@/components/ui/card';
import { 
  Bug, 
  Shield, 
  Zap, 
  GitBranch, 
  Bell, 
  BarChart3, 
  Settings, 
  Users,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: Bug,
    title: 'Bug Detection',
    description: 'Advanced static analysis to catch bugs, logic errors, and potential runtime issues before they impact users.',
    color: 'text-red-400'
  },
  {
    icon: Shield,
    title: 'Security Scanning',
    description: 'Comprehensive security analysis to identify vulnerabilities, unsafe patterns, and compliance issues.',
    color: 'text-green-400'
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Identify performance bottlenecks, memory leaks, and optimization opportunities in your codebase.',
    color: 'text-yellow-400'
  },
  {
    icon: GitBranch,
    title: 'Git Integration',
    description: 'Seamless integration with GitHub, GitLab, and Bitbucket. Automatic analysis on every pull request.',
    color: 'text-cyan-400'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get notified about critical issues via Slack, email, or webhook. Customizable alert thresholds.',
    color: 'text-blue-400'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Detailed reports on code quality trends, team performance, and technical debt over time.',
    color: 'text-purple-400'
  },
  {
    icon: Settings,
    title: 'Custom Rules',
    description: 'Create custom linting rules and coding standards specific to your team and project requirements.',
    color: 'text-orange-400'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Review assignments, code discussions, and team-wide quality metrics in one centralized platform.',
    color: 'text-indigo-400'
  },
  {
    icon: Clock,
    title: 'Historical Analysis',
    description: 'Track code quality improvements over time and identify patterns in your development process.',
    color: 'text-teal-400'
  }
];

export function Features() {
  return (
    <section id="features" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="container mx-auto max-w-6xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need for
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}Perfect Code
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools your team needs to maintain 
            high-quality code and accelerate development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 group-hover:bg-slate-700/70 transition-colors">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}