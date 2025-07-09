import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CheckCircle,
	AlertTriangle,
	XCircle,
	Clock,
	Search,
	Filter,
	Eye,
	GitBranch,
	User,
} from "lucide-react";
import { PullRequest, CodeIssue } from "@/types";
import { supabase } from "@/lib/supabase";

export function PullRequestsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);

	// Fetch all pull requests across all repos
	const {
		data: pullRequests,
		isLoading,
		error,
		refetch,
	} = useQuery<PullRequest[]>({
		queryKey: ["pullRequests"],
		queryFn: async () => {
			// 1. Get GitHub token
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const githubToken = session?.provider_token;
			if (!githubToken)
				throw new Error("No GitHub token found. Please sign in with GitHub.");

			// 2. Fetch all repos
			const repoRes = await fetch(
				"https://api.github.com/user/repos?per_page=100",
				{
					headers: { Authorization: `token ${githubToken}` },
				}
			);
			if (!repoRes.ok)
				throw new Error("Failed to fetch repositories from GitHub.");
			const repos = await repoRes.json();

			// 3. Fetch PRs for each repo
			const prResults = await Promise.all(
				repos.map(async (repo: any) => {
					const prsRes = await fetch(
						`https://api.github.com/repos/${repo.full_name}/pulls?state=all&per_page=50`,
						{
							headers: { Authorization: `token ${githubToken}` },
						}
					);
					if (!prsRes.ok) return [];
					const prs = await prsRes.json();
					return prs.map((pr: any) => ({
						id: pr.id.toString(),
						number: pr.number,
						title: pr.title,
						repository: repo.name,
						branch: pr.head.ref,
						author: pr.user?.login || "",
						status: "pending", // Default, you can enhance with checks
						lastRun: pr.updated_at || pr.created_at,
						issuesCount: 0, // Placeholder, unless you have code analysis
						linesChanged: (pr.additions || 0) + (pr.deletions || 0),
					}));
				})
			);
			// Flatten
			return prResults.flat();
		},
	});

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

	const getIssueTypeColor = (type: CodeIssue["type"]) => {
		switch (type) {
			case "error":
				return "bg-red-600/20 text-red-400 border-red-600/30";
			case "warning":
				return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
			default:
				return "bg-blue-600/20 text-blue-400 border-blue-600/30";
		}
	};

	// Filter PRs by search and status
	const filteredPRs = (pullRequests || []).filter((pr) => {
		const matchesSearch =
			pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pr.repository.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || pr.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	if (selectedPR) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<Button
							variant="ghost"
							onClick={() => setSelectedPR(null)}
							className="text-slate-400 hover:text-white mb-2"
						>
							← Back to Pull Requests
						</Button>
						<h1 className="text-2xl font-bold text-white">
							{selectedPR.title}
						</h1>
						<p className="text-slate-400">
							{selectedPR.repository} • #{selectedPR.number} •{" "}
							{selectedPR.branch}
						</p>
					</div>
					<div className="flex items-center gap-2">
						{getStatusIcon(selectedPR.status)}
						<Badge
							variant="outline"
							className={getStatusColor(selectedPR.status)}
						>
							{selectedPR.status.replace("_", " ")}
						</Badge>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<Card className="bg-slate-800/50 border-slate-700">
							<div className="p-6 border-b border-slate-700">
								<h3 className="text-lg font-semibold text-white">
									Code Issues
								</h3>
							</div>
							<div className="divide-y divide-slate-700">
								{/* No real code issues from GitHub, so show none or a placeholder */}
								<div className="p-4 text-slate-400">
									No code issues available for this PR.
								</div>
							</div>
						</Card>
					</div>

					<div className="space-y-6">
						<Card className="bg-slate-800/50 border-slate-700 p-6">
							<h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-slate-400">Lines Changed</span>
									<span className="text-white">{selectedPR.linesChanged}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Issues Found</span>
									<span className="text-white">{selectedPR.issuesCount}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Author</span>
									<span className="text-white">{selectedPR.author}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Last Run</span>
									<span className="text-white">
										{new Date(selectedPR.lastRun).toLocaleDateString()}
									</span>
								</div>
							</div>
						</Card>

						<Card className="bg-slate-800/50 border-slate-700 p-6">
							<h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
							<div className="space-y-3">
								<Button
									variant="outline"
									className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
									asChild
								>
									<a
										href={`https://github.com/${selectedPR.repository}/pull/${selectedPR.number}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<GitBranch className="h-4 w-4 mr-2" />
										View on GitHub
									</a>
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
									disabled
								>
									<User className="h-4 w-4 mr-2" />
									Request Review
								</Button>
							</div>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-white mb-2">Pull Requests</h1>
				<p className="text-slate-400">
					Manage and review all pull requests across your repositories
				</p>
			</div>

			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
					<Input
						placeholder="Search pull requests..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 bg-slate-800/50 border-slate-700 text-white"
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700 text-white">
						<Filter className="h-4 w-4 mr-2" />
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="approved">Approved</SelectItem>
						<SelectItem value="needs_work">Needs Work</SelectItem>
						<SelectItem value="failed">Failed</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{isLoading && (
				<div className="text-slate-400">
					Loading pull requests from GitHub...
				</div>
			)}
			{error && <div className="text-red-400">{(error as Error).message}</div>}

			<Card className="bg-slate-800/50 border-slate-700">
				<div className="p-6 border-b border-slate-700">
					<h3 className="text-lg font-semibold text-white">
						{filteredPRs.length} Pull Request
						{filteredPRs.length !== 1 ? "s" : ""}
					</h3>
				</div>
				<div className="divide-y divide-slate-700">
					{filteredPRs.map((pr) => (
						<div
							key={pr.id}
							className="p-4 hover:bg-slate-800/30 transition-colors"
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-medium text-white mb-1">
										{pr.title}
									</h4>
									<p className="text-xs text-slate-400">
										{pr.repository} • #{pr.number} • {pr.branch} • by{" "}
										{pr.author}
									</p>
								</div>
								<div className="flex items-center gap-2 ml-4">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedPR(pr)}
										className="text-cyan-400 hover:text-cyan-300"
									>
										<Eye className="h-4 w-4 mr-1" />
										View
									</Button>
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
								<span>{pr.issuesCount} issues found</span>
								<span>
									Last run: {new Date(pr.lastRun).toLocaleDateString()}
								</span>
							</div>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}
