import { User } from '@/types/user';
import axiosInstance from './axios';

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await axiosInstance.get<User>("/me");
  return data;
}
