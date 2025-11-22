import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AuthUser {
  id: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
  verifyUser: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const verifyUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/v1/me`, {
        withCredentials: true,
      });
      setAuthenticated(true);
      setUser(res.data.user);
    } catch (err) {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    await axios.post(`${backendUrl}/api/v1/auth/login`, data, {
      withCredentials: true,
    });

    await verifyUser();
  };

  const logout = async () => {
    await axios.post(
      `${backendUrl}/api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );

    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        verifyUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
