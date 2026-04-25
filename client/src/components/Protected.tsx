import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingOverlay from "./Loading";

const Protected = () => {
  const { loading, authenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingOverlay />;

  if (!authenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Protected;