import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Cookies from "js-cookie";

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
  const navigate  = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const verifyUser = async () => {
    const token = Cookies.get('token');
    console.log(token);
    
    try {
      const res = await axios.get(`${backendUrl}/api/v1/me`, {
        withCredentials: true,
        headers:{
          'Authorization': `Bearer ${token}`
        }
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
    const res = await axios.post(`${backendUrl}/api/v1/auth/login`, data, {
      withCredentials: true,
    });

    await verifyUser();
    if(res.status == 200) {
      navigate('/home/dashboard')
    }
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
