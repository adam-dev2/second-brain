import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingAtom } from "../store/atoms/loading";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingOverlay from "../components/Loading";
import { ExternalLink, Globe, Lock } from "lucide-react";
import Layout from "../layouts/Layout";
import Pagination from "../components/Pagination";
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
      setCards(res.data.cards);
      setPagination(res.data.pagination);
      // toast.success(`Fetched ${res.data.ShareableCards.length} cards`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(1);
  },[]);

  const handlePageChange = (page: number) => {
    fetchCards(page);
  };

  return (
  <>
    {loading ? (
      <LoadingOverlay />
    ) : (
      <Layout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight">Shared Brain</h1>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1">
              Explore the collection of shared cards
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1">
            {Array.isArray(cards) &&
              cards.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col bg-white/60 dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 rounded-2xl p-5 transition-all duration-300 overflow-hidden"
                >
                  {/* Decorative top bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
                  <div className="absolute top-4 right-4 w-7 h-7 bg-black/90 dark:bg-white/10 border border-white/[0.08] rounded-full flex items-center justify-center text-white dark:text-white text-xs font-bold">
                    {idx + 1}
                  </div>
                  <h2 className="flex-1 text-base font-bold text-neutral-900 dark:text-white line-clamp-2 pr-8 mt-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    {item.title}
                  </h2>
                  <div className="flex items-center justify-between mt-4 gap-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium group/link truncate flex-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                      <span className="truncate">Visit Link</span>
                    </a>

                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 ${
                        item.share
                          ? "bg-black/90 dark:bg-white/10 text-white dark:text-white border border-white/[0.08]"
                          : "bg-black/[0.06] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 border border-black/10 dark:border-white/10"
                      }`}
                    >
                      {item.share ? (
                        <><Globe className="w-3 h-3" /> Public</>
                      ) : (
                        <><Lock className="w-3 h-3" /> Private</>
                      )}
                    </span>
                  </div>

                  {/* Tags */}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-black/[0.05] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 text-xs font-medium rounded-lg px-2.5 py-1 border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition-all cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer dates */}
                  <div className="flex justify-between items-center text-xs text-neutral-400 dark:text-neutral-600 pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                    <span className="flex items-center gap-1">
                      <span>Created</span>
                      <span className="text-neutral-600 dark:text-neutral-400 font-medium">{item.createdAt?.slice(0, 10)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>Updated</span>
                      <span className="text-neutral-600 dark:text-neutral-400 font-medium">{item.updatedAt?.slice(0, 10)}</span>
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* PAGINATION */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalCards}
                limit={pagination.limit}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={handlePageChange}
                itemLabel="shared cards"
              />
            </div>
          )}

          {/* EMPTY STATE */}
          {Array.isArray(cards) && cards.length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-12">
              No cards found in this shared brain.
            </p>
          )}

        </div>
      </Layout>
    )}
  </>
);
};

export default Share;
