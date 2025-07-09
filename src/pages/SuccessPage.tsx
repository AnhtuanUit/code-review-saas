import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface SuccessPageProps {
  onContinue: () => void;
}

export function SuccessPage({ onContinue }: SuccessPageProps) {
  const { subscription, refreshSubscription } = useSubscription();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    // Refresh subscription data after successful payment
    const refreshData = async () => {
      setIsRefreshing(true);
      // Wait a bit for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      refreshSubscription();
      setIsRefreshing(false);
    };

    refreshData();
  }, [refreshSubscription]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-center">
        <div className="p-8">
          <div className="mb-6">
            <div className="bg-green-600/20 rounded-full p-4 w-fit mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-slate-300">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>
          </div>

          {isRefreshing ? (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating your account...</span>
              </div>
            </div>
          ) : subscription && subscription.subscription_status === 'active' ? (
            <div className="mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-1">Active Plan</h3>
                <p className="text-cyan-400 font-semibold">
                  {subscription.product_name || 'Pro Plan'}
                </p>
                {subscription.current_period_end && (
                  <p className="text-slate-400 text-sm mt-1">
                    Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  Your subscription is being activated. This may take a few moments.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={onContinue}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Continue to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <p className="text-slate-400 text-sm">
              You can manage your subscription in your account settings.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}