import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useRecoilValue } from "recoil"
import { sidebarAtom } from "../store/atoms/sidebar"

const DashboardLayout = () => {
  const isOpen = useRecoilValue(sidebarAtom);
  return (
    <>
        <div className="flex min-h-screen">
            <Sidebar />
            <main className={`flex-1 bg-gray-100 min-h-screen ${isOpen ? "ml-64" : "ml-20"} transform`}>
                <Outlet />
            </main>
        </div>
    </>
  )
}

export default DashboardLayout