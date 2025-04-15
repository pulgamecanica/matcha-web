import { useUser } from '@/hooks/useUser';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TagList } from '@/components/profile/TagList';
import { LocationCard } from '@/components/profile/LocationCard';
import { PictureGallery } from '@/components/profile/PictureGallery';
import { ProfileViews } from '@/components/profile/ProfileViews';
import LoadingScreen from '@/components/LoadingScreen';

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
  } = useUser();

  if (loading || !user) return <LoadingScreen />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-screen">
      <ProfileHeader user={user} profilePicture={profilePicture} />
      <LocationCard location={location} />
      <TagList tags={tags} />
      <h3 className="font-bold mt-6 text-lg">📷 Pictures</h3>
      <PictureGallery pictures={pictures} />
      <ProfileViews viewers={viewers} views={views} />
    </div>
  );
}
