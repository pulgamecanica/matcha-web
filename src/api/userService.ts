import { User } from '@/types/user';
import axiosInstance from './axios';

export async function fetchCurrentUser(): Promise<User> {
  return await axiosInstance.get<User>('me');
}
