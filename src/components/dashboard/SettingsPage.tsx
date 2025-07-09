import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Key, 
  Bell, 
  CreditCard, 
  Shield, 
  Settings as SettingsIcon,
  Github,
  Mail,
  Crown,
  Check
} from 'lucide-react';
import { User as UserType } from '@/types';
import { mockUser } from '@/lib/mockData';

export function SettingsPage() {
  const [user, setUser] = useState<UserType>(mockUser);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    webhook: true,
    prReview: true,
    securityAlerts: true
  });

  const handleProfileUpdate = (field: string, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and configurations</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-semibold text-white">{user.name}</h4>
                  <p className="text-slate-400">{user.email}</p>
                  <Badge variant="outline" className="mt-2">
                    {user.plan} Plan
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Save Changes
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">GitHub Integration</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Github className="h-8 w-8 text-white" />
                    <div>
                      <h4 className="text-white font-medium">GitHub Account</h4>
                      <p className="text-slate-400 text-sm">@{user.githubUsername}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30">
                    Connected
                  </Badge>
                </div>

                <div>
                  <Label htmlFor="pat" className="text-slate-300">Personal Access Token</Label>
                  <div className="mt-2 flex gap-3">
                    <Input
                      id="pat"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Update
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Token is encrypted and stored securely
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Repository Access</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Public repositories</span>
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Private repositories</span>
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-slate-400 text-sm">Get notified via email for important updates</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Slack Integration</h4>
                    <p className="text-slate-400 text-sm">Send notifications to your Slack workspace</p>
                  </div>
                  <Switch 
                    checked={notifications.slack}
                    onCheckedChange={() => handleNotificationToggle('slack')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Webhook Notifications</h4>
                    <p className="text-slate-400 text-sm">POST notifications to custom endpoints</p>
                  </div>
                  <Switch 
                    checked={notifications.webhook}
                    onCheckedChange={() => handleNotificationToggle('webhook')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">PR Review Alerts</h4>
                    <p className="text-slate-400 text-sm">Get notified when PRs need review</p>
                  </div>
                  <Switch 
                    checked={notifications.prReview}
                    onCheckedChange={() => handleNotificationToggle('prReview')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Security Alerts</h4>
                    <p className="text-slate-400 text-sm">Immediate alerts for security issues</p>
                  </div>
                  <Switch 
                    checked={notifications.securityAlerts}
                    onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Billing Information</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">Current Plan</h4>
                      <p className="text-slate-400 text-sm">You're on the {user.plan} plan</p>
                    </div>
                    <Badge variant="outline" className="bg-cyan-600/20 text-cyan-400 border-cyan-600/30">
                      {user.plan}
                    </Badge>
                  </div>
                  {user.plan === 'free' && (
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  )}
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Usage</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">PRs this month</span>
                      <span className="text-white">24 / 100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>
                </div>

                {user.plan !== 'free' && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Payment Method</h4>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-slate-300">•••• •••• •••• 4242</p>
                      <p className="text-slate-400 text-sm">Expires 12/2025</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-slate-300">Secure your account with 2FA</p>
                      <p className="text-slate-400 text-sm">Not enabled</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Active Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-slate-300">Current session</p>
                        <p className="text-slate-400 text-sm">MacBook Pro • Chrome • San Francisco</p>
                      </div>
                      <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">API Keys</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-slate-300">No API keys created</p>
                        <p className="text-slate-400 text-sm">Generate keys to access the CodeReview API</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Key className="h-4 w-4 mr-2" />
                        Generate Key
                      </Button>
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