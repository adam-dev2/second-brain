import { SearchIcon } from "lucide-react";

const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="w-full p-9 pt-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Elastic Search</h1>
        <p className="text-gray-600 mt-1">Find cards by meaning, not just keywords</p>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-2 hover:shadow-2xl transition-shadow mt-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                disabled
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-gray-400 text-lg"
                placeholder="Ask anything... e.g., 'authentication security patterns'"
              />
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Top</span>
              <input disabled type="number" className="w-12 bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none text-center text-gray-400 font-medium" />
            </div>
            <button disabled className="hidden md:flex px-8 py-4 bg-gray-300 text-white text-lg font-semibold rounded-xl shadow-lg items-center gap-2 cursor-not-allowed">
              <SearchIcon className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
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
  );
};

export default SearchResultsSkeleton