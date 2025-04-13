import { useAuth } from '@hooks/useAuth';
import LoadingScreen from '@components/LoadingScreen';
import { JSX } from 'react';
import { ErrorBlockerMessage } from '@components/ErrorBlockerMessage';
import { useNavigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, isAuthenticated, loading, profileSetupComplete } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!token || !isAuthenticated) {
    return <ErrorBlockerMessage message="Session expired. Please log in again. ⚠️" locationMessage="Go to Login" />;
  }
  
  if (!profileSetupComplete && location.pathname !== '/setup') {
    return navigate('/');
  }

  return children;
}