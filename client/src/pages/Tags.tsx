import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { allcardsAtom } from "../store/atoms/allcards";
import Card from "../components/Card";
import { sidebarAtom } from "../store/atoms/sidebar";
import {ChevronDown,X} from 'lucide-react'

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

  const sampleData = [...new Set(allCards.flatMap((item) => item.tags))];

  const filteredTags = sampleData.filter((tag) =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selected.length === 0) {
      setFilterCards(allCards);
    } else {
      const filtered = allCards.filter((card) =>
        selected.some((tag) => card.tags.includes(tag))
      );
      setFilterCards(filtered);
    }
  }, [selected, allCards]);

  return (
    <div className="h-full w-full p-9">
      <div className="items-center py-4">
        <h1 className="text-3xl text-gray-800 mb-4 font-semibold">Tags</h1>

        <div className="relative mb-4" ref={dropdownRef}>
          <div
            className="border border-gray-400 rounded-2xl bg-gray-50 p-2 outline-none placeholder:opacity-45 w-full cursor-text transition"
            onClick={() => setShowDropdown(true)}
          >
            <div className="flex flex-wrap gap-2">
              {selected.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-blue-50 px-3 py-1 rounded-xl text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(tag);
                    }}
                    className="text-xs hover:text-red-400"
                  >
                    <X className="cursor-pointer" size={14}/>
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder={selected.length === 0 ? "Search or select tags..." : ""}
                className="bg-transparent outline-none flex-1 text-gray-700"
              />
              <ChevronDown />
            </div>
          </div>

          {showDropdown && (
            <div className="absolute mt-2 w-full max-h-56 overflow-y-auto rounded-xl border border-gray-300 bg-white shadow-lg z-10">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => {
                      toggleTag(tag);
                      setSearch("");
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      selected.includes(tag) ? "bg-gray-200 font-medium" : ""
                    }`}
                  >
                    {tag}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">
                  No matching tags
                </div>
              )}
            </div>
          )}
        </div>
        
        <div
          className={`grid gap-3 ${
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
      </div>

      {allCards.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">
          No tags, Create your first card with relevant tags!!
        </p>
      )}
    </div>
  );
};

export default Tags;
