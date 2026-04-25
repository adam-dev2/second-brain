import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileStack,
  Tags,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sidebarAtom } from "../store/atoms/sidebar";
import { SignupFormAtom } from "../store/atoms/signupform";
import { loadingAtom } from "../store/atoms/loading";
import { useAuth } from "../context/AuthContext";
import LoadingOverlay from "../components/Loading";
import { useState } from "react";
import SectionsNav from "./SectionsNav";
import { sectionsAtom } from "../store/atoms/sections";



const Sidebar = () => {
  const { logout } = useAuth();
  const isOpen = useRecoilValue(sidebarAtom);
  const setIsOpen = useSetRecoilState(sidebarAtom);
  const navigate = useNavigate();
  const setFormData = useSetRecoilState(SignupFormAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sections = useRecoilValue(sectionsAtom);
  const location = useLocation();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      // toast.success("Logged out successfully");
      navigate("/auth");

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  const handleMobileOverlayClick = () => {
    setIsMobileOpen(false);
  };

  const links = [
    { path: "/home/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/home/cards", label: "Cards", icon: FileStack },
    { path: "/home/tags", label: "Tags", icon: Tags },
    { path: "/home/search", label: "Search", icon: Search }
  ];

 return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/50 z-40 md:hidden"
          onClick={handleMobileOverlayClick}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-neutral-950 text-white flex flex-col border-r border-white/10 shadow-2xl transition-all duration-300 z-50 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Second Brain</h2>
          {/* ✅ Fix 1: Single close button, relative positioning, always visible when sidebar is open */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
        </div>
        {/* Mobile Navigation Links */}
        <nav className="flex flex-col gap-2 p-4 flex-1">
          {links.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                  isActive
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors duration-150"
                }`}
              >
                <Icon
                  className={`shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`}
                  size={20}
                />
                {/* ✅ Fixed: was using isOpen (desktop state) on mobile — always show label here */}
                <span className="truncate">{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 bg-neutral-900 rounded-md border border-neutral-800 text-white hover:bg-neutral-950/90 cursor-pointer hover:scale-[1.02] transition transform"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* ✅ Fix 2: Mobile Toggle Button — only shows when sidebar is CLOSED, correct text color */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 p-2 rounded-lg border border-neutral-600 bg-neutral-950/80 text-white hover:bg-neutral-800 transition-all z-30 md:hidden"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } fixed top-0 left-0 h-full bg-neutral-950 text-white flex-col p-4 border-r border-white/8 backdrop-blur shadow-2xl transition-all duration-300 z-10 hidden md:flex`}
      >
        {/* ✅ Fix 3: Header with toggle button inline (no floating button glitch), typo fixed */}
        <div className="flex items-center justify-between mb-10 mt-2 overflow-hidden">
          {isOpen && (
            <h1 className="text-sm font-semibold tracking-tight text-white/90 transition-all">
              Second Brain
            </h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-all text-white"
          >
            {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex flex-col gap-2 sm:gap-3">
          {links.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${
                  isActive
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors duration-150"
                }`}
              >
                <Icon
                  className={`shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`}
                  size={isOpen ? 20 : 24}
                />
                {/* ✅ Fixed: desktop correctly uses isOpen */}
                {isOpen && <span className="truncate">{label}</span>}
              </NavLink>
            );
          })}

          <SectionsNav isOpen={isOpen} sections={sections} />
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center sm:justify-start gap-3 w-full p-2 sm:p-3 rounded-md border border-neutral-800 shadow-2xl text-white hover:bg-neutral-950/90 cursor-pointer hover:scale-[1.02] transition transform bg-neutral-950/60 backdrop-blur-sm"
          >
            <LogOut size={20} />
            {isOpen && <span className="cursor-pointer text-sm sm:text-base">Logout</span>}
          </button>
        </div>
      </aside>

      {loading && <LoadingOverlay />}
    </>
  );
};

export default Sidebar;