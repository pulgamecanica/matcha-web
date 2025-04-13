import { useNavigate } from 'react-router-dom';
import { ProfileForm } from '@components/form/ProfileForm';
import { updateUserProfile } from '@api/userService';
import toast from 'react-hot-toast';

export const EditProfilePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await updateUserProfile(data);
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(`Profile update failed. ${error}`);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
            Edit Your Profile
          </h2>
          <ProfileForm onSubmit={handleSubmit} buttonText="Update Profile" />
        </div>
        </div>
    </div>
  );
};
