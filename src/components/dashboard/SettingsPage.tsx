import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Key, Bell, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BillingSection } from "./BillingSection";

export function SettingsPage() {
	const { user, signOut } = useAuth();
	const [notifications, setNotifications] = useState({
		email: true,
		slack: false,
		webhook: true,
		prReview: true,
		securityAlerts: true,
	});

	const handleNotificationToggle = (key: keyof typeof notifications) => {
		setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSignOut = async () => {
		await signOut();
	};

	if (!user) {
		return (
			<div className="text-center text-slate-400">
				Please sign in to access settings.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
				<p className="text-slate-400">
					Manage your account preferences and configurations
				</p>
			</div>

			<Tabs defaultValue="profile" className="w-full">
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="billing">Billing</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="space-y-6">
					<Card className="bg-slate-800/50 border-slate-700">
						<div className="p-6 border-b border-slate-700">
							<div className="flex items-center gap-2">
								<User className="h-5 w-5 text-cyan-400" />
								<h3 className="text-lg font-semibold text-white">
									Profile Information
								</h3>
							</div>
						</div>
						<div className="p-6">
							<div className="flex items-center gap-6 mb-6">
								<Avatar className="h-20 w-20">
									<AvatarImage
										src={user.user_metadata?.avatar_url}
										alt={user.user_metadata?.full_name || user.email}
									/>
									<AvatarFallback>
										{(user.user_metadata?.full_name || user.email || "U")
											.charAt(0)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<h4 className="text-lg font-semibold text-white">
										{user.user_metadata?.full_name || "User"}
									</h4>
									<p className="text-slate-400">{user.email}</p>
									<p className="text-slate-500 text-sm">
										Member since{" "}
										{new Date(user.created_at).toLocaleDateString()}
									</p>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<Label htmlFor="name" className="text-slate-300">
										Full Name
									</Label>
									<Input
										id="name"
										value={user.user_metadata?.full_name || ""}
										placeholder="Enter your full name"
										className="bg-slate-700 border-slate-600 text-white"
									/>
								</div>
								<div>
									<Label htmlFor="email" className="text-slate-300">
										Email
									</Label>
									<Input
										id="email"
										type="email"
										value={user.email || ""}
										disabled
										className="bg-slate-700 border-slate-600 text-white opacity-50"
									/>
									<p className="text-xs text-slate-400 mt-1">
										Email cannot be changed
									</p>
								</div>
							</div>

							<div className="mt-6 flex gap-3">
								<Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
									Save Changes
								</Button>
								<Button
									variant="outline"
									className="border-slate-600 text-slate-300 hover:bg-slate-700"
								>
									Cancel
								</Button>
							</div>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value="notifications" className="space-y-6">
					<Card className="bg-slate-800/50 border-slate-700">
						<div className="p-6 border-b border-slate-700">
							<div className="flex items-center gap-2">
								<Bell className="h-5 w-5 text-cyan-400" />
								<h3 className="text-lg font-semibold text-white">
									Notification Preferences
								</h3>
							</div>
						</div>
						<div className="p-6">
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="text-white font-medium">
											Email Notifications
										</h4>
										<p className="text-slate-400 text-sm">
											Get notified via email for important updates
										</p>
									</div>
									<Switch
										checked={notifications.email}
										onCheckedChange={() => handleNotificationToggle("email")}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="text-white font-medium">
											Slack Integration
										</h4>
										<p className="text-slate-400 text-sm">
											Send notifications to your Slack workspace
										</p>
									</div>
									<Switch
										checked={notifications.slack}
										onCheckedChange={() => handleNotificationToggle("slack")}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="text-white font-medium">
											Webhook Notifications
										</h4>
										<p className="text-slate-400 text-sm">
											POST notifications to custom endpoints
										</p>
									</div>
									<Switch
										checked={notifications.webhook}
										onCheckedChange={() => handleNotificationToggle("webhook")}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="text-white font-medium">PR Review Alerts</h4>
										<p className="text-slate-400 text-sm">
											Get notified when PRs need review
										</p>
									</div>
									<Switch
										checked={notifications.prReview}
										onCheckedChange={() => handleNotificationToggle("prReview")}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="text-white font-medium">Security Alerts</h4>
										<p className="text-slate-400 text-sm">
											Immediate alerts for security issues
										</p>
									</div>
									<Switch
										checked={notifications.securityAlerts}
										onCheckedChange={() =>
											handleNotificationToggle("securityAlerts")
										}
									/>
								</div>
							</div>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value="billing" className="space-y-6">
					<BillingSection />
				</TabsContent>

				<TabsContent value="security" className="space-y-6">
					<Card className="bg-slate-800/50 border-slate-700">
						<div className="p-6 border-b border-slate-700">
							<div className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-cyan-400" />
								<h3 className="text-lg font-semibold text-white">
									Security Settings
								</h3>
							</div>
						</div>
						<div className="p-6">
							<div className="space-y-6">
								<div>
									<h4 className="text-white font-medium mb-3">
										Account Actions
									</h4>
									<div className="space-y-3">
										<Button
											variant="outline"
											className="border-slate-600 text-slate-300 hover:bg-slate-700"
										>
											<Key className="h-4 w-4 mr-2" />
											Change Password
										</Button>

										<Button
											variant="outline"
											className="border-red-600 text-red-400 hover:bg-red-600/20"
											onClick={handleSignOut}
										>
											<LogOut className="h-4 w-4 mr-2" />
											Sign Out
										</Button>
									</div>
								</div>

								<div>
									<h4 className="text-white font-medium mb-3">
										Active Sessions
									</h4>
									<div className="space-y-2">
										<div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
											<div>
												<p className="text-slate-300">Current session</p>
												<p className="text-slate-400 text-sm">
													This device • {new Date().toLocaleDateString()}
												</p>
											</div>
											<span className="text-green-400 text-sm">Active</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
