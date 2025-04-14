import { UserDetails, UpdateUserProfilePayload } from '@/types/user'; // Updated imports
import axiosInstance from './axios';

// Fetch current user details
export async function fetchCurrentUser(): Promise<UserDetails> {
  const user = await axiosInstance.get<UserDetails>('/me');
  return user; // Return user as UserDetails
}

// Update user profile
export async function updateUserProfile(data: Partial<UpdateUserProfilePayload>): Promise<UserDetails> {
  const response = await axiosInstance.patch<UserDetails>('/me', data);
  return response; // Return updated user as UserDetails
}
