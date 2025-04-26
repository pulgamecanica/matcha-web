import { useUserMe } from '@/hooks/useUserMe';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TagList } from '@/components/profile/TagList';
import { LocationCard } from '@/components/profile/LocationCard';
import { PictureGallery } from '@/components/profile/PictureGallery';
import LoadingScreen from '@/components/LoadingScreen';
import { LocationEditorModal } from '@/components/LocationEditorModal';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toPublicUser } from '@/utils/toPublicUser';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { PublicUser } from '@/types/user';

export function ProfilePage() {
  const {
    user,
    tags,
    pictures,
    profilePicture,
    location,
    views,
    viewers,
    loading,
    likes,
    likedBy,
    matches,
    connections,
  } = useUserMe();
  const [showModal, setShowModal] = useState(false);

  if (loading || !user) return <LoadingScreen />;

  const publicUser = toPublicUser(
    user,
    tags,
    pictures,
    views as unknown as PublicUser[],
    viewers as unknown as PublicUser[],
    likes as unknown as PublicUser[],
    likedBy as unknown as PublicUser[],
    matches as unknown as PublicUser[],
    connections as unknown as PublicUser[],
  );
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-screen">
      <ProfileHeader user={publicUser} profilePicture={profilePicture} location={location} />
      <div className="flex gap-2">
        <LocationCard location={location} />
        <button
          onClick={() => setShowModal(true)}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
        >
          <Pencil className='w-4 h-4'/>
        </button>
        {showModal && (
          <LocationEditorModal
            initialLocation={location}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
      <ProfileStats showMatches showMessage user={publicUser} />
      
      <TagList tags={tags} />
      <h3 className="font-bold mt-6 text-lg">📷 Pictures</h3>
      <PictureGallery pictures={pictures} />
    </div>
  );
}
