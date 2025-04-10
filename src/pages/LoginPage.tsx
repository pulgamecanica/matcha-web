// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      navigate('/match');
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Invalid credentials.');
        } else if (err.response?.status === 403) {
          setError('User not confirmed or banned.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded">
      <h1 className="text-xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Username</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            className="w-full p-2 border rounded"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* You can link to the RegisterPage if using react-router */}
      {/* <Link to="/register" className="text-blue-700">Go to Register</Link> */}
    </div>
  );
}
