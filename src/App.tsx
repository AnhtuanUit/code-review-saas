import { useAuth } from "@/hooks/useAuth";
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
import { Toaster } from "@/components/ui/sonner";

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
	const navigate = useNavigate();

	const handleSuccessContinue = () => {
		navigate("/dashboard");
	};

	const handleSignOut = async () => {
		navigate("/");
	};

	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage isAuthenticated={!!user} />} />
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
