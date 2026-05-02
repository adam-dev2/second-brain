import { Outlet, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sidebarAtom } from "../store/atoms/sidebar";
import DeleteConfirmation from "../components/DeletConfirmation";
import { deleteSectionAtom } from "../store/atoms/deleteSection";
import Cookies from "js-cookie";
import { loadingAtom } from "../store/atoms/loading";
import toast from "react-hot-toast";
import axios from "axios";
import { sectionsAtom } from "../store/atoms/sections";
import { handleError } from "../utils/handleError";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const DashboardLayout = () => {
  const isOpen = useRecoilValue(sidebarAtom);
  const deleteSection = useRecoilValue(deleteSectionAtom);
  const setDeleteSection = useSetRecoilState(deleteSectionAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const sections = useRecoilValue(sectionsAtom);
  const setSections = useSetRecoilState(sectionsAtom);
  const navigate = useNavigate();
  const { id } = useParams();
  

  const handleOnClose = () => {
    console.log(deleteSection);
    
    setDeleteSection((prev) => ({
      ...prev,
      deletion:!prev.deletion,
      sectionId:id!
    }));
  }

  const handleDelete = async (deleteAll:boolean) => {
      const token = Cookies.get("token");
      setLoading(true);
      const sectionId = deleteSection.sectionId
      
      if(!sectionId) {
        toast.error("Section Id is required");
        return
      }
      try{
        let response;
        if(deleteAll) {
          response = await axios.post(`${backendUrl}/api/v1/section/delete-all`,
            {
              sectionId
            },
            {
            withCredentials:true,
            headers:{
              Authorization:`Bearer ${token}`,
              "Content-Type":'application/json'
            }
          })
        }else {
          response = await axios.delete(
          `${backendUrl}/api/v1/section/${sectionId}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
        console.log(response.data.message);
        toast.success("Deleted successfully");
        const updatedSections = sections.filter(
          (section) => section.id !== sectionId
        );
      setSections(updatedSections);
      if (updatedSections.length === 0) {
        navigate("/home/dashboard");
        return;
      }
      const currentIndex = sections.findIndex(
        (section) => section.id === sectionId
      );
      const targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      const targetSection = updatedSections[targetIndex];
  
      navigate(targetSection.path);
      }catch (err: unknown) {
        handleError(err, "Error while sharing brain");
        throw err;
      } finally {
        setLoading(false);
        handleOnClose();
      }
    }
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <main
          className={`flex-1 bg-white h-full my-0 py-0 ${isOpen ? "md:ml-64 ml-0" : "md:ml-20 ml-0"} transform`}
        >
          <>
            {deleteSection.deletion && <DeleteConfirmation
              onClose={handleOnClose} 
              onDeleteAll={() => {handleDelete(true)}} 
              onMoveAndDelete={() => {handleDelete(false)}} 
            />}
          </>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
