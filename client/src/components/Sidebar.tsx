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

const Sidebar = () => {
  const isOpen = useRecoilValue(sidebarAtom);
  const setIsOpen = useSetRecoilState(sidebarAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/logout", {
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
    { path: "/home/search", label: "Search", icon: Search },
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
        {links.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center ${
                isOpen ? "justify-start" : "justify-center"
              } gap-3 p-2 rounded-md transition-all text-sm sm:text-base ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <Icon
              className="shrink-0 text-gray-200"
              size={isOpen ? 20 : 24}
            />
            {isOpen && (
              <span className="truncate text-sm sm:text-base">{label}</span>
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
          {isOpen && <span className="text-sm sm:text-base">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
