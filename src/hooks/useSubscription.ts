import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getProductByPriceId } from "@/stripe-config";

export interface UserSubscription {
	customer_id: string;
	subscription_id: string | null;
	subscription_status:
		| "not_started"
		| "incomplete"
		| "incomplete_expired"
		| "trialing"
		| "active"
		| "past_due"
		| "canceled"
		| "unpaid"
		| "paused";
	price_id: string | null;
	current_period_start: number | null;
	current_period_end: number | null;
	cancel_at_period_end: boolean;
	payment_method_brand: string | null;
	payment_method_last4: string | null;
	product_name?: string;
}

async function fetchSubscription(): Promise<UserSubscription | null> {
	const { data, error } = await supabase
		.from("stripe_user_subscriptions")
		.select("*")
		.maybeSingle();

	if (error) throw error;
	if (data) {
		const product = data.price_id ? getProductByPriceId(data.price_id) : null;
		return {
			...data,
			product_name: product?.name || "Unknown Plan",
		};
	}
	return null;
}

async function createCheckoutSessionFn({
	priceId,
	mode,
}: {
	priceId: string;
	mode?: "payment" | "subscription";
}) {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (!session?.access_token) {
		throw new Error("No authentication token found");
	}
	const response = await fetch(
		`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				price_id: priceId,
				mode: mode || "subscription",
				success_url: `${window.location.origin}/success`,
				cancel_url: `${window.location.origin}/pricing`,
			}),
		}
	);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to create checkout session");
	}
	const { url } = await response.json();
	if (url) {
		window.location.href = url;
	} else {
		throw new Error("No checkout URL received");
	}
}

export function useSubscription() {
	const queryClient = useQueryClient();
	const {
		data: subscription,
		isLoading: loading,
		error,
		refetch,
	} = useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription });

	const { mutateAsync: createCheckoutSession, isPending: isCheckoutLoading } =
		useMutation({
			mutationFn: createCheckoutSessionFn,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["subscription"] });
			},
		});

	return {
		subscription,
		loading,
		error,
		createCheckoutSession: async (
			priceId: string,
			mode?: "payment" | "subscription"
		) => {
			await createCheckoutSession({ priceId, mode });
		},
		refreshSubscription: refetch,
		isCheckoutLoading: isCheckoutLoading,
	};
}
