import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PublicUser } from '@/types/user';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TagList } from '@/components/profile/TagList';
import { PictureGallery } from '@/components/profile/PictureGallery';
import LoadingScreen from '@/components/LoadingScreen';
import { NotFoundPage } from './NotFoundPage';
import { fetchPublicProfile } from '@/api/publicProfile';
import { PublicProfileActions } from '@/components/profile/PublicProfileActions';
import { useUserMe } from '@/hooks/useUserMe';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { relationshipStatus } from '@/api/relationshipStatus';

export function PublicProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { user: currentUser } = useUserMe();
  const relationship = username && currentUser
  ? relationshipStatus(username, currentUser.username)
  : undefined;

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const res = await fetchPublicProfile(username);
        setUser(res);
        setNotFound(false);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading || !currentUser) return <LoadingScreen />;
  if (notFound || !username || !user) return <NotFoundPage />;
  if (!relationship) return <LoadingScreen />;

  const profilePicture = user.pictures.find((pic) => pic.is_profile === 't') || null;
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-screen">
      <ProfileHeader  user={user} profilePicture={profilePicture} />
      <ProfileStats showMessage={false} user={user} relationship={relationship}/>
      <TagList tags={user.tags || []} />
      {user.username !== currentUser?.username && (
        <PublicProfileActions user={user} relationship={relationship} />
      )}
      <h3 className="font-bold mt-6 text-lg">📷 Pictures</h3>
      <PictureGallery
        pictures={(user.pictures || []).filter((pic) => pic.is_profile !== "t")}
      />
    </div>
  );
}
