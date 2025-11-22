import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingOverlay from "./Loading";
import { useEffect } from "react";


const Protected = () => {
  const { loading, authenticated,verifyUser } = useAuth();
  useEffect(() => {
    verifyUser();
  }, []);

  const publicPaths = [
    "/auth/google/callback",
    "/auth/github/callback",
    "/auth",
  ];

  if (publicPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  if (loading) return <LoadingOverlay />;

  return authenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default Protected;
