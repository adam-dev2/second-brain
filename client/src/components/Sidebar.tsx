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
import { SignupFormAtom } from "../store/atoms/signupform";
import { loadingAtom } from "../store/atoms/loading";

import LoadingOverlay from "../components/Loading";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Sidebar = () => {
  const isOpen = useRecoilValue(sidebarAtom);
  const setIsOpen = useSetRecoilState(sidebarAtom);
  const navigate = useNavigate();
  const setFormData = useSetRecoilState(SignupFormAtom);
  const loading = useRecoilValue(loadingAtom);
    const setLoading = useSetRecoilState(loadingAtom);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/v1/auth/logout`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log(res?.data);

      navigate("/");
      setFormData((prev) => ({ ...prev, username: "", email: "", password: "" }));
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
    <>
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } fixed top-0 left-0 h-full bg-black text-white flex flex-col p-4 border-r border-white/10 shadow-2xl transition-all duration-300 z-50`}
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
                isActive ? "bg-white text-black font-semibold" : "text-white hover:bg-neutral-900"
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:block fixed hidden top-0 md:top-3 ${isOpen ? "left-60" : "left-5"} p-2 rounded-lg bg-black transition-all`}
      >
        {isOpen ? <ChevronLeft  size={22} /> : <ChevronRight size={22} />}
      </button>
    </aside>
    {loading && <LoadingOverlay/>}
    </>
  );
};

export default Sidebar;
