import { useState, useEffect } from 'react';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { AuthFlow } from '@/components/auth/AuthFlow';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'success'>('landing');

  useEffect(() => {
    // Check URL for success page
    if (window.location.pathname === '/success') {
      setCurrentPage('success');
    } else if (user) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('landing');
    }
  }, [user]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setCurrentPage('dashboard');
  };

  const handleSignOut = async () => {
    setCurrentPage('landing');
    // Clear success page from URL if present
    if (window.location.pathname === '/success') {
      window.history.replaceState({}, '', '/');
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleSuccessContinue = () => {
    setCurrentPage('dashboard');
    // Clear success page from URL
    window.history.replaceState({}, '', '/');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (showAuthModal) {
    return <AuthFlow onSuccess={handleAuthSuccess} />;
  }

  if (currentPage === 'success') {
    return <SuccessPage onContinue={handleSuccessContinue} />;
  }

  if (currentPage === 'dashboard' && user) {
    return <DashboardPage user={user} onSignOut={handleSignOut} />;
  }

  return (
    <>
      <LandingPage onAuthClick={handleAuthClick} isAuthenticated={!!user} />
      <Toaster />
    </>
  );
}

export default App;