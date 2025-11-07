import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useRecoilValue } from "recoil";
import { sidebarAtom } from "../store/atoms/sidebar";

const DashboardLayout = () => {
  const isOpen = useRecoilValue(sidebarAtom);
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <main
          className={`flex-1 z-10 bg-white h-full my-0 py-0 ${isOpen ? "ml-64" : "ml-20"} transform`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
