import { useState, useEffect } from "react";
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
import { PullRequest } from "@/types";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/ui/avatar";
// No static import for diff2html
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import "diff2html/bundles/css/diff2html.min.css";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

// Type definitions for GitHub API responses (partial, for linter)
type GitHubUser = { login: string; avatar_url: string };
type GitHubPRDetails = {
	state: string;
	merged_at?: string | null;
	user?: GitHubUser;
	created_at?: string;
	html_url?: string;
	body?: string;
	base?: { sha: string; repo: { full_name: string } };
	head?: { sha: string; repo: { full_name: string } };
};
type GitHubCommit = {
	sha: string;
	author?: GitHubUser;
	commit: {
		message: string;
		author?: { name: string; date: string };
	};
};
type GitHubFile = {
	sha: string;
	filename: string;
	additions: number;
	deletions: number;
	changes: number;
	patch?: string; // Added patch property
	status?: string; // Added status property
};
type GitHubTimelineEvent = {
	event: string;
	actor?: GitHubUser;
	created_at?: string;
	body?: string;
};

interface LintIssue {
	id: string;
	rule: string;
	severity: "error" | "warning" | "info";
	file: string;
	line: number;
	description: string;
	suggestion?: string;
}

// Minimal type for GitHub repo API response
type GitHubRepo = {
	id: number;
	name: string;
	full_name: string;
};

// Minimal type for GitHub PR API response
type GitHubPR = {
	id: number;
	number: number;
	title: string;
	head: { ref: string };
	user?: { login: string };
	state: string;
	merged_at?: string | null;
	updated_at?: string;
	created_at?: string;
	additions?: number;
	deletions?: number;
};

export function PullRequestsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
	const [prDetails, setPrDetails] = useState<GitHubPRDetails | null>(null);
	const [prCommits, setPrCommits] = useState<GitHubCommit[]>([]);
	const [prFiles, setPrFiles] = useState<GitHubFile[]>([]);
	const [prTimeline, setPrTimeline] = useState<GitHubTimelineEvent[]>([]);
	const [isDetailsLoading, setIsDetailsLoading] = useState(false);
	const [detailsError, setDetailsError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<
		"conversation" | "commits" | "files"
	>("conversation");

	useEffect(() => {
		if (prFiles.length > 0) {
			(async () => {
				const htmls: Record<string, string> = {};
				for (const file of prFiles) {
					if (file.patch) {
						const mod = await import("diff2html");
						// @ts-expect-error: getPrettyHtml exists at runtime
						htmls[file.sha] = mod.Diff2Html.getPrettyHtml(file.patch, {
							inputFormat: "diff",
							showFiles: false,
							matching: "lines",
							outputFormat: "side-by-side",
							drawFileList: false,
							highlight: true,
						});
					}
				}
			})();
		}
	}, [prFiles]);

	useEffect(() => {
		if (!selectedPR) return;
		const fetchDetails = async () => {
			setIsDetailsLoading(true);
			setDetailsError(null);
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				const githubToken = session?.provider_token;
				if (!githubToken) throw new Error("No GitHub token found.");
				// Find repo full_name
				const repoRes = await fetch(
					`https://api.github.com/user/repos?per_page=100`,
					{ headers: { Authorization: `token ${githubToken}` } }
				);
				const repos: GitHubRepo[] = await repoRes.json();
				const repo = (Array.isArray(repos) ? repos : []).find(
					(r: GitHubRepo) =>
						typeof r === "object" &&
						r !== null &&
						"name" in r &&
						r.name === selectedPR.repository
				);
				if (!repo) throw new Error("Repository not found");
				const fullName = repo.full_name;
				// Fetch PR details
				const prRes = await fetch(
					`https://api.github.com/repos/${fullName}/pulls/${selectedPR.number}`,
					{ headers: { Authorization: `token ${githubToken}` } }
				);
				const prData: GitHubPRDetails = await prRes.json();
				setPrDetails(prData);
				// Fetch commits
				const commitsRes = await fetch(
					`https://api.github.com/repos/${fullName}/pulls/${selectedPR.number}/commits`,
					{ headers: { Authorization: `token ${githubToken}` } }
				);
				setPrCommits((await commitsRes.json()) as GitHubCommit[]);
				// Fetch files
				const filesRes = await fetch(
					`https://api.github.com/repos/${fullName}/pulls/${selectedPR.number}/files`,
					{ headers: { Authorization: `token ${githubToken}` } }
				);
				setPrFiles((await filesRes.json()) as GitHubFile[]);
				// Fetch timeline (events & comments)
				const timelineRes = await fetch(
					`https://api.github.com/repos/${fullName}/issues/${selectedPR.number}/timeline`,
					{
						headers: {
							Authorization: `token ${githubToken}`,
							Accept: "application/vnd.github.mockingbird-preview+json",
						},
					}
				);
				setPrTimeline((await timelineRes.json()) as GitHubTimelineEvent[]);
			} catch (e: unknown) {
				if (
					typeof e === "object" &&
					e !== null &&
					"message" in e &&
					typeof (e as { message: unknown }).message === "string"
				) {
					setDetailsError(
						(e as { message: string }).message || "Failed to load PR details"
					);
				} else {
					setDetailsError("Failed to load PR details");
				}
			} finally {
				setIsDetailsLoading(false);
			}
		};
		fetchDetails();
	}, [selectedPR]);

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

	function mapGitHubStatusToPRStatus(pr: GitHubPR): PullRequest["status"] {
		if (pr.state === "open") return "pending";
		if (pr.state === "closed" && pr.merged_at) return "approved";
		if (pr.state === "closed") return "failed";
		return "pending";
	}

	const { data: pullRequests } = useQuery<PullRequest[]>({
		queryKey: ["pullRequests"],
		queryFn: async (): Promise<PullRequest[]> => {
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
			const repos: GitHubRepo[] = await repoRes.json();

			// 3. Fetch PRs for each repo
			const prResults = await Promise.all(
				repos.map(async (repo: GitHubRepo) => {
					const prsRes = await fetch(
						`https://api.github.com/repos/${repo.full_name}/pulls?state=all&per_page=50`,
						{
							headers: { Authorization: `token ${githubToken}` },
						}
					);
					if (!prsRes.ok) return [];
					const prs: GitHubPR[] = await prsRes.json();
					return prs.map((pr: GitHubPR) => ({
						id: pr.id.toString(),
						number: pr.number,
						title: pr.title,
						repository: repo.name,
						branch: pr.head.ref,
						author: pr.user?.login || "",
						status: mapGitHubStatusToPRStatus(pr),
						lastRun: String(pr.updated_at || pr.created_at || ''),
						issuesCount: 0, // Placeholder, unless you have code analysis
						linesChanged: (pr.additions || 0) + (pr.deletions || 0),
					}));
				})
			);
			// Flatten
			return prResults.flat();
		},
	});

	// Filter PRs by search and status
	const filteredPRs = (pullRequests || []).filter((pr: PullRequest) => {
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
						<h1 className="text-2xl font-bold text-white flex items-center gap-2">
							{selectedPR.title}
							{prDetails?.state === "open" && (
								<Badge className="bg-green-600 text-white ml-2">Open</Badge>
							)}
							{prDetails?.merged_at && (
								<Badge className="bg-purple-600 text-white ml-2">Merged</Badge>
							)}
							{prDetails?.state === "closed" && !prDetails?.merged_at && (
								<Badge className="bg-red-600 text-white ml-2">Closed</Badge>
							)}
						</h1>
						<p className="text-slate-400">
							{selectedPR.repository} • #{selectedPR.number} •{" "}
							{selectedPR.branch}
						</p>
						<div className="flex items-center gap-2 mt-2">
							{prDetails?.user && (
								<Avatar className="h-6 w-6">
									<img
										src={prDetails.user.avatar_url}
										alt={prDetails.user.login}
									/>
								</Avatar>
							)}
							<span className="text-slate-300 text-sm">
								{prDetails?.user?.login || selectedPR.author}
							</span>
							<span className="text-slate-500 text-xs">
								opened{" "}
								{prDetails?.created_at &&
									new Date(prDetails.created_at ?? "").toLocaleString()}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{getStatusIcon(selectedPR.status)}
						<Badge
							variant="outline"
							className={getStatusColor(selectedPR.status)}
						>
							{selectedPR.status.replace("_", " ")}
						</Badge>
						<Button
							asChild
							variant="outline"
							className="ml-2 border-slate-600 text-slate-300 hover:bg-slate-700"
						>
							<a
								href={
									prDetails?.html_url ||
									`https://github.com/${selectedPR.repository}/pull/${selectedPR.number}`
								}
								target="_blank"
								rel="noopener noreferrer"
							>
								View on GitHub
							</a>
						</Button>
					</div>
				</div>

				{/* Tab Bar */}
				<Tabs
					value={activeTab}
					onValueChange={(v) =>
						setActiveTab(v as "conversation" | "commits" | "files")
					}
					className="w-full"
				>
					<TabsList className="mb-4 bg-slate-800 border border-slate-700">
						<TabsTrigger value="conversation">Conversation</TabsTrigger>
						<TabsTrigger value="commits">Commits</TabsTrigger>
						<TabsTrigger value="files">Files changed</TabsTrigger>
					</TabsList>
					<TabsContent value="conversation">
						<div className="grid lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								{/* PR Description */}
								<Card className="bg-slate-800/50 border-slate-700">
									<div className="p-6 border-b border-slate-700">
										<h3 className="text-lg font-semibold text-white mb-2">
											Description
										</h3>
										<div className="prose prose-invert max-w-none text-slate-200">
											{prDetails?.body ? (
												<div style={{ whiteSpace: "pre-line" }}>
													{prDetails.body}
												</div>
											) : (
												<span className="text-slate-400">
													No description provided.
												</span>
											)}
										</div>
									</div>
								</Card>
								{/* Timeline */}
								<Card className="bg-slate-800/50 border-slate-700">
									<div className="p-6 border-b border-slate-700">
										<h3 className="text-lg font-semibold text-white mb-2">
											Timeline
										</h3>
										<div className="space-y-3">
											{isDetailsLoading && (
												<div className="text-slate-400">
													Loading timeline...
												</div>
											)}
											{detailsError && (
												<div className="text-red-400">{detailsError}</div>
											)}
											{!isDetailsLoading &&
												!detailsError &&
												prTimeline.length === 0 && (
													<div className="text-slate-400">
														No timeline events.
													</div>
												)}
											{prTimeline.map((event, idx) => {
												const timelineEvent = event as GitHubTimelineEvent;
												return (
													<div
														key={idx}
														className="flex items-center gap-2 text-sm text-slate-300"
													>
														{/* Icon by event type */}
														{timelineEvent.event === "closed" && (
															<XCircle className="h-4 w-4 text-red-400" />
														)}
														{timelineEvent.event === "merged" && (
															<CheckCircle className="h-4 w-4 text-purple-400" />
														)}
														{timelineEvent.event === "reopened" && (
															<Clock className="h-4 w-4 text-green-400" />
														)}
														{timelineEvent.event === "commented" && (
															<User className="h-4 w-4 text-blue-400" />
														)}
														<span className="font-medium">
															{timelineEvent.actor?.login}
														</span>
														<span>{timelineEvent.event}</span>
														<span className="text-slate-500">
															{timelineEvent.created_at &&
																new Date(
																	timelineEvent.created_at ?? ""
																).toLocaleString()}
														</span>
														{timelineEvent.body && (
															<span className="ml-2 text-slate-400">
																{timelineEvent.body.slice(0, 80)}
																{timelineEvent.body.length > 80 ? "..." : ""}
															</span>
														)}
													</div>
												);
											})}
										</div>
									</div>
								</Card>
								{/* Mock Lint Issues */}
								<Card className="bg-slate-800/50 border-slate-700">
									<div className="p-6 border-b border-slate-700">
										<h3 className="text-lg font-semibold text-white mb-2">
											Lint Issues
										</h3>
										{mockLintIssues.length === 0 ? (
											<div className="text-slate-400">
												No lint issues found.
											</div>
										) : (
											<div className="space-y-4">
												{mockLintIssues.map((issue: LintIssue) => (
													<div
														key={issue.id}
														className="bg-slate-900/60 border border-slate-700 rounded p-4"
													>
														<div className="flex items-center gap-2 mb-2">
															<span className="font-mono text-xs text-cyan-400">
																{issue.rule}
															</span>
															<span
																className={`text-xs px-2 py-0.5 rounded ${
																	issue.severity === "error"
																		? "bg-red-700/40 text-red-400"
																		: "bg-yellow-700/40 text-yellow-400"
																}`}
															>
																{issue.severity}
															</span>
															<span className="text-xs text-slate-400">
																{issue.file}:{issue.line}
															</span>
														</div>
														<div className="prose prose-invert text-slate-200 text-sm mb-2">
															<ReactMarkdown>{issue.description}</ReactMarkdown>
														</div>
														{issue.suggestion && (
															<div className="prose prose-invert text-green-300 text-xs mt-2">
																<strong>Suggestion:</strong>
																<ReactMarkdown>
																	{issue.suggestion}
																</ReactMarkdown>
															</div>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								</Card>
							</div>
							<div className="space-y-6">
								<Card className="bg-slate-800/50 border-slate-700 p-6">
									<h3 className="text-lg font-semibold text-white mb-4">
										Summary
									</h3>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-slate-400">Lines Changed</span>
											<span className="text-white">
												{selectedPR.linesChanged}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Issues Found</span>
											<span className="text-white">
												{selectedPR.issuesCount}
											</span>
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
									<h3 className="text-lg font-semibold text-white mb-4">
										Actions
									</h3>
									<div className="space-y-3">
										<Button
											variant="outline"
											className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
											asChild
										>
											<a
												href={
													prDetails?.html_url ||
													`https://github.com/${selectedPR.repository}/pull/${selectedPR.number}`
												}
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
					</TabsContent>
					<TabsContent value="commits">
						<Card className="bg-slate-800/50 border-slate-700">
							<div className="p-6 border-b border-slate-700">
								<h3 className="text-lg font-semibold text-white mb-2">
									Commits
								</h3>
								<div className="space-y-3">
									{isDetailsLoading && (
										<div className="text-slate-400">Loading commits...</div>
									)}
									{prCommits.length === 0 && !isDetailsLoading && (
										<div className="text-slate-400">No commits found.</div>
									)}
									{prCommits.map((commit) => {
										const prCommit = commit as GitHubCommit;
										return (
											<div
												key={prCommit.sha}
												className="flex items-center gap-2 text-sm text-slate-300"
											>
												<Avatar className="h-5 w-5">
													<img
														src={prCommit.author?.avatar_url}
														alt={prCommit.author?.login}
													/>
												</Avatar>
												<span className="font-mono text-xs text-slate-400">
													{prCommit.sha.slice(0, 7)}
												</span>
												<span className="font-medium">
													{prCommit.commit.message.split("\n")[0]}
												</span>
												<span className="text-slate-500">
													{prCommit.commit.author?.name}
												</span>
												<span className="text-slate-500">
													{new Date(
														prCommit.commit.author?.date ?? ""
													).toLocaleDateString()}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</Card>
					</TabsContent>
					<TabsContent value="files">
						<Card className="bg-slate-800/50 border-slate-700">
							<div className="p-6 border-b border-slate-700">
								<h3 className="text-lg font-semibold text-white mb-2">
									Changed Files
								</h3>
								<div className="space-y-2">
									{isDetailsLoading && (
										<div className="text-slate-400">Loading files...</div>
									)}
									{prFiles.length === 0 && !isDetailsLoading && (
										<div className="text-slate-400">No files changed.</div>
									)}
									{prFiles.map((file) => (
										<div
											key={file.sha}
											className="flex flex-col gap-1 text-xs text-slate-300 mb-4"
										>
											<div className="flex items-center gap-2">
												<span className="font-mono text-slate-400">
													{file.filename}
												</span>
												<span className="text-green-400">
													+{file.additions}
												</span>
												<span className="text-red-400">-{file.deletions}</span>
												<span className="text-slate-500">
													({file.changes} changes)
												</span>
											</div>
											{file.patch ? (
												<pre className="bg-slate-900 text-xs rounded p-2 mt-2 overflow-x-auto border border-slate-700 whitespace-pre-wrap">
													{file.patch}
												</pre>
											) : (
												<div className="text-slate-400">
													No diff available for this file.
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</Card>
					</TabsContent>
				</Tabs>
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

			{/* isLoading and error are not defined in this component's scope,
				so they are removed as per the edit hint. */}

			<Card className="bg-slate-800/50 border-slate-700">
				<div className="p-6 border-b border-slate-700">
					<h3 className="text-lg font-semibold text-white">
						{filteredPRs.length} Pull Request
						{filteredPRs.length !== 1 ? "s" : ""}
					</h3>
				</div>
				<div className="divide-y divide-slate-700">
					{filteredPRs.map((pr: PullRequest) => (
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

// Mock lint issues for PR detail
const mockLintIssues: LintIssue[] = [
	{
		id: "1",
		rule: "no-unused-vars",
		severity: "warning",
		file: "src/components/Button.tsx",
		line: 23,
		description: "Variable `isActive` is defined but never used.",
		suggestion: "Remove the unused variable or use it in your code.",
	},
	{
		id: "2",
		rule: "eqeqeq",
		severity: "error",
		file: "src/utils/helpers.js",
		line: 10,
		description: "Expected `===` and instead saw `==`.",
		suggestion: "Use `===` for strict equality comparison.",
	},
];
