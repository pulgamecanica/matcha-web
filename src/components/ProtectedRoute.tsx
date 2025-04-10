import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import LoadingScreen from '@components/LoadingScreen';
import { JSX } from 'react';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
