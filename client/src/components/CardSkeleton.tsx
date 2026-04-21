import { Plus, Share2 } from "lucide-react";

const CardSkeleton: React.FC = () => {
  return (
    <>
        <div className="min-h-screen w-full p-9">
    <div className="">
            <h1 className="text-4xl font-semibold text-gray-800 tracking-tight py-4">
              Cards
            </h1>
            <div className="flex items-center justify-between pb-4">
              <div className="flex justify-start  md:justify-end-safe w-full mr-4">
                <input
                  type="text"
                  className="border border-gray-400 rounded-2xl bg-gray-50 p-2 outline-none placeholder:opacity-45  focus-within:scale-103 transition "
                  placeholder="eg: Title"
                  />
              </div>
              <div className={`flex flex-row items-center gap-3`}>
                <button
                  className="cursor-pointer flex items-center gap-2 bg-zinc-900 text-gray-100 hover:text-gray-800 hover:border hover:border-gray-700 font-medium rounded-full py-2 px-4 hover:bg-zinc-200 hover:scale-[1.03] transition-all duration-150"
                  >
                  <Plus size={20} />
                  <span >Add</span>
                </button>
                <button
                  className="cursor-pointer flex items-center gap-2 bg-red-50 text-red-400 font-medium rounded-full py-2 px-4 border border-red-400 hover:bg-red-100 hover:text-red-500 hover:scale-[1.03] transition-all duration-200"
                  >
                  <Share2 size={20} />
                  <span >Share</span>
                </button>
              </div>
            </div>
          </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
              <div className="skeleton h-full" style={{ width: `${90 - i * 10}%` }} />
            </div>
            <div className="absolute top-4 right-4 skeleton w-8 h-8 rounded-full" />
            <div className="flex flex-col gap-2 mt-2 pr-10">
              <div className="skeleton h-5 w-full rounded-md" />
              <div className="skeleton h-5 w-2/3 rounded-md" />
            </div>
            <div className="flex items-center justify-between mt-4 gap-3">
              <div className="skeleton h-4 w-24 rounded-md" />
              <div className="skeleton h-7 w-20 rounded-full" />
            </div>
            <div className="flex gap-2 mt-4">
              <div className="skeleton h-7 w-16 rounded-lg" />
              <div className="skeleton h-7 w-20 rounded-lg" />
              <div className="skeleton h-7 w-14 rounded-lg" />
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
              <div className="skeleton h-3 w-28 rounded-md" />
              <div className="skeleton h-3 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>
                
    </div>
        </>
  );
};


export default CardSkeleton