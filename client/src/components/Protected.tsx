import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const Protected = () => {
  const token = Cookies.get("token")!;
  
  return token?.length > 0 ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default Protected;
