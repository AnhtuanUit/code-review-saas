import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

interface AuthFlowProps {
  onSuccess: () => void;
}

export function AuthFlow({ onSuccess }: AuthFlowProps) {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginPage 
      onSuccess={onSuccess}
      onSwitchToSignup={() => setIsLogin(false)}
    />
  ) : (
    <SignupPage 
      onSuccess={onSuccess}
      onSwitchToLogin={() => setIsLogin(true)}
    />
  );
}