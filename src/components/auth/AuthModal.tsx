import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Key, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [pat, setPat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleGitHubOAuth = async () => {
    setIsLoading(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSuccess();
  };

  const handlePATSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pat.trim()) return;
    
    setIsLoading(true);
    // Simulate PAT validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card ref={modalRef} className="w-full max-w-md bg-slate-800 border-slate-600 shadow-2xl">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to CodeReview</h2>
            <p className="text-slate-300">Choose your preferred authentication method</p>
          </div>

          <Tabs defaultValue="oauth" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-700">
              <TabsTrigger value="oauth">GitHub OAuth</TabsTrigger>
              <TabsTrigger value="pat">Personal Token</TabsTrigger>
            </TabsList>

            <TabsContent value="oauth" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <Github className="h-12 w-12 text-white mx-auto mb-2" />
                  <p className="text-slate-300 text-sm">
                    Sign in with your GitHub account for the fastest setup
                  </p>
                </div>
                
                <Button 
                  onClick={handleGitHubOAuth}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? 'Connecting...' : 'Continue with GitHub'}
                </Button>
                
                <p className="text-xs text-slate-400">
                  We'll only access your public repositories and basic profile information
                </p>
              </div>
            </TabsContent>

            <TabsContent value="pat" className="space-y-4">
              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 text-sm font-medium mb-1">Personal Access Token</p>
                    <p className="text-blue-300 text-xs">
                      Create a PAT in your GitHub settings with 'repo' and 'read:user' scopes
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePATSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="pat" className="text-slate-300">
                    GitHub Personal Access Token
                  </Label>
                  <div className="relative mt-1">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="pat"
                      type="password"
                      value={pat}
                      onChange={(e) => setPat(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="pl-10 bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={!pat.trim() || isLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isLoading ? 'Validating...' : 'Connect with Token'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}