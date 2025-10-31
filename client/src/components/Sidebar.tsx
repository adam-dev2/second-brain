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
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sidebarAtom } from "../store/atoms/sidebar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Sidebar = () => {
  const isOpen = useRecoilValue(sidebarAtom);
  const setIsOpen = useSetRecoilState(sidebarAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/v1/logout`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log(res?.data);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to logout");
    }
  };

  const links = [
    { path: "/home/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/home/cards", label: "Cards", icon: FileStack },
    { path: "/home/tags", label: "Tags", icon: Tags },
    { path: "/home/search", label: "Search", icon: Search, featured: false },
    { path: "/home/profile", label: "Profile", icon: UserRoundPen },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } fixed top-0 left-0 h-full bg-linear-to-t from-gray-900 to-gray-700 text-white flex flex-col p-4 border-r border-gray-600 shadow-2xl transition-all duration-300 z-50`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-8 mt-2">
        {isOpen && (
          <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">
            Second Brain
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-600 transition"
        >
          {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-2 sm:gap-3">
        {links.map(({ path, label, icon: Icon, featured }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `relative flex items-center ${
                isOpen ? "justify-start" : "justify-center"
              } gap-3 p-2 rounded-md transition-all text-sm sm:text-base ${
                featured
                  ? `bg-linear-to-br from-gray-200 to-gray-50 text-gray-900 hover:from-white hover:to-gray-50 shadow-xl ${
                      isActive ? "ring-2 ring-gray-300" : ""
                    }`
                  : isActive
                  ? "bg-gray-700 text-white"
                  : "text-white hover:bg-gray-800"
              }`
            }
          >
            <Icon
              className={`shrink-0 ${
                featured ? "text-gray-900" : "text-gray-200"
              }`}
              size={isOpen ? 20 : 24}
            />
            {isOpen && (
              <span
                className={`truncate text-sm sm:text-base ${
                  featured ? "font-bold tracking-wide" : ""
                }`}
              >
                {label}
              </span>
            )}
            {featured && (
              <div className="absolute inset-0 rounded-md bg-linear-to-r from-transparent via-white to-transparent opacity-30 blur-sm -z-10"></div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center sm:justify-start gap-3 w-full p-2 sm:p-3 rounded-xl border border-gray-600 text-gray-100 hover:scale-[1.02] transition transform"
        >
          <LogOut size={20} />
          {isOpen && <span className="cursor-pointer text-sm sm:text-base">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;