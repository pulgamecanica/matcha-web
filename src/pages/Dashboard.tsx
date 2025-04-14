import { DashboardCard } from '@components/DashboardCard';
import { Heart, LogOut, User, Pencil } from 'lucide-react';
import { useUserContext } from '@/context/UserProvider'
import LoadingScreen from '@components/LoadingScreen';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, error } = useUserContext();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  // };
  if (loading || !user) return <LoadingScreen />;
  console.log(user)
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
        {/* <DashboardCard
          title="Log Out"
          icon={<LogOut className="text-red-400" />}
          description="Log out from your account."
          onClick={handleLogout}
        /> */}
      </div>
    </div>
  );
}