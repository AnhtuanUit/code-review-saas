import { useState } from 'react';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AuthModal } from '@/components/auth/AuthModal';
import { Toaster } from '@/components/ui/sonner';
import { mockUser } from '@/lib/mockData';
import { User } from '@/types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUser(mockUser);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900">
      {isAuthenticated && user ? (
        <DashboardPage user={user} onSignOut={handleSignOut} />
      ) : (
        <LandingPage onAuthClick={handleAuthClick} />
      )}
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
      
      <Toaster />
    </div>
  );
}

export default App;