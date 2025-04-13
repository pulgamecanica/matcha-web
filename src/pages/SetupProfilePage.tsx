import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '@api/userService';
import { ProfileForm } from '@components/form/ProfileForm';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export const SetupProfilePage = () => {
  const { profileSetupComplete } = useAuth();
  const navigate = useNavigate();


  if (profileSetupComplete) {
    toast.success('Profile is already setup, redirecting to /profile/edit');
    navigate('/profile/edit');
  }

  const handleSubmit = async (data: any) => {
    try {
      await updateUserProfile(data);
      toast.success('Profile successfully setup!');
      navigate('/');
    } catch (error) {
      toast.error(`Profile setup failed. ${error}`);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="container max-w-2xl mx-2 p-6 bg-white dark:bg-gray-800 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">Setup Your Profile</h2>
        <ProfileForm onSubmit={handleSubmit} buttonText="Complete Setup" />
      </div>
    </div>
  );
};
