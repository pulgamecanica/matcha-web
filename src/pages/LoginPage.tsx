import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth';
import LoadingScreen from '@components/LoadingScreen';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {
      setPassword('')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 pb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Register
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Forgot your password?{' '}
          <Link to="/recover-password" className="text-blue-600 dark:text-blue-400 hover:underline">
            Recover
          </Link>
        </p>

      </div>
    </div>
  );
}
