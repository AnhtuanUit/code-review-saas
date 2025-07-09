import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchSession() {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session?.user ?? null;
}

export function useAuth() {
	const queryClient = useQueryClient();
	const {
		data: user,
		isLoading: loading,
		refetch,
	} = useQuery({
		queryKey: ["authUser"],
		queryFn: fetchSession,
	});

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		});
		return () => subscription.unsubscribe();
	}, [queryClient]);

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		await refetch();
		return { data, error };
	};

	const signUp = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: undefined, // Disable email confirmation
			},
		});
		await refetch();
		return { data, error };
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		await refetch();
		return { error };
	};

	return {
		user,
		loading,
		signIn,
		signUp,
		signOut,
	};
}
