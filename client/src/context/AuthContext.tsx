import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate  = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const verifyUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/v1/auth/me`, {
        withCredentials: true
      });
      setAuthenticated(true);
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
      
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  },[])

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
    const res = await axios.post(
      `${backendUrl}/api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );
    if(res.status != 200 ) {
      navigate('/auth')
    }
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
