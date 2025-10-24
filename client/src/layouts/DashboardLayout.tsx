import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const DashboardLayout = () => {
  return (
    <>
        <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 bg-gray-100 min-h-screen">
                <Outlet />
            </main>
        </div>
    </>
  )
}

export default DashboardLayout