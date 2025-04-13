import { ReactNode, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, logoutUser, registerUser, confirmUser, RegisterData } from '@api/authService';
import { AuthContext } from '@context/AuthContext';
import { User } from '@/types/user';
import { fetchCurrentUser } from '@/api/userService';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    async function initializeAuth() {
      try {
        if (storedToken && !isTokenExpired(storedToken)) {
          setToken(storedToken);

            const user = await fetchCurrentUser();
            setUser(user);
            setIsAuthenticated(true);
        }
      } catch (err) {
        logoutUser();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    }
    initializeAuth();
  }, []);

  const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (!decoded.exp) {
      return true;
    }
  
    return decoded.exp < currentTime;
  };

  async function login(username: string, password: string) {
    const newToken = await loginUser({ username, password });
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const user = await fetchCurrentUser();
    setUser(user);
    setIsAuthenticated(true);
  }

  function logout() {
    logoutUser();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  async function register(data: RegisterData) {
    await registerUser(data);
  }

  async function confirm(username: string) {
    await confirmUser(username);
  }

  const value = {
    token,
    isAuthenticated,
    login,
    logout,
    register,
    confirm,
    loading,
    user,
    profileSetupComplete: !!(user?.gender && user?.sexual_preferences),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
