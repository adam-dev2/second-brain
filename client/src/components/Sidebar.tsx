import { NavLink } from "react-router-dom"
import {LogOut} from 'lucide-react'
const Sidebar = () => {
    const links = [
        {path: "/home/dashboard", label: "Dashboard"},
        {path: "/home/cards", label: "Cards"},
        {path: "/home/tags", label: "Tags"},
        {path: "/home/search", label: "Search"},
        {path: "/home/profile", label: "Profile"}
    ]
  return (
    <>
       <aside className="w-64 h-screen bg-linear-to-t  from-gray-900 to-gray-700 text-white flex flex-col p-4 fixed left-0 top-0 border-r border-r-gray-600 shadow-2xl">
        <h1 className="text-xl font-bold mb-8 mt-4">Second Brain</h1>
        <nav className="flex flex-col gap-3">
            {links.map(({ path, label }) => (
            <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                `p-2 rounded-md transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`
                }
            >
                {label}
            </NavLink>
            ))}
        </nav>
        <div className="fixed bottom-4 w-56">
            <button className="flex gap-3 justify-center px-5 text-gray-100 p-3 rounded-2xl border border-gray-600 text-md w-full cursor-pointer hover:scale-102 transition">
                <span className="p-0">Logout</span>
                <LogOut className="my-auto" />
            </button>
        </div>
        </aside>
    </>
  )
}

export default Sidebar