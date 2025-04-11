import { User } from '@/types/user';
import axiosInstance from './axios';

export async function fetchCurrentUser(): Promise<User> {
  const response = await axiosInstance.get('me');
  return response.data;
}
