import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Building } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for individual developers and small projects',
    icon: Zap,
    features: [
      'Up to 3 repositories',
      'Basic code quality checks',
      'Pull request analysis',
      'Email notifications',
      'Community support',
      'Basic reporting'
    ],
    limitations: [
      'Limited to 100 PRs/month',
      'Standard rules only',
      'No custom rules'
    ]
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'For growing teams that need advanced features',
    icon: Crown,
    popular: true,
    features: [
      'Unlimited repositories',
      'Advanced security scanning',
      'Custom rules & configurations',
      'Team collaboration tools',
      'Slack/Teams integration',
      'Priority support',
      'Advanced analytics',
      'Historical tracking',
      'API access'
    ],
    limitations: []
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For large organizations with custom requirements',
    icon: Building,
    features: [
      'Everything in Pro',
      'Single Sign-On (SSO)',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantees',
      'On-premise deployment',
      'Advanced compliance',
      'Custom training',
      'Multi-tenant support'
    ],
    limitations: []
  }
];

interface PricingProps {
  onGetStarted: () => void;
}

export function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section id="pricing" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
      <div className="container mx-auto max-w-6xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Start free and scale as your team grows. All plans include our core features 
            with no setup fees or hidden costs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`
                  p-8 relative overflow-hidden transition-all duration-300
                  ${plan.popular 
                    ? 'bg-slate-800/90 border-cyan-500/50 transform scale-105 shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-800/90 border-slate-600 hover:bg-slate-700/90 hover:border-slate-500'
                  }
                `}
              >
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-cyan-600 text-white font-medium">
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`
                      p-3 rounded-lg
                      ${plan.popular 
                        ? 'bg-cyan-600/20 text-cyan-400' 
                        : 'bg-slate-700/50 text-slate-400'
                      }
                    `}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-slate-400 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`
                    w-full font-medium
                    ${plan.popular 
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }
                  `}
                  onClick={onGetStarted}
                >
                  {plan.name === 'Free' ? 'Start Free' : 'Start Trial'}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}