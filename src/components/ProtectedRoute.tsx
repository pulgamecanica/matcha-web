import { useAuth } from '@hooks/useAuth';
import LoadingScreen from '@components/LoadingScreen';
import { JSX } from 'react';
import { ErrorBlockerMessage } from '@components/ErrorBlockerMessage';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!token || !isAuthenticated) {
    return <ErrorBlockerMessage message="Session expired. Please log in again. ⚠️" locationMessage="Go to Login" />;
  }

  return children;
}