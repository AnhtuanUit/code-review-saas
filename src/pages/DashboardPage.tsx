import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { PullRequestsPage } from '@/components/dashboard/PullRequestsPage';
import { RepositoriesPage } from '@/components/dashboard/RepositoriesPage';
import { StatsPage } from '@/components/dashboard/StatsPage';
import { SettingsPage } from '@/components/dashboard/SettingsPage';
import { User } from '@/types';

interface DashboardPageProps {
  user: User;
  onSignOut: () => void;
}

export function DashboardPage({ user, onSignOut }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setActiveTab} />;
      case 'prs':
        return <PullRequestsPage />;
      case 'repos':
        return <RepositoriesPage />;
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onSignOut={onSignOut}
      />
      <main className="flex-1 overflow-auto bg-slate-900">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}