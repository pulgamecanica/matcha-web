import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, logoutUser, registerUser, confirmUser, RegisterData } from '../api/authService';

type AuthContextType = {
  isAuthentificated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  confirm: (username: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children } : { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // On mount, check if a token is in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
     setToken(storedToken);
    }
  }, []);

  const isTokenExpired = (token: string): boolean => {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  /**
   * LOG IN
   */
  async function login(username: string, password: string) {
    try {
      const newToken = await loginUser({ username, password });
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (error) {console.error('Login failed', error)};
  }

  /**
   * LOG OUT
   */
  function logout() {
    logoutUser();
    localStorage.removeItem('token');
    setToken(null);
  }

  /**
   * REGISTER
   */
  async function register(data: RegisterData) {
    await registerUser(data);
  }

  /**
   * CONFIRM
   */
  async function confirm(username: string) {
    await confirmUser(username);
  }

  const value: AuthContextType = {
    token,
    isAuthentificated: !!token,
    login,
    logout,
    register,
    confirm,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access AuthContext
 */
export function useAuth() {
  return useContext(AuthContext);
}

