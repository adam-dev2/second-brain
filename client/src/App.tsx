import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Tags from "./pages/Tags";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Cards from "./pages/Cards";
import Share from "./pages/Share";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import AuthPages from "./pages/AuthPages";
import Protected from "./components/Protected";
import Section from "./pages/Section";

const App = () => {
  return (
        <Routes>
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/:id" element={<Share />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


          <Route element={<Protected />}>
              <Route path="/home" element={<DashboardLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tags" element={<Tags />} />
                <Route path="cards" element={<Cards />} />
                <Route path="search" element={<Search />} />
                <Route path="sections/:id" element={<Section />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </Route>
          </Route>


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
  );
};

export default App;
