import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	GitPullRequest,
	Bug,
	Shield,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Clock,
	ArrowRight,
} from "lucide-react";
import { PullRequest } from "@/types";
import { mockPullRequests } from "@/lib/mockData";

interface DashboardOverviewProps {
	onNavigate: (tab: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
	const getStatusIcon = (status: PullRequest["status"]) => {
		switch (status) {
			case "approved":
				return <CheckCircle className="h-4 w-4 text-green-400" />;
			case "needs_work":
				return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
			case "failed":
				return <XCircle className="h-4 w-4 text-red-400" />;
			default:
				return <Clock className="h-4 w-4 text-blue-400" />;
		}
	};

	const getStatusColor = (status: PullRequest["status"]) => {
		switch (status) {
			case "approved":
				return "bg-green-600/20 text-green-400 border-green-600/30";
			case "needs_work":
				return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
			case "failed":
				return "bg-red-600/20 text-red-400 border-red-600/30";
			default:
				return "bg-blue-600/20 text-blue-400 border-blue-600/30";
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
				<p className="text-slate-400">
					Overview of your code review activity and recent pull requests
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="bg-slate-800/50 border-slate-700 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-blue-600/20 rounded-lg p-3">
							<GitPullRequest className="h-6 w-6 text-blue-400" />
						</div>
						<span className="text-2xl font-bold text-white">24</span>
					</div>
					<h3 className="text-sm font-medium text-slate-300 mb-1">
						Active PRs
					</h3>
					<p className="text-xs text-slate-500">+3 from last week</p>
				</Card>

				<Card className="bg-slate-800/50 border-slate-700 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-red-600/20 rounded-lg p-3">
							<Bug className="h-6 w-6 text-red-400" />
						</div>
						<span className="text-2xl font-bold text-white">8</span>
					</div>
					<h3 className="text-sm font-medium text-slate-300 mb-1">
						Issues Found
					</h3>
					<p className="text-xs text-slate-500">-2 from yesterday</p>
				</Card>

				<Card className="bg-slate-800/50 border-slate-700 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-green-600/20 rounded-lg p-3">
							<Shield className="h-6 w-6 text-green-400" />
						</div>
						<span className="text-2xl font-bold text-white">96%</span>
					</div>
					<h3 className="text-sm font-medium text-slate-300 mb-1">
						Quality Score
					</h3>
					<p className="text-xs text-slate-500">+4% this month</p>
				</Card>

				<Card className="bg-slate-800/50 border-slate-700 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-purple-600/20 rounded-lg p-3">
							<CheckCircle className="h-6 w-6 text-purple-400" />
						</div>
						<span className="text-2xl font-bold text-white">156</span>
					</div>
					<h3 className="text-sm font-medium text-slate-300 mb-1">
						PRs Reviewed
					</h3>
					<p className="text-xs text-slate-500">This month</p>
				</Card>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<Card className="bg-slate-800/50 border-slate-700">
					<div className="p-6 border-b border-slate-700">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-white">
								Recent Pull Requests
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onNavigate("prs")}
								className="text-cyan-400 hover:text-cyan-300"
							>
								View All
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</div>
					<div className="divide-y divide-slate-700">
						{mockPullRequests.slice(0, 4).map((pr) => (
							<div
								key={pr.id}
								className="p-4 hover:bg-slate-800/30 transition-colors"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1 min-w-0">
										<h4 className="text-sm font-medium text-white truncate">
											{pr.title}
										</h4>
										<p className="text-xs text-slate-400 mt-1">
											{pr.repository} • #{pr.number} • {pr.branch}
										</p>
									</div>
									<div className="flex items-center gap-2 ml-4">
										{getStatusIcon(pr.status)}
										<Badge
											variant="outline"
											className={getStatusColor(pr.status)}
										>
											{pr.status.replace("_", " ")}
										</Badge>
									</div>
								</div>
								<div className="flex items-center gap-4 text-xs text-slate-500">
									<span>{pr.linesChanged} lines changed</span>
									<span>{pr.issuesCount} issues</span>
									<span>{new Date(pr.lastRun).toLocaleDateString()}</span>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card className="bg-slate-800/50 border-slate-700">
					<div className="p-6 border-b border-slate-700">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-white">
								Quick Actions
							</h3>
						</div>
					</div>
					<div className="p-6 space-y-4">
						<Button
							variant="outline"
							className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
							onClick={() => onNavigate("repos")}
						>
							<GitPullRequest className="h-4 w-4 mr-2" />
							Connect New Repository
						</Button>
						<Button
							variant="outline"
							className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
							onClick={() => onNavigate("stats")}
						>
							<Bug className="h-4 w-4 mr-2" />
							View Code Issues
						</Button>
						<Button
							variant="outline"
							className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
							onClick={() => onNavigate("settings")}
						>
							<Shield className="h-4 w-4 mr-2" />
							Configure Rules
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
