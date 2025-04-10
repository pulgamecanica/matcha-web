import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JSX } from 'react';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, isAuthentificated } = useAuth();

  if (!token || !isAuthentificated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
