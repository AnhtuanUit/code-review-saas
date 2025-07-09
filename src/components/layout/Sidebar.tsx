import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  GitPullRequest, 
  GitBranch, 
  BarChart3, 
  Settings, 
  Code2,
  Crown,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface SidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

export function Sidebar({ user, activeTab, onTabChange, onSignOut }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prs', label: 'Pull Requests', icon: GitPullRequest },
    { id: 'repos', label: 'Repositories', icon: GitBranch },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      'bg-slate-900 border-r border-slate-800 h-full flex flex-col transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Code2 className="h-8 w-8 text-cyan-400 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">CodeReview</h2>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start mb-1 h-11',
                activeTab === item.id 
                  ? 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800',
                isCollapsed && 'px-2'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
              {!isCollapsed && item.label}
            </Button>
          );
        })}
      </nav>

      {user.plan === 'free' && (
        <div className="p-4 border-t border-slate-800">
          <div className={cn(
            'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-600/30 rounded-lg p-3',
            isCollapsed && 'p-2'
          )}>
            {!isCollapsed && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Get unlimited repos and advanced features
                </p>
              </>
            )}
            <Button 
              size={isCollapsed ? 'sm' : 'sm'} 
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isCollapsed ? <Crown className="h-4 w-4" /> : 'Upgrade Now'}
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.plan}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-slate-400 hover:text-white p-1 h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}