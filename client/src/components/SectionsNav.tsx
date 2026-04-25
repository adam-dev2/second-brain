import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; // ✅ added useLocation
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronDown, Plus, Hash, Check, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { handleError } from "../utils/handleError";
import Cookies from "js-cookie";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sectionsAtom } from "../store/atoms/sections";
import { deleteSectionAtom } from "../store/atoms/deleteSection";

interface Section {
  id: string;
  path: string;
  label: string;
}

interface SectionsNavProps {
  isOpen: boolean;
  sections: Section[];
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SectionsNav = ({ isOpen }: SectionsNavProps) => {
  const [dropdown, setDropdown] = useState(false);
  const [adding, setAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const setSections = useSetRecoilState(sectionsAtom);
  const sections = useRecoilValue(sectionsAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const setDeleteSection = useSetRecoilState(deleteSectionAtom)

  useEffect(() => {
    if (adding) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [adding]);

  useEffect(() => {
    const token = Cookies.get("token");
    const fetchSections = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/section`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSections(res.data.sections);
      } catch (err) {
        handleError(err, "Error while fetching sections");
      }
    };
    fetchSections();
  }, [setSections]);

  const handleDelete = () => {
    setDeleteSection(true)
  }

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdown(true);
    setAdding(true);
  };

  const handleConfirm = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setAdding(false);
      setInputValue("");
      return;
    }
    const token = Cookies.get("token");
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/section`,
        { name: trimmed },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSections((prev) => [...prev, response.data.section]);
      toast.success("Section added successfully");
    } catch (err) {
      handleError(err, "Error while adding section");
    }
    setInputValue("");
    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") {
      setAdding(false);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header row */}
      <button
        onClick={() => setDropdown((prev) => !prev)}
        className={`flex items-center ${
          isOpen ? "justify-between px-2" : "justify-center"
        } gap-3 p-2 rounded-md text-sm text-white hover:bg-neutral-900 transition-colors duration-150 cursor-pointer w-full`}
      >
        <div className="flex items-center gap-3">
          <Layers size={isOpen ? 20 : 24} className="shrink-0 text-neutral-400" />
          {isOpen && <span className="truncate font-small opacity-60">Sections</span>}
        </div>

        {isOpen && (
          <div className="flex gap-3 items-center">
            <Plus
              size={16}
              className="text-neutral-400 hover:text-white transition-colors"
              onClick={handleAddClick}
            />
            <motion.div
              animate={{ rotate: dropdown ? 0 : -90 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDown size={16} className="text-neutral-400" />
            </motion.div>
          </div>
        )}
      </button>

      {/* Animated dropdown */}
      <AnimatePresence initial={false}>
        {dropdown && (
          <motion.div
            key="sections-dropdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-0.5 mt-1 pb-1">
              {/* Inline input */}
              <AnimatePresence>
                {adding && isOpen && (
                  <motion.div
                    key="section-input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="flex items-center gap-2 pl-8 pr-2 py-1"
                  >
                    <Hash size={12} className="text-neutral-500 shrink-0" />
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Section name..."
                      className="flex-1 bg-neutral-800 text-white text-sm rounded-md px-2 py-1 outline-none border border-neutral-700 focus:border-neutral-500 placeholder-neutral-500 transition-colors min-w-0"
                    />
                    <button
                      onClick={handleConfirm}
                      className="shrink-0 p-1 rounded-md hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                      aria-label="Confirm"
                    >
                      <Check size={13} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              {sections.length === 0 && isOpen && !adding && (
                <p className="text-xs text-neutral-500 px-9 py-2">No sections yet</p>
              )}

              {/* Section items */}
              {sections.map((section, i) => {
                // ✅ useLocation-based active check — no more flicker
                const isActive = location.pathname === `/home/sections/${section.id}`;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.18, ease: "easeOut" }}
                  >
                    <NavLink
                      to={`/home/sections/${section.id}`}
                      className={`flex items-center ${
                        isOpen ? "pl-9 pr-2" : "justify-center"
                      } py-1.5 rounded-md cursor-pointer text-sm ${
                        isActive
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors duration-150"
                      }`}
                    >
                      {isOpen ? (
                        <div className="flex items-center gap-2 w-full justify-between">
                          <div className="flex items-center gap-2">
                            <Hash
                              size={12}
                              className={isActive ? "text-white" : "text-neutral-500"} 
                            />
                            <span className="truncate">{section.label}</span>
                          </div>
                          <Trash2
                            size={14}
                            className="text-red-400 hover:text-red-500 transition-colors"
                            onClick={handleDelete}
                          />
                        </div>
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-white" : "bg-neutral-500"
                          }`}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionsNav;