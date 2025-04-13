import { User, UpdateUserProfilePayload } from '@/types/user';
import axiosInstance from './axios';

export async function fetchCurrentUser(): Promise<User> {
  const user = await axiosInstance.get<User>("/me") as unknown as User;
  return user;
}

export async function updateUserProfile(data: Partial<UpdateUserProfilePayload>): Promise<User> {
  const response = await axiosInstance.patch<User>('/me', data) as unknown as User;
  return response;
}