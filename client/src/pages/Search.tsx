import { useRecoilValue, useSetRecoilState } from "recoil";
import { searchAtom } from "../store/atoms/search";
import { useEffect, useState, type KeyboardEvent } from "react";
import { loadingAtom } from "../store/atoms/loading";
import LoadingOverlay from "../components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { sidebarAtom } from "../store/atoms/sidebar";
import { hideIconAtom } from "../store/atoms/hideIcons";
import { Search as SearchIcon,ExternalLink, Lock, Globe } from "lucide-react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


interface CardData {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  relevanceScore?: number;
}

const Search = () => {
  const search = useRecoilValue(searchAtom);
  const setSearch = useSetRecoilState(searchAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const [queryCards, setQueryCards] = useState<CardData[]>([]);
  const isOpen = useRecoilValue(sidebarAtom);
  const setHideIcons = useSetRecoilState(hideIconAtom);
  const [limit, setLimit] = useState("5");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setHideIcons(true);
  }, []);

  const handleChange = (e: any) => setSearch(e.target.value);

  const fetchQuery = async () => {
    if (search.trim() === "") {
      toast.error("Please enter a search query");
      return;
    }
    if (!limit || parseInt(limit) < 1) {
      toast.error("Please enter a valid limit");
      return;
    }

    const token = Cookies.get("token");
    setLoading(true);
    setHasSearched(true);
    console.log(limit);
    

    try {
      const res = await axios.post(
        `${backendUrl}/api/v1/content/query`,
        { query: search, limit: parseInt(limit) },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQueryCards(res.data.queryCards);
      toast.success(`Found ${res.data.queryCards.length} , ${res.data.limit} relevant results`);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error while fetching query");
      setQueryCards([]);
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchQuery();
    }
  };

  const handleSearch = () => fetchQuery();

  return (
    <>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <div className="h-full w-full p-9 pt-20 m-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  AI-Powered Elastic Search
                </h1>
                <p className="text-gray-600 mt-1">Find cards by meaning, not just keywords</p>
              </div>
            </div>


            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-2 hover:shadow-2xl transition-shadow">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    onKeyDown={handleKeyDown}
                    value={search}
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-lg"
                    placeholder="Ask anything... e.g., 'authentication security patterns'"
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-gray-700 text-sm font-medium whitespace-nowrap">Top</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-12 bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none text-center text-gray-800 font-medium"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gray-800 text-white text-lg font-semibold hover:bg-gray-900 hover:scale-105 active:scale-95 transition-all rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <SearchIcon className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>

            {/* Example Queries */}
            {!hasSearched && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
                
              </div>
            )}
          </div>

          {/* Results Section */}
          {hasSearched && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Search Results
                {queryCards.length > 0 && (
                  <span className="text-lg font-normal text-gray-600">
                    ({queryCards.length} {queryCards.length === 1 ? 'result' : 'results'})
                  </span>
                )}
              </h2>
              {queryCards.length > 0 && (
                <p className="text-gray-600 mt-1">Sorted by relevance using AI semantic matching</p>
              )}
            </div>
          )}

          {/* Query Result Cards */}
          {hasSearched && queryCards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search query or check your spelling</p>
              <button
                onClick={() => setHasSearched(false)}
                className="text-gray-800 hover:text-gray-900 font-medium underline"
              >
                Try a different search
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                isOpen
                  ? "lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1"
                  : "md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1"
              }`}
            >
              {queryCards.map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {idx + 1}
                  </div>

                  {item.relevanceScore && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                      <div 
                        className="h-full bg-gray-800 transition-all"
                        style={{ width: `${item.relevanceScore * 100}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 flex-1 mt-2 ">
                    <h1 className="flex-1 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors text-wrap">
                      {item.title}
                    </h1>
                  </div>

                  <div className="flex items-center justify-between mt-4 gap-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-gray-900 text-sm truncate flex-1 hover:underline transition-colors font-medium flex items-center gap-1.5 group/link"
                    >
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      Visit Link
                    </a>
                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
                        item.share
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {item.share ? (
                        <>
                          <Globe className="w-3 h-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          Private
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg px-3 py-1.5 border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 pt-4 mt-4 border-t border-gray-200">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-gray-700">{item.createdAt?.slice(0, 10)}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="text-gray-400">Updated:</span>
                      <span className="text-gray-700">{item.updatedAt?.slice(0, 10)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Search;