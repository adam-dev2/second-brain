import axios from "axios";
import { ExternalLink, Globe, Lock, EllipsisVertical, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { allcardsAtom } from "../store/atoms/allcards";
import { formdataAtom } from "../store/atoms/formData";
import { modalAtom } from "../store/atoms/modal";
import { editCardAtom } from "../store/atoms/editcard";
import { loadingAtom } from "../store/atoms/loading";
import { hideIconAtom } from "../store/atoms/hideIcons";
import { handleError } from "../utils/handleError";
import { useEffect, useRef, useState } from "react";
import { sectionsAtom } from "../store/atoms/sections";
import { secitonCardsAtom } from "../store/atoms/sectionCards";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface Iprops {
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  index?: number;
}

const Card = (props: Iprops) => {
  const allCards = useRecoilValue(allcardsAtom);
  const setAllCards = useSetRecoilState(allcardsAtom);
  const setFormdata = useSetRecoilState(formdataAtom);
  const setModal = useSetRecoilState(modalAtom);
  const setEditCardId = useSetRecoilState(editCardAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const hideIcons = useRecoilValue(hideIconAtom);
  const setHideIcons = useSetRecoilState(hideIconAtom);
  const [sheet,setSheet] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const sections = useRecoilValue(sectionsAtom);
  const setSectionCards = useSetRecoilState(secitonCardsAtom);
  const sectionCards = useRecoilValue(secitonCardsAtom);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setSheet(false);
        setShowSections(false);
      }
    };

    if (sheet) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sheet]);

  const handleEdit = async () => {
    const findCard = allCards.find((item) => item._id === props.id);
    if (findCard) {
      setFormdata((prev) => ({
        ...prev,
        title: findCard.title,
        link: findCard.link,
        tags: findCard.tags,
        type: findCard.type,
        share: findCard.share,
        heading: "Edit Card",
        button: "Save Details",
      }));
    }

    setModal((prev) => !prev);
    setEditCardId(props.id);
    setHideIcons(true);
  };

  const handleSheet = () => {
    setSheet(prev => !prev);
    setShowSections(false); 
  };

  const handleSections = () => {
    setShowSections(true);
  };
 
   const handleMove = async (sectionId:string,cardId:string,sectionName:string) => {
    const token = Cookies.get("token");
    
    try {
        const response = await axios.post(`${backendUrl}/api/v1/section/move-card`,
        {
          sectionId,
          cardId
        },
        {
          withCredentials:true,
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":'application/json'
          }
        }
      )
      console.log(response.data.message);
      
      toast.success(`moved card to ${sectionName}`)
    }catch(err) {
      handleError(err,'Error while moving card')
    }
  };

  const handleDelete = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      await axios.delete(`${backendUrl}/api/v1/content/card/${props.id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAllCards(allCards.filter((item) => item._id !== props.id));
      setSectionCards(sectionCards.filter((item) => item.id !== props.id));
      toast.success("Card Deleted successfully");
    } catch (err: unknown) {
      handleError(err, "Failed to Delete Card");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="group relative bg-white/70 dark:bg-neutral-900 border border-black/20 dark:border-white/[0.08] rounded-2xl p-5 hover:border-black/25 dark:hover:border-white/[0.15] transition-all duration-300">

    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-black/8 dark:border-white/[0.06] rounded-bl-2xl" />

    {/* index badge */}
    {props.index !== undefined && (
      <div className="absolute top-4 right-4 w-7 h-7 bg-black/[0.08] dark:bg-white/[0.1] rounded-full flex items-center justify-center text-[11px] font-semibold text-neutral-700 dark:text-white">
        {props.index + 1}
      </div>
    )}

    <div className="flex items-start justify-between gap-3">
      <h1 className="flex-1 text-sm font-medium text-neutral-600 dark:text-neutral-200 line-clamp-2 group-hover:text-neutral-900 dark:group-hover:text-white transition">
        {props.title}
      </h1>

      {hideIcons && (
        <div className="relative">
          <button
            onClick={handleSheet}
            className="p-1.5 rounded-lg hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition"
          >
            <EllipsisVertical
              size={16}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            />
          </button>

          {sheet && (
            <div
              ref={sheetRef}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] rounded-lg shadow-xl z-20 text-sm text-neutral-700 dark:text-neutral-200"
              onMouseLeave={() => {
                setSheet(false);
                setShowSections(false);
              }}
            >
              {!showSections ? (
                <>
                  <button onClick={handleEdit} className="w-full px-3 py-2 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="w-full px-3 py-2 text-left text-red-500 dark:text-red-400 hover:bg-red-500/10">
                    Delete
                  </button>
                  <button
                    onClick={handleSections}
                    className="w-full px-3 py-2 flex justify-between items-center hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    Move
                    <ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSections(false)}
                    className="w-full px-3 py-2 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    ← Back
                  </button>

                  {sections.length === 0 ? (
                      <div className="px-3 py-3 text-center">
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          No sections yet
                        </p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                          Create one in the Sections panel
                        </p>
                      </div>
                    ) : (sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleMove(section.id, props.id, section.label)}
                      className="w-full px-3 py-2 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    >
                      {section.label}
                    </button>
                  )))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>

    {/* LINK + STATUS */}
    <div className="flex items-center justify-between mt-4 gap-3">
      <a
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs truncate flex-1 flex items-center gap-1.5 transition"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Visit Link
      </a>

      <span
        className={`px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1 ${
          props.share
            ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
            : "bg-black/[0.06] dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-300"
        }`}
      >
        {props.share ? (
          <Globe className="w-3 h-3" />
        ) : (
          <Lock className="w-3 h-3" />
        )}
        {props.share ? "Public" : "Private"}
      </span>
    </div>

    {/* TAGS */}
    <div className="flex flex-wrap gap-2 mt-4">
      {props.tags.map((tag, index) => (
        <span
          key={index}
          className="text-[11px] px-2 py-1 rounded-md bg-black/[0.06] dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-300 hover:bg-black/[0.1] dark:hover:bg-white/[0.1] transition"
        >
          #{tag}
        </span>
      ))}
    </div>

    {/* DATES */}
    <div className="flex justify-between text-[11px] text-neutral-400 dark:text-neutral-500 mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
      <span>{props.createdAt?.slice(0, 10)}</span>
      <span>{props.updatedAt?.slice(0, 10)}</span>
    </div>

  </div>
);
};

export default Card;
