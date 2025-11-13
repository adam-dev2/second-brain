import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Tags from "./pages/Tags";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Cards from "./pages/Cards";
import Profile from "./pages/Profile";
import Share from "./pages/Share";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import AuthPages from "./pages/AuthPages";
import Protected from "./components/Protected";

const App = () => {
  return (
        <Routes>
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/:id" element={<Share />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<Protected />}>
              <Route path="/home" element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tags" element={<Tags />} />
                <Route path="cards" element={<Cards />} />
                <Route path="search" element={<Search />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
        </Routes>
  );
};

export default App;
