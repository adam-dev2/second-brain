import { useRecoilValue, useSetRecoilState } from "recoil";
import { searchAtom } from "../store/atoms/search";
import React, { useEffect, useState, type KeyboardEvent } from "react";
import { loadingAtom } from "../store/atoms/loading";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { sidebarAtom } from "../store/atoms/sidebar";
import { hideIconAtom } from "../store/atoms/hideIcons";
import { Search as SearchIcon, ExternalLink, Lock, Globe } from "lucide-react";
import { handleError } from "../utils/handleError";
import SearchResultsSkeleton from "../components/SearchResultsSkeleton";
import Layout from "../layouts/Layout";
import Card from "../components/Card";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface CardData {
  id: string;
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  relevanceScore?: number;
}

interface PaginationData {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Search = () => {
  const search = useRecoilValue(searchAtom);
  const setSearch = useSetRecoilState(searchAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const [queryCards, setQueryCards] = useState<CardData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const isOpen = useRecoilValue(sidebarAtom);
  const setHideIcons = useSetRecoilState(hideIconAtom);
  const [limit, setLimit] = useState("10");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setHideIcons(true);
  },[]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const fetchQuery = async (page: number = 1) => {
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

    try {
      const res = await axios.post(
        `${backendUrl}/api/v1/content/query?page=${page}&limit=${limit}`,
        { query: search },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQueryCards(res.data.queryCards);
      setPagination(res.data.pagination);
      toast.success(`Found ${res.data.pagination.totalResults} relevant results`);
    } catch (err: unknown) {
      handleError(err, "Error while fetching query results");
      console.log(err);
      setQueryCards([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchQuery(1); // Reset to first page on new search
    }
  };

  const handleSearch = () => fetchQuery(1); // Reset to first page on new search

  const handlePageChange = (page: number) => {
    fetchQuery(page);
  };

  return (
  <Layout>
    {loading ? (
      <SearchResultsSkeleton />
    ) : (
      <div>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Elastic Search
          </h1>
          <p className="text-neutral-500 text-sm">
            Find cards by meaning, not just keywords
          </p>

          {/* SEARCH BAR */}
          <div className="mt-6 bg-neutral-900 border border-white/[0.08] rounded-2xl p-3">
            <div className="flex gap-3 flex-wrap">

              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  onKeyDown={handleKeyDown}
                  value={search}
                  type="text"
                  className="w-full pl-10 pr-3 py-3 bg-transparent outline-none text-sm text-white placeholder:text-neutral-500"
                  placeholder="Ask anything... e.g., 'authentication security patterns'"
                  onChange={handleChange}
                />
              </div>

              {/* LIMIT */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] rounded-xl border border-white/[0.08]">
                <span className="text-neutral-400 text-xs">Top</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-12 bg-transparent border border-white/[0.08] rounded px-1 py-0.5 outline-none text-center text-white text-xs"
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={handleSearch}
                className="px-5 py-3 bg-white text-black text-sm font-medium rounded-xl hover:scale-[1.03] transition"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        {hasSearched && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Search Results{" "}
              {queryCards.length > 0 && (
                <span className="text-neutral-500 text-sm">
                  ({queryCards.length})
                </span>
              )}
            </h2>

            {queryCards.length > 0 && (
              <p className="text-neutral-500 text-sm mt-1">
                Sorted by relevance using AI semantic matching
              </p>
            )}
          </div>
        )}

        {/* EMPTY (BEFORE SEARCH) */}
        {!hasSearched && (
          <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
            <SearchIcon className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Start exploring your content
            </h3>
            <p className="text-neutral-500 text-sm">
              Search across titles, tags, and more
            </p>
          </div>
        )}

        {/* NO RESULTS */}
        {hasSearched && queryCards.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
            <SearchIcon className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Results Found
            </h3>
            <p className="text-neutral-500 text-sm mb-4">
              Try adjusting your search
            </p>
            <button
              onClick={() => setHasSearched(false)}
              className="text-sm text-neutral-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* RESULTS GRID */}
        {hasSearched && queryCards.length > 0 && (
          <div
            className={`grid gap-4 ${
              isOpen
                ? "lg:grid-cols-2 xl:grid-cols-3"
                : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {queryCards.map((item, idx) => (
              <Card key={idx} {...item} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {hasSearched && pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900 border border-white/[0.08] rounded-2xl p-5">

            <div className="text-xs text-neutral-500">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalResults
              )}{" "}
              of {pagination.totalResults}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handlePageChange(pagination.currentPage - 1)
                }
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1.5 text-xs rounded bg-white/[0.06] text-white disabled:opacity-40"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  handlePageChange(pagination.currentPage + 1)
                }
                disabled={!pagination.hasNextPage}
                className="px-3 py-1.5 text-xs rounded bg-white/[0.06] text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    )}
  </Layout>
);
};

export default Search;
