import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredAuth, getStoredAuth, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = user?.id || user?._id || null;

  useEffect(() => {
    const storedAuth = getStoredAuth();

    if (storedAuth?.token && storedAuth?.user) {
      setUser(storedAuth.user);
      setToken(storedAuth.token);
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);

    if (data?.token && data?.user) {
      setUser(data.user);
      setToken(data.token);
    }

    return data;
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      userId,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
