import { useState } from "react";
import {
	Routes,
	Route,
	Navigate,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { SuccessPage } from "@/pages/SuccessPage";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ children }: { children: JSX.Element }) {
	const { user, loading } = useAuth();
	const location = useLocation();
	if (loading) {
		return (
			<div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</div>
		);
	}
	if (!user) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}
	return children;
}

export default function App() {
	const { user } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const navigate = useNavigate();

	const handleAuthSuccess = () => {
		setShowAuthModal(false);
		navigate("/dashboard");
	};

	const handleSignOut = async () => {
		navigate("/");
	};

	const handleAuthClick = () => {
		setShowAuthModal(true);
	};

	const handleSuccessContinue = () => {
		navigate("/dashboard");
	};

	return (
		<>
			{showAuthModal && <AuthFlow onSuccess={handleAuthSuccess} />}
			<Routes>
				<Route
					path="/"
					element={
						<LandingPage
							onAuthClick={handleAuthClick}
							isAuthenticated={!!user}
						/>
					}
				/>
				<Route
					path="/success"
					element={<SuccessPage onContinue={handleSuccessContinue} />}
				/>
				<Route
					path="/dashboard/*"
					element={
						<ProtectedRoute>
							{user ? (
								<DashboardPage user={user} onSignOut={handleSignOut} />
							) : (
								<Navigate to="/" replace />
							)}
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster />
		</>
	);
}
