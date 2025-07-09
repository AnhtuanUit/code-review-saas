import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
	isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-2">
						<Code2 className="h-8 w-8 text-cyan-400" />
						<span className="text-xl font-bold text-white">CodeReview</span>
					</div>

					<nav className="hidden md:flex items-center gap-8">
						<a
							href="#features"
							className="text-slate-300 hover:text-cyan-400 transition-colors"
						>
							Features
						</a>
						<a
							href="#pricing"
							className="text-slate-300 hover:text-cyan-400 transition-colors"
						>
							Pricing
						</a>
						<a
							href="#testimonials"
							className="text-slate-300 hover:text-cyan-400 transition-colors"
						>
							Testimonials
						</a>
						<a
							href="#faq"
							className="text-slate-300 hover:text-cyan-400 transition-colors"
						>
							FAQ
						</a>
					</nav>

					<div className="hidden md:flex items-center gap-4">
						{isAuthenticated ? (
							<Button
								variant="default"
								className="bg-cyan-600 hover:bg-cyan-700"
								onClick={() => navigate("/dashboard")}
							>
								Dashboard
							</Button>
						) : (
							<Button
								onClick={() =>
									supabase.auth.signInWithOAuth({ provider: "github" })
								}
								className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
							>
								<Github className="h-4 w-4" />
								Sign in with GitHub
							</Button>
						)}
					</div>

					<button
						className="md:hidden p-2 text-slate-400 hover:text-white"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-slate-800">
						<nav className="flex flex-col gap-4">
							<a
								href="#features"
								className="text-slate-300 hover:text-cyan-400 transition-colors"
							>
								Features
							</a>
							<a
								href="#pricing"
								className="text-slate-300 hover:text-cyan-400 transition-colors"
							>
								Pricing
							</a>
							<a
								href="#testimonials"
								className="text-slate-300 hover:text-cyan-400 transition-colors"
							>
								Testimonials
							</a>
							<a
								href="#faq"
								className="text-slate-300 hover:text-cyan-400 transition-colors"
							>
								FAQ
							</a>
							<Button
								onClick={() =>
									supabase.auth.signInWithOAuth({ provider: "github" })
								}
								className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 w-fit"
							>
								<Github className="h-4 w-4" />
								Sign in with GitHub
							</Button>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
