import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Check,
	Crown,
	Zap,
	Building,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

const plans = [
	{
		name: "Free",
		price: 0,
		period: "forever",
		description: "Perfect for individual developers and small projects",
		icon: Zap,
		features: [
			"Up to 3 repositories",
			"Basic code quality checks",
			"Pull request analysis",
			"Email notifications",
			"Community support",
			"Basic reporting",
		],
		limitations: [
			"Limited to 100 PRs/month",
			"Standard rules only",
			"No custom rules",
		],
	},
	{
		name: "CodeReview Pro",
		price: 29,
		period: "month",
		description: "For growing teams that need advanced features",
		icon: Crown,
		popular: true,
		priceId: "price_1RirObHS9ff337QLCFAAHvLl",
		features: [
			"Unlimited repositories",
			"Advanced security scanning",
			"Custom rules & configurations",
			"Team collaboration tools",
			"Slack/Teams integration",
			"Priority support",
			"Advanced analytics",
			"Historical tracking",
			"API access",
		],
		limitations: [],
	},
	{
		name: "Enterprise",
		price: 99,
		period: "month",
		description: "For large organizations with custom requirements",
		icon: Building,
		priceId: "price_1RirPkHS9ff337QL0G7ke7Zw",
		features: [
			"Everything in Pro",
			"Single Sign-On (SSO)",
			"Custom integrations",
			"Dedicated support",
			"SLA guarantees",
			"On-premise deployment",
			"Advanced compliance",
			"Custom training",
			"Multi-tenant support",
		],
		limitations: [],
	},
];

interface PricingSectionProps {
	onAuthRequired: () => void;
	isAuthenticated: boolean;
}

export function PricingSection({
	onAuthRequired,
	isAuthenticated,
}: PricingSectionProps) {
	const { createCheckoutSession, subscription, isCheckoutLoading } =
		useSubscription();
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handlePlanSelect = async (plan: (typeof plans)[0]) => {
		if (!isAuthenticated) {
			onAuthRequired();
			return;
		}

		if (!plan.priceId) {
			// Free plan - no action needed
			return;
		}

		// Check if user already has this plan
		if (
			subscription?.price_id === plan.priceId &&
			subscription.subscription_status === "active"
		) {
			return;
		}

		setLoadingPlan(plan.name);
		setError(null);

		try {
			await createCheckoutSession(plan.priceId, "subscription");
		} catch (err) {
			console.error("Error creating checkout session:", err);
			setError(
				err instanceof Error ? err.message : "Failed to start checkout process"
			);
		} finally {
			setLoadingPlan(null);
		}
	};

	const isCurrentPlan = (plan: (typeof plans)[0]) => {
		if (!subscription) return false;
		if (
			plan.name === "Free" &&
			(!subscription.price_id || subscription.subscription_status !== "active")
		) {
			return true;
		}
		return (
			subscription.price_id === plan.priceId &&
			subscription.subscription_status === "active"
		);
	};

	const getButtonText = (plan: (typeof plans)[0]) => {
		if (loadingPlan === plan.name || isCheckoutLoading) {
			return "Processing...";
		}

		if (isCurrentPlan(plan)) {
			return "Current Plan";
		}

		if (plan.name === "Free") {
			return "Current Plan";
		}

		return isAuthenticated ? "Upgrade Now" : "Get Started";
	};

	return (
		<section
			id="pricing"
			className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-800"
		>
			<div className="container mx-auto max-w-6xl w-full">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Choose Your
						<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
							{" "}
							Perfect Plan
						</span>
					</h2>
					<p className="text-xl text-slate-300 max-w-3xl mx-auto">
						Start free and scale as your team grows. All plans include our core
						features with no setup fees or hidden costs.
					</p>
				</div>

				{error && (
					<div className="max-w-md mx-auto mb-8">
						<Alert className="border-red-600/30 bg-red-600/20">
							<AlertCircle className="h-4 w-4 text-red-400" />
							<AlertDescription className="text-red-400">
								{error}
							</AlertDescription>
						</Alert>
					</div>
				)}

				<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
					{plans.map((plan) => {
						const Icon = plan.icon;
						const isLoading = loadingPlan === plan.name;
						const isCurrent = isCurrentPlan(plan);

						return (
							<Card
								key={plan.name}
								className={`
                  p-8 relative overflow-hidden transition-all duration-300
                  ${
										plan.popular
											? "bg-slate-800/90 border-cyan-500/50 transform scale-105 shadow-lg shadow-cyan-500/10"
											: "bg-slate-800/90 border-slate-600 hover:bg-slate-700/90 hover:border-slate-500"
									}
                  ${isCurrent ? "ring-2 ring-green-500/50" : ""}
                `}
							>
								{plan.popular && (
									<Badge className="absolute top-4 right-4 bg-cyan-600 text-white font-medium">
										Most Popular
									</Badge>
								)}

								{isCurrent && (
									<Badge className="absolute top-4 left-4 bg-green-600 text-white font-medium">
										Current
									</Badge>
								)}

								<div className="text-center mb-8">
									<div className="flex justify-center mb-4">
										<div
											className={`
                      p-3 rounded-lg
                      ${
												plan.popular
													? "bg-cyan-600/20 text-cyan-400"
													: "bg-slate-700/50 text-slate-400"
											}
                    `}
										>
											<Icon className="h-6 w-6" />
										</div>
									</div>
									<h3 className="text-2xl font-bold text-white mb-2">
										{plan.name}
									</h3>
									<p className="text-slate-300 text-sm mb-4 leading-relaxed">
										{plan.description}
									</p>
									<div className="flex items-baseline justify-center">
										<span className="text-4xl font-bold text-white">
											${plan.price}
										</span>
										<span className="text-slate-400 ml-2">/{plan.period}</span>
									</div>
								</div>

								<div className="space-y-4 mb-8">
									{plan.features.map((feature, index) => (
										<div key={index} className="flex items-start gap-3">
											<Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
											<span className="text-slate-300 text-sm leading-relaxed">
												{feature}
											</span>
										</div>
									))}
								</div>

								<Button
									className={`
                    w-full font-medium
                    ${
											plan.popular
												? "bg-cyan-600 hover:bg-cyan-700 text-white"
												: "bg-slate-700 hover:bg-slate-600 text-white"
										}
                    ${isCurrent ? "bg-green-600 hover:bg-green-700" : ""}
                  `}
									onClick={() => handlePlanSelect(plan)}
									disabled={isLoading || isCurrent}
								>
									{isLoading && (
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									)}
									{getButtonText(plan)}
								</Button>
							</Card>
						);
					})}
				</div>

				<div className="text-center mt-12">
					<p className="text-slate-400 text-sm">
						All plans include a 14-day free trial. No credit card required for
						free plan.
					</p>
				</div>
			</div>
		</section>
	);
}
