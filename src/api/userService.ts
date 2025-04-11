import { User } from '@/types/user';
import axiosInstance from './axios';

export async function fetchCurrentUser(): Promise<User> {
  const user = await axiosInstance.get<User>("/me") as unknown as User;
  return user;
}
