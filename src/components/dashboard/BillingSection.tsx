import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Crown, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';

export function BillingSection() {
  const { subscription, loading, error, createCheckoutSession } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      // Upgrade to Pro plan
      await createCheckoutSession('price_1RirObHS9ff337QLCFAAHvLl', 'subscription');
    } catch (err) {
      console.error('Error upgrading:', err);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          <span className="ml-2 text-slate-300">Loading billing information...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <Alert className="border-red-600/30 bg-red-600/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            Failed to load billing information: {error}
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  const isActive = subscription?.subscription_status === 'active';
  const isFree = !subscription?.price_id || !isActive;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Current Plan</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white font-medium text-lg">
                {subscription?.product_name || 'Free Plan'}
              </h4>
              <p className="text-slate-400 text-sm">
                {isFree 
                  ? 'Basic features with limited usage' 
                  : 'Full access to all premium features'
                }
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={
                isActive 
                  ? 'bg-green-600/20 text-green-400 border-green-600/30' 
                  : 'bg-slate-600/20 text-slate-400 border-slate-600/30'
              }
            >
              {isActive ? 'Active' : 'Free'}
            </Badge>
          </div>

          {isActive && subscription && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 capitalize">
                    {subscription.subscription_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {subscription.current_period_end && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Next billing date</span>
                  <span className="text-white">
                    {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}

              {subscription.cancel_at_period_end && (
                <Alert className="border-yellow-600/30 bg-yellow-600/20">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-400">
                    Your subscription will cancel at the end of the current billing period.
                  </AlertDescription>
                </Alert>
              )}

              {subscription.payment_method_last4 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Payment method</span>
                  <span className="text-white">
                    {subscription.payment_method_brand?.toUpperCase()} •••• {subscription.payment_method_last4}
                  </span>
                </div>
              )}
            </div>
          )}

          {isFree && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-600/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Get unlimited repositories, advanced features, and priority support
                </p>
                <Button 
                  size="sm" 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  onClick={handleUpgrade}
                  disabled={upgrading}
                >
                  {upgrading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {upgrading ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </div>

              <div className="text-xs text-slate-400">
                <h5 className="font-medium text-slate-300 mb-2">Current plan includes:</h5>
                <ul className="space-y-1">
                  <li>• Up to 3 repositories</li>
                  <li>• Basic code quality checks</li>
                  <li>• Community support</li>
                  <li>• Limited to 100 PRs/month</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>

      {isActive && (
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Usage This Month</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pull Requests Analyzed</span>
                <span className="text-white font-medium">24 / Unlimited</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Repositories Connected</span>
                <span className="text-white font-medium">8 / Unlimited</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">API Calls</span>
                <span className="text-white font-medium">1,247 / Unlimited</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}