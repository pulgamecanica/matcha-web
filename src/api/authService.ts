import axiosInstance from './axios';

export type AuthCredentials = {
  username: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export async function registerUser(data: RegisterData): Promise<void> {
  await axiosInstance.post('/auth/register', data);
  // 201 => user created
  // You can return something if needed, or handle the response if your API returns data
}

export async function confirmUser(username: string): Promise<void> {
  await axiosInstance.post('/auth/confirm', { username });
  // 200 => user confirmed
}

export async function loginUser(credentials: AuthCredentials): Promise<string> {
  const response = await axiosInstance.post('/auth/login', credentials);
  // 200 => { token: string }
  const { token } = response as unknown as { token: string };
  return token;
}

export function logoutUser(): void {
  localStorage.removeItem('token');
}
