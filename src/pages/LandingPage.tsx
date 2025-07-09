import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { PricingSection } from "@/components/landing/PricingSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface LandingPageProps {
	isAuthenticated?: boolean;
}

export function LandingPage({ isAuthenticated = false }: LandingPageProps) {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen w-full bg-slate-900">
			<Header isAuthenticated={isAuthenticated} />
			<Hero
				onGetStarted={() =>
					supabase.auth.signInWithOAuth({ provider: "github" })
				}
			/>
			{isAuthenticated && (
				<div className="flex justify-center mt-6">
					<button
						className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-lg text-lg transition-all duration-200"
						onClick={() => navigate("/dashboard")}
					>
						Go to Dashboard
					</button>
				</div>
			)}
			<Features />
			<PricingSection
				onAuthRequired={() =>
					supabase.auth.signInWithOAuth({ provider: "github" })
				}
				isAuthenticated={isAuthenticated}
			/>
			<Testimonials />
			<FAQ />
			<Footer />
		</div>
	);
}
