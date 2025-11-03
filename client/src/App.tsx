import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Signup from "./pages/AuthPages";
import DashboardLayout from "./layouts/DashboardLayout";
import Tags from "./pages/Tags";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Cards from "./pages/Cards";
import Profile from "./pages/Profile";
import Share from "./pages/Share";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          
          <Route path="/" element={ <Signup /> } />
          <Route path="/:id" element={ <Share /> } />
          <Route path="/reset-password/:token" element={ <ResetPassword /> } />
            
          <Route path="/home" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tags" element={<Tags />} />
            <Route path="cards" element={<Cards />} />
            <Route path="search" element={<Search />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
