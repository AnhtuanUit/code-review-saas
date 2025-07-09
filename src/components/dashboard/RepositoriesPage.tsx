import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	GitBranch,
	Plus,
	Search,
	Star,
	Settings,
	CheckCircle,
	XCircle,
	Clock,
	Globe,
	Lock,
} from "lucide-react";
import { Repository } from "@/types";
import { supabase } from "@/lib/supabase";

export function RepositoriesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [repoUrl, setRepoUrl] = useState("");
	const [isAddingRepo, setIsAddingRepo] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [repos, setRepos] = useState<Repository[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRepos = async () => {
			setLoading(true);
			setError(null);
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				const githubToken = session?.provider_token;
				if (!githubToken) {
					setError("No GitHub token found. Please sign in with GitHub.");
					setLoading(false);
					return;
				}
				const response = await fetch(
					"https://api.github.com/user/repos?per_page=100",
					{
						headers: {
							Authorization: `token ${githubToken}`,
						},
					}
				);
				if (!response.ok) {
					setError("Failed to fetch repositories from GitHub.");
					setLoading(false);
					return;
				}
				const data = await response.json();
				// Map GitHub API data to your Repository type
				const mappedRepos: Repository[] = data.map(
					(repo: {
						id: number;
						name: string;
						full_name: string;
						html_url: string;
						private: boolean;
						updated_at: string;
						language: string;
						stargazers_count: number;
					}) => ({
						id: repo.id.toString(),
						name: repo.name,
						fullName: repo.full_name,
						url: repo.html_url,
						private: repo.private,
						webhookStatus: "active", // You can enhance this if you track webhooks
						lastScan: repo.updated_at,
						language: repo.language || "",
						stars: repo.stargazers_count,
					})
				);
				setRepos(mappedRepos);
			} catch {
				setError("An error occurred while fetching repositories.");
			} finally {
				setLoading(false);
			}
		};
		fetchRepos();
	}, []);

	const getWebhookStatusIcon = (status: Repository["webhookStatus"]) => {
		switch (status) {
			case "active":
				return <CheckCircle className="h-4 w-4 text-green-400" />;
			case "inactive":
				return <XCircle className="h-4 w-4 text-red-400" />;
			default:
				return <Clock className="h-4 w-4 text-yellow-400" />;
		}
	};

	const getWebhookStatusColor = (status: Repository["webhookStatus"]) => {
		switch (status) {
			case "active":
				return "bg-green-600/20 text-green-400 border-green-600/30";
			case "inactive":
				return "bg-red-600/20 text-red-400 border-red-600/30";
			default:
				return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
		}
	};

	const filteredRepos = repos.filter(
		(repo) =>
			repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			repo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddRepository = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!repoUrl.trim()) return;

		setIsAddingRepo(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsAddingRepo(false);
		setRepoUrl("");
		setIsDialogOpen(false);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-white mb-2">Repositories</h1>
					<p className="text-slate-400">
						Manage your connected repositories and webhook configurations
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
							<Plus className="h-4 w-4 mr-2" />
							Add Repository
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-slate-800 border-slate-700">
						<DialogHeader>
							<DialogTitle className="text-white">
								Add New Repository
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleAddRepository} className="space-y-4">
							<div>
								<Label htmlFor="repo-url" className="text-slate-300">
									Repository URL
								</Label>
								<Input
									id="repo-url"
									type="url"
									value={repoUrl}
									onChange={(e) => setRepoUrl(e.target.value)}
									placeholder="https://github.com/username/repository"
									className="bg-slate-700 border-slate-600 text-white"
								/>
							</div>
							<div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
								<p className="text-blue-400 text-sm">
									Make sure you have admin access to the repository to set up
									webhooks automatically.
								</p>
							</div>
							<div className="flex gap-3">
								<Button
									type="submit"
									disabled={!repoUrl.trim() || isAddingRepo}
									className="bg-cyan-600 hover:bg-cyan-700 text-white"
								>
									{isAddingRepo ? "Adding..." : "Add Repository"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
									className="border-slate-600 text-slate-300 hover:bg-slate-700"
								>
									Cancel
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
					<Input
						placeholder="Search repositories..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 bg-slate-800/50 border-slate-700 text-white"
					/>
				</div>
			</div>

			{loading && (
				<div className="text-slate-400">
					Loading repositories from GitHub...
				</div>
			)}
			{error && <div className="text-red-400">{error}</div>}

			<div className="grid gap-6">
				{filteredRepos.map((repo) => (
					<Card key={repo.id} className="bg-slate-800/50 border-slate-700">
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<GitBranch className="h-5 w-5 text-slate-400" />
										<h3 className="text-lg font-semibold text-white">
											{repo.name}
										</h3>
										<div className="flex items-center gap-2">
											{repo.private ? (
												<Lock className="h-4 w-4 text-slate-400" />
											) : (
												<Globe className="h-4 w-4 text-slate-400" />
											)}
											<Badge variant="outline" className="text-xs">
												{repo.private ? "Private" : "Public"}
											</Badge>
										</div>
									</div>
									<p className="text-slate-400 text-sm mb-3">{repo.fullName}</p>
									<div className="flex items-center gap-4 text-sm text-slate-500">
										<span className="flex items-center gap-1">
											<Star className="h-4 w-4" />
											{repo.stars}
										</span>
										<span>{repo.language}</span>
										<span>
											Last update:{" "}
											{new Date(repo.lastScan).toLocaleDateString()}
										</span>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<span
										className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getWebhookStatusColor(
											repo.webhookStatus
										)}`}
									>
										{getWebhookStatusIcon(repo.webhookStatus)}
										<span className="ml-1">{repo.webhookStatus}</span>
									</span>
									<Button
										size="sm"
										variant="outline"
										className="border-slate-600 text-slate-300 hover:bg-slate-700 mt-2"
									>
										<Settings className="h-4 w-4 mr-1" />
										Manage
									</Button>
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
