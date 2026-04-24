import { useEffect, useState, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { allcardsAtom } from "../store/atoms/allcards";
import Card from "../components/Card";
import { sidebarAtom } from "../store/atoms/sidebar";
import { ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { loadingAtom } from "../store/atoms/loading";
import axios from "axios";
import LoadingOverlay from "../components/Loading";
import { hideIconAtom } from "../store/atoms/hideIcons";
import Layout from "../layouts/Layout";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Card {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const Tags = () => {
  const allCards = useRecoilValue(allcardsAtom);
  const [filterCards, setFilterCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const isOpen = useRecoilValue(sidebarAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const setAllCards = useSetRecoilState(allcardsAtom);
  const setHideIcons = useSetRecoilState(hideIconAtom);

  const sampleData = [...new Set(allCards.flatMap((item) => item.tags))];

  const filteredTags = sampleData.filter((tag) => tag.toLowerCase().includes(search.toLowerCase()));

  const toggleTag = (tag: string) => {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleClearFilter = () => {
    setSelected([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    setHideIcons(false);
    const fetchCards = async () => {
      const token = Cookies.get("token");
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/v1/content/cards`, {
          params:{limit:100},
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAllCards(res.data.cards);
        // toast.success("Fetched all cards successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch cards");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },[]);

  useEffect(() => {
    if (selected.length === 0) {
      setFilterCards(allCards);
    } else {
      const filtered = allCards.filter((card) => selected.some((tag) => card.tags.includes(tag)));
      setFilterCards(filtered);
    }
  }, [selected, allCards]);

  return (
  <Layout>
    {loading ? (
      <LoadingOverlay />
    ) : (
      <div>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Tags</h1>

          <div className="flex justify-end mt-4">
            {selected.length > 0 && (
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 text-sm rounded-full bg-white text-black font-medium hover:scale-[1.03] transition"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* TAG SELECT DROPDOWN */}
        <div className="relative mb-6" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(true)}
            className="w-full dark:bg-neutral-900 bg-white/80 border dark:border-white/[0.08] border-black/20 rounded-xl px-3 py-2 cursor-text"
          >
            <div className="flex flex-wrap gap-2 items-center">

              {/* SELECTED TAGS */}
              {selected.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 text-xs px-2 py-1 rounded-md dark:bg-white/[0.08] bg-black/4 text-neutral-500"
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(tag);
                    }}
                    className="hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {/* INPUT */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder={
                  selected.length === 0 ? "Search or select tags..." : ""
                }
                className="bg-transparent outline-none flex-1 text-sm text-neutral-500 placeholder:text-neutral-500"
              />

              <ChevronDown className="text-neutral-500" size={16} />
            </div>
          </div>

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="absolute mt-2 w-full max-h-56 overflow-y-auto rounded-xl border dark:border-white/[0.08] border-black/10 dark:bg-neutral-900 bg-white/80 shadow-xl z-20">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => {
                      toggleTag(tag);
                      setSearch("");
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/[0.06] ${
                      selected.includes(tag)
                        ? "dark:bg-white/[0.08] bg-black/10 dark:text-white text-black"
                        : "text-neutral-500"
                    }`}
                  >
                    {tag}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-neutral-500">
                  No matching tags
                </div>
              )}
            </div>
          )}
        </div>

        {/* GRID */}
        <div
          className={`grid gap-4 ${
            isOpen
              ? "lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1"
              : "md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1"
          }`}
        >
          {Array.isArray(filterCards) &&
            filterCards.map((item) => (
              <Card
                key={item._id}
                title={item.title}
                link={item.link}
                tags={item.tags}
                share={item.share}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
                id={item._id}
              />
            ))}
        </div>

        {/* EMPTY STATE */}
        {allCards.length === 0 && (
          <p className="text-neutral-500 text-sm text-center py-10">
            No tags yet. Create your first card with tags.
          </p>
        )}
      </div>
    )}
  </Layout>
);
};

export default Tags;
