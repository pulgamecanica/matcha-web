// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    gender: 'other',
    sexual_preferences: 'both',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await register(formData);
      setSuccess('User registered successfully! You can now login.');
      navigate('/login');
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 422) {
          setError('Validation error. Check your data or if username/email is taken.');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded">
      <h1 className="text-xl mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Username</label>
          <input
            className="w-full p-2 border rounded"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            className="w-full p-2 border rounded"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            className="w-full p-2 border rounded"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">First Name</label>
          <input
            className="w-full p-2 border rounded"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            className="w-full p-2 border rounded"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Gender</label>
          <select
            className="w-full p-2 border rounded"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Sexual Preferences</label>
          <select
            className="w-full p-2 border rounded"
            name="sexual_preferences"
            value={formData.sexual_preferences}
            onChange={handleChange}
          >
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="both">both</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Register
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}

      {/* <Link to="/login" className="text-blue-700">Already have an account? Login</Link> */}
    </div>
  );
}
