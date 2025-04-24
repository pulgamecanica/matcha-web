import { createContext } from 'react';
import { User, PublicUser, UpdateUserProfilePayload } from '@/types/user';
import { Tag } from '@/types/tag';
import { Picture } from '@/types/picture';
import { Location } from '@/types/location';

export type UserMeContextType = {
  user: User | null;
  tags: Tag[];
  pictures: Picture[];
  profilePicture: Picture | null;
  location: Location | null;
  locationHistory: Location[] | null;
  views: PublicUser[];
  viewers: PublicUser[];
  loading: boolean;
  likes: PublicUser[];
  likedBy: PublicUser[];
  setLocationManually: (loc: Location) => void;
  updateUser: (data: Partial<UpdateUserProfilePayload>) => Promise<void>;
  addTag: (name: string) => Promise<void>;
  removeTag: (name: string) => Promise<void>;
  uploadPicture: (url: string, isProfile?: boolean) => Promise<void>;
  setProfilePicture: (pictureId: number) => Promise<void>;
  deletePicture: (pictureId: number) => Promise<void>;
  profileSetupComplete: boolean;
};

export const UserMeContext = createContext<UserMeContextType>({
  user: null,
  tags: [],
  pictures: [],
  profilePicture: null,
  location: null,
  locationHistory: [],
  views: [],
  viewers: [],
  loading: true,
  likes: [],
  likedBy: [],
  setLocationManually: () => {},
  updateUser: async () => {},
  addTag: async () => {},
  removeTag: async () => {},
  uploadPicture: async () => {},
  setProfilePicture: async () => {},
  deletePicture: async () => {},
  profileSetupComplete: false,
});
