import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileStack,
  Tags,
  Search,
  UserRoundPen,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sidebarAtom } from "../store/atoms/sidebar";
import { SignupFormAtom } from "../store/atoms/signupform";
import { loadingAtom } from "../store/atoms/loading";
import { useAuth } from "../context/AuthContext";
import LoadingOverlay from "../components/Loading";
import { useState } from "react";


const Sidebar = () => {
  const { logout } = useAuth();
  const isOpen = useRecoilValue(sidebarAtom);
  const setIsOpen = useSetRecoilState(sidebarAtom);
  const navigate = useNavigate();
  const setFormData = useSetRecoilState(SignupFormAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const [isMobile, setIsMobile] = useState(false);


  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      toast.success("Logged out successfully");
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
    setIsMobile(false);
  };

  const handleMobileOverlayClick = () => {
    setIsMobile(false);
  };

  const links = [
    { path: "/home/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/home/cards", label: "Cards", icon: FileStack },
    { path: "/home/tags", label: "Tags", icon: Tags },
    { path: "/home/search", label: "Search", icon: Search },
    { path: "/home/profile", label: "Profile", icon: UserRoundPen },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleMobileOverlayClick}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-black text-white flex flex-col border-r border-white/10 shadow-2xl transition-all duration-300 z-50 ${
          isMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Second Brain</h2>
        <button
            onClick={() => setIsMobile(false)}
            className={`${isMobile?"fixed":"hidden"} top-4 left-60 p-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-all z-30 md:hidden`}
          >
            <ChevronLeft size={22} />
          </button>
          
        </div>
        {/* Mobile Navigation Links */}
        <nav className="flex flex-col gap-2 p-4 flex-1">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-white hover:bg-neutral-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`shrink-0 ${isActive ? "text-black" : "text-white"}`}
                    size={20}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-md border border-neutral-800 text-white hover:bg-black/90 cursor-pointer hover:scale-[1.02] transition transform"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobile(!isMobile)}
        className="fixed top-4 p-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-all z-30 md:hidden"
      >
        {isMobile ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } fixed top-0 left-0 h-full bg-black text-white flex-col p-4 border-r border-white/10 shadow-2xl transition-all duration-300 z-50 hidden md:flex`}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-between m-0 md:mb-10 md:mt-2 overflow-hidden">
          <h1
            className={`text-sm sm:text-2xl font-bold tracking-wide text-white whitespace-nowrap transition-all duration-300 ${
              isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            Second Brain
          </h1>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-2 sm:gap-3 ">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `relative flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } gap-3 p-2 rounded-md transition-all text-sm sm:text-base ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-white hover:bg-neutral-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`shrink-0 ${
                      isOpen ? "ml-1" : ""
                    } ${isActive ? "text-black" : "text-white"}`}
                    size={isOpen ? 20 : 24}
                  />
                  {isOpen && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center sm:justify-start gap-3 w-full p-2 sm:p-3 rounded-md border border-neutral-800 shadow-2xl text-white hover:bg-black/90 cursor-pointer hover:scale-[1.02] transition transform"
          >
            <LogOut size={20} />
            {isOpen && <span className="cursor-pointer text-sm sm:text-base">Logout</span>}
          </button>
        </div>

        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:block fixed hidden top-0 md:top-3 ${
            isOpen ? "left-60" : "left-5"
          } p-2 rounded-lg bg-black transition-all`}
        >
          {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </aside>

      {loading && <LoadingOverlay />}
    </>
  );
};

export default Sidebar;