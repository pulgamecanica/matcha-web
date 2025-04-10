import { useEffect, useState } from 'react';
import axios from '@api/axios';
import LoadingScreen from '@components/LoadingScreen';
import { User } from '../types';

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<{ data: User }>('/me');
        setUser(res.data.data);
      } catch (err: any) {
        const message = err?.response?.data?.error || err.message || 'Unknown error';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400 p-4">
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.first_name} {user?.last_name} 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800 p-6 rounded-xl shadow-lg">
        <div>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Gender:</strong> {user?.gender}</p>
          <p><strong>Sexual Preference:</strong> {user?.sexual_preferences}</p>
        </div>
        <div>
          <p><strong>Email Verified:</strong> {user?.is_email_verified === 't' ? 'Yes' : 'No'}</p>
          <p><strong>Banned:</strong> {user?.is_banned === 't' ? 'Yes' : 'No'}</p>
          <p><strong>Online Status:</strong> {user?.online_status === 't' ? 'Online' : 'Offline'}</p>
          <p><strong>Fame Rating:</strong> {user?.fame_rating}</p>
        </div>
      </div>
    </div>
  );
}
