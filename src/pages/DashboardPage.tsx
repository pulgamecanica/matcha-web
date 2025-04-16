import { DashboardCard } from '@components/DashboardCard';
import { Heart, LogOut, User, Pencil } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useUserMe } from '@/hooks/useUserMe';

export function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useUserMe();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome {user?.username}👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DashboardCard
          title="Profile"
          icon={<User className="text-blue-400" />}
          to="/profile"
          description="Manage and update your personal profile."
        />
        <DashboardCard
          title="Edit Profile"
          icon={<Pencil className="text-blue-400" />}
          to="/profile/edit"
          description="Update your personal information and preferences."
        />
        <DashboardCard
          title="Matching"
          icon={<Heart className="text-pink-500" />}
          to="/match"
          description="Find and match with others."
        />
        <DashboardCard
          title="Log Out"
          icon={<LogOut className="text-red-400" />}
          description="Log out from your account."
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}