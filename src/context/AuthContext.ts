import { createContext } from 'react';
import { RegisterData } from '@api/authService';

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  confirm: (username: string) => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
