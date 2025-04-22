import { useEffect, useState } from 'react';
import axiosInstance from '@api/axios';
import { User, PublicUser, UpdateUserProfilePayload, Visitor } from '@/types/user';
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
  const [likes, setLikes] = useState<Visitor[]>([]);
  const [likedBy, setlikedBy] = useState<Visitor[]>([]);
  const { isAuthenticated } = useAuth();

  const fallbackToBrowserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setLocation(axiosInstance.post<Location>('/me/location', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }) as unknown as Location);
        } catch (err) {
          toast.error(`Failed to update user location: ${err}`);
        }
      },
      (err) => {
        console.error("Location error:", err);
        setLocation(null);
      }
    );
  };


  async function reverseGeocodeCity(latitude: number, longitude: number): Promise<{ country: string; city: string }> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      return {
        country: data.address?.country || 'Unknown',
        city:
          data.address?.county || 'Unknown'
      };
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      return { country: 'Unknown', city: 'Unknown' };
    }
  }
  


  useEffect(() => {
    async function fetchAll() {
      if (!isAuthenticated) return;

      try {
        const [
          userRes,
          tagsRes,
          picsRes,
          locRes,
          locsRes,
          viewsRes,
          viewersRes,
          likesRes,
          likedByRes
        ] = await Promise.all([
          axiosInstance.get<User>('/me') as unknown as User,
          axiosInstance.get('/me/tags') as unknown as Tag[],
          axiosInstance.get('/me/pictures') as unknown as Picture[],
          axiosInstance.get('/me/location') as unknown as Location,
          axiosInstance.get('/me/location/history') as unknown as Location[],
          axiosInstance.get('/me/views') as unknown as PublicUser[],
          axiosInstance.get('/me/visits') as unknown as PublicUser[],
          axiosInstance.get('/me/likes') as unknown as Visitor[],
          axiosInstance.get('/me/liked_by') as unknown as Visitor[],
        ]);

        setUser(userRes);
        setTags(tagsRes);
        setPictures(picsRes.filter((pic: Picture) => pic.is_profile !== 't') || null);
        setProfilePicture(picsRes.find((pic: Picture) => pic.is_profile === 't') || null);
        setLocationHistory(locsRes);
        setViews(viewsRes);
        setViewers(viewersRes);
        setLikes(likesRes);
        setlikedBy(likedByRes);
        if (locRes && locRes.latitude && locRes.longitude) {
          const lat = parseFloat(locRes.latitude as unknown as string);
          const lon = parseFloat(locRes.longitude as unknown as string);
          const { city, country } = await reverseGeocodeCity(lat, lon);
          setLocation({
            ...locRes,
            city,
            country,
          });
        } else {
          fallbackToBrowserLocation();
        }
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

  const addTag = async (name: string) => {
    try {
      const newTag = await axiosInstance.post<Tag>('/me/tags', { name });
      setTags(prev => [...prev, newTag as unknown as Tag]);
    } catch (err) {
      toast.error('Failed to add tag');
      throw err;
    }
  };

  const removeTag = async (name: string) => {
    try {
      await axiosInstance.delete('/me/tags', {
        data: { name },
      });
      setTags((prev) => prev.filter((tag) => tag.name !== name));
    } catch (err) {
      toast.error('Failed to remove tag');
      throw err;
    }
  };

  const uploadPicture = async (url: string, isProfile = false) => {
    try {
      const res = await axiosInstance.post<Picture>('/me/pictures', { url, is_profile: isProfile });
      const newPic = res as unknown as Picture;
      if (isProfile) {
        setProfilePicture(newPic);
        setPictures(prev => prev.filter(p => p.id !== newPic.id));
      } else {
        setPictures(prev => [...prev, newPic]);
      }
    } catch (err) {
      toast.error('Failed to upload picture');
      throw err;
    }
  };

  const setProfilePictureById = async (pictureId: number) => {
    try {
      const res = await axiosInstance.patch<Picture>(`/me/pictures/${pictureId}`, {
        is_profile: true,
      });

      const newProfile = res as unknown as Picture;

      if (profilePicture) {
        setPictures(prev => [...prev, { ...profilePicture, is_profile: 'f' }]);
      }

      setPictures(prev => prev.filter(p => p.id !== newProfile.id));

      setProfilePicture({ ...newProfile, is_profile: 't' });
    } catch (err) {
      toast.error('Failed to set profile picture');
      throw err;
    }
  };

  const deletePicture = async (pictureId: number) => {
    try {
      await axiosInstance.delete(`/me/pictures/${pictureId}`);
      setPictures(prev => prev.filter(p => p.id !== pictureId));
      if (profilePicture?.id === pictureId) {
        setProfilePicture(null);
      }
    } catch (err) {
      toast.error('Failed to delete picture');
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
    likes,
    likedBy,
    updateUser,
    addTag,
    removeTag,
    uploadPicture,
    setProfilePicture: setProfilePictureById,
    deletePicture,
    profileSetupComplete: !!(user?.gender && user?.sexual_preferences)
  };
}
