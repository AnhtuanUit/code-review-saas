import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PullRequestsPage } from "@/components/dashboard/PullRequestsPage";
import { RepositoriesPage } from "@/components/dashboard/RepositoriesPage";
import { StatsPage } from "@/components/dashboard/StatsPage";
import { SettingsPage } from "@/components/dashboard/SettingsPage";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

interface DashboardPageProps {
	user: User;
	onSignOut: () => void;
}

export function DashboardPage({ user, onSignOut }: DashboardPageProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const tab = location.pathname.split("/")[2] || "dashboard";
	const { signOut } = useAuth();

	const handleSignOut = async () => {
		await signOut();
		onSignOut();
	};

	const renderContent = () => {
		switch (tab) {
			case "dashboard":
				return (
					<DashboardOverview onNavigate={(t) => navigate(`/dashboard/${t}`)} />
				);
			case "prs":
				return <PullRequestsPage />;
			case "repos":
				return <RepositoriesPage />;
			case "stats":
				return <StatsPage />;
			case "settings":
				return <SettingsPage />;
			default:
				return (
					<DashboardOverview onNavigate={(t) => navigate(`/dashboard/${t}`)} />
				);
		}
	};

	return (
		<div className="min-h-screen w-full bg-slate-900 flex">
			<Sidebar
				user={user}
				activeTab={tab}
				onTabChange={(t) => navigate(`/dashboard/${t}`)}
				onSignOut={handleSignOut}
			/>
			<main className="flex-1 overflow-auto bg-slate-900">
				<div className="p-6">{renderContent()}</div>
			</main>
		</div>
	);
}
