import { NavLink, useNavigate } from "react-router-dom"
import { LogOut, ChevronLeft, ChevronRight,LayoutDashboard,FileStack,Tags,Search,UserRoundPen } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { sidebarAtom } from "../store/atoms/sidebar"

const Sidebar = () => {
  const isOpen = useRecoilValue(sidebarAtom)
  const setIsOpen = useSetRecoilState(sidebarAtom)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/logout", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      console.log(res?.data)
      navigate("/")
      toast.success("Logged out successfully")
    } catch (err) {
      console.log(err)
      toast.error("Failed to logout")
    }
  }

  const links = [
    { path: "/home/dashboard", label: "Dashboard", },
    { path: "/home/cards", label: "Cards" },
    { path: "/home/tags", label: "Tags" },
    { path: "/home/search", label: "Search" },
    { path: "/home/profile", label: "Profile" },
  ]

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } fixed top-0 left-0 h-full bg-linear-to-t from-gray-900 to-gray-700 text-white flex flex-col p-4 border-r border-gray-600 shadow-2xl transition-all duration-300`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-8 mt-2">
        {isOpen && <h1 className="text-xl font-bold whitespace-nowrap">Second Brain</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-600 transition"
        >
          {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-3">
        {links.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md transition-all ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <span className={`${!isOpen && "hidden"} md:inline`}>{isOpen?label:label==="Dashboard"?<LayoutDashboard size={22} />:label==="Cards"?<FileStack size={22} />:label==="Tags"?<Tags size={22} />:label==="Search"?<Search size={22} />:<UserRoundPen size={22} />}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="cursor-pointer flex gap-3 items-center justify-center text-gray-100 p-3 rounded-2xl border border-gray-600 text-md w-full hover:scale-[1.02] transition"
        >
          <LogOut className="my-auto" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
