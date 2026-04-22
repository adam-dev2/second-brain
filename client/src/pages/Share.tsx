import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingAtom } from "../store/atoms/loading";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingOverlay from "../components/Loading";
import { ExternalLink, Globe, Lock } from "lucide-react";
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

interface PaginationData {
  totalCards: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Share = () => {
  const params = useParams();
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const [cards, setCards] = useState<Card[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchCards = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/v1/brain/${params.id}?page=${page}&limit=20`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.data.ShareableCards);
      setCards(res.data.ShareableCards);
      setPagination(res.data.pagination);
      toast.success(`Fetched ${res.data.ShareableCards.length} cards`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(1);
  });

  const handlePageChange = (page: number) => {
    fetchCards(page);
  };

  return (
    <>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Shared Brain</h1>
              <p className="text-gray-600">Explore the collection of shared cards</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1">
              {Array.isArray(cards) &&
                cards.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden"
                    >
                      {/* Rank Badge */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {idx + 1}
                      </div>

                      {/* Decorative Top Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-gray-400 via-gray-600 to-gray-800"></div>

                      <div className="flex items-start justify-between gap-3 flex-1 mt-2">
                        <h1 className="flex-1 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
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
                            item.share ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
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
                  );
                })}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCards)} of {pagination.totalCards} shared cards
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            pageNum === pagination.currentPage
                              ? "bg-gray-800 text-white"
                              : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {Array.isArray(cards) && cards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No cards found in this shared brain.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Share;
