import { useEffect, useState } from 'react';
import axiosInstance from '@api/axios';
import { User, PublicUser, UpdateUserProfilePayload } from '@/types/user';
import { Tag } from '@/types/tag';
import { Picture } from '@/types/picture';
import { Location } from '@/types/location';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useUserMe() {
  const [user, setUser] = useState<User | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [profilePicture, setProfilePicture] = useState<Picture | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[] | null>([]);
  const [views, setViews] = useState<PublicUser[]>([]);
  const [viewers, setViewers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchAll() {
      if (!isAuthenticated) return
      try {
        const [
          userRes,
          tagsRes,
          picsRes,
          locRes,
          locsRes,
          viewsRes,
          viewersRes
        ] = await Promise.all([
          axiosInstance.get<User>('/me') as unknown as User,
          axiosInstance.get('/me/tags') as unknown as Tag[],
          axiosInstance.get('/me/pictures') as unknown as Picture[],
          axiosInstance.get('/me/location') as unknown as Location,
          axiosInstance.get('/me/location/history') as unknown as Location[],
          axiosInstance.get('/me/views') as unknown as PublicUser[],
          axiosInstance.get('/me/visits') as unknown as PublicUser[],
        ]);

        setUser(userRes);
        setTags(tagsRes);
        setPictures(picsRes.filter((pic: Picture) => !pic.is_profile) || null);
        setProfilePicture(picsRes.find((pic: Picture) => pic.is_profile) || null);
        setLocation(locRes);
        setLocationHistory(locsRes);
        setViews(viewsRes);
        setViewers(viewersRes);
      } catch (err) {
        toast.error(`Failed to fetch user profile: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [isAuthenticated]);

  const updateUser = async (data: Partial<UpdateUserProfilePayload>) => {
    try {
      const res = await axiosInstance.patch<User>('/me', data);
      setUser(res as unknown as User);
    } catch (err) {
      toast.error('Failed to update user profile.');
      throw err;
    }
  };

  return {
    user,
    tags,
    pictures,
    profilePicture,
    location,
    locationHistory,
    views,
    viewers,
    loading,
    updateUser,
    profileSetupComplete: !!(user?.gender && user?.sexual_preferences)
  };
}
