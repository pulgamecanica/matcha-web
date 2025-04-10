import { ReactNode, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, logoutUser, registerUser, confirmUser, RegisterData } from '@api/authService';
import { AuthContext } from '@context/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      // Fetch the user
      // set up context useUser();
    }
    setLoading(false);
  }, []);

  const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  async function login(username: string, password: string) {
    const newToken = await loginUser({ username, password });
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    logoutUser();
    setToken(null);
  }

  async function register(data: RegisterData) {
    await registerUser(data);
  }

  async function confirm(username: string) {
    await confirmUser(username);
  }

  const value = {
    token,
    isAuthenticated: !!token, // False, is authenticated is true when the token is valid and the user is fetched!
    login,
    logout,
    register,
    confirm,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
