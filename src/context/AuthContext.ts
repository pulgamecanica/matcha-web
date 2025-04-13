import { createContext } from 'react';
import { RegisterData } from '@api/authService';
import { User } from '@/types/user';

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  confirm: (username: string) => Promise<void>;
  loading: boolean;
  profileSetupComplete: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
