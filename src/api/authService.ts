import axiosInstance from './axios';

/**
 * Example: types for your Auth flows.
 */
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
  gender: 'male' | 'female' | 'other';
  sexual_preferences: 'male' | 'female' | 'non_binary' | 'everyone';
};

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<void> {
  await axiosInstance.post('/auth/register', data);
  // 201 => user created
  // You can return something if needed, or handle the response if your API returns data
}

/**
 * Confirm a user
 */
export async function confirmUser(username: string): Promise<void> {
  await axiosInstance.post('/auth/confirm', { username });
  // 200 => user confirmed
}

/**
 * Log in: returns a JWT token
 */
export async function loginUser(credentials: AuthCredentials): Promise<string> {
  const response = await axiosInstance.post('/auth/login', credentials);
  // 200 => { token: string }
  const { token } = response.data as { token: string };
  return token;
}

/**
 * Log out: remove local token. If your API has an /auth/logout, call it here.
 */
export function logoutUser(): void {
  localStorage.removeItem('token');
}
