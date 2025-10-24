import { useState } from "react";

const Tags = () => {
  const sampleTags = ["google", "engine", "search"];
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="h-full w-full p-9">
      <div className="items-center py-4">
        <h1 className="text-3xl text-gray-800 mb-4 font-semibold">Tags</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {sampleTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer text-md font-medium rounded-lg px-3 py-1.5 border border-blue-200 transition ${
                selected.includes(tag)
                  ? "bg-blue-700 text-blue-50"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
