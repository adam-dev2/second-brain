import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Testing from "./Testing";
import DashboardLayout from "./layouts/DashboardLayout";
import Tags from "./pages/Tags";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Cards from "./pages/Cards";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          {/* ===== Auth Pages ===== */}
            <Route
              path="/"
              element={
                <div className="bg-linear-to-br from-gray-600 via-zinc-600 to-gray-700 flex justify-center items-center h-screen w-screen">
                  <Signup />
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div className="bg-linear-to-br from-gray-600 via-zinc-600 to-gray-700 flex justify-center items-center h-screen w-screen">
                  <Login />
                </div>
              }
            />
            <Route
              path="/testing"
              element={
                <div className="bg-linear-to-br from-gray-600 via-zinc-600 to-gray-700 flex justify-center items-center h-screen w-screen">
                  <Testing />
                  </div>
              }
            />

          {/* ===== Dashboard Pages ===== */}
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
