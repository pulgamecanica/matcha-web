import axiosInstance from "@/api/axios";
import { PublicUser } from "@/types/user";

export async function fetchPublicProfile(username: string): Promise<PublicUser> {
  const response = await axiosInstance.get<{ data: PublicUser }>(`/users/${username}`);
  return response as unknown as PublicUser;
}
