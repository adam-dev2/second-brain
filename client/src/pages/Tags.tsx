import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { allcardsAtom } from "../store/atoms/allcards";
import Card from "../components/Card";
import { sidebarAtom } from "../store/atoms/sidebar";

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
  const isOpen = useRecoilValue(sidebarAtom)
  

  // Extract unique tags
  const sampleData = [...new Set(allCards.flatMap(item => item.tags))];

  const toggleTag = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter cards whenever selected tags change
  useEffect(() => {
    if (selected.length === 0) {
      setFilterCards(allCards);
    } else {
      const filtered = allCards.filter(card =>
        selected.some(tag => card.tags.includes(tag))
      );
      setFilterCards(filtered);
    }
  }, [selected, allCards]);

  return (
    <div className="h-full w-full p-9">
      <div className="items-center py-4">
        <h1 className="text-3xl text-gray-800 mb-4 font-semibold">Tags</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(sampleData) && sampleData.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer text-md font-medium rounded-lg px-3 py-1.5 border border-blue-200 transition ${
                selected.includes(tag)
                  ? "bg-gray-700 text-blue-50"
                  : "bg-blue-50 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
         <div className={`grid gap-3 ${isOpen ? "lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1"}`}>
          {Array.isArray(filterCards) && filterCards.map((item) => (
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
    </div>
  );
};

export default Tags;