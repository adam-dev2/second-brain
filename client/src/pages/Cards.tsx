import React, { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import { Share2, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import AddCard from "../components/AddCard";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { modalAtom } from "../store/atoms/modal";
import { allcardsAtom } from "../store/atoms/allcards";
import { loadingAtom } from "../store/atoms/loading";
import { sidebarAtom } from "../store/atoms/sidebar";
import { searchModalAtom } from "../store/atoms/searchModal";
import ShareModal from "../components/ShareModal";
import { sharelink } from "../store/atoms/sharelink";
import { hideIconAtom } from "../store/atoms/hideIcons";
import { cardsRefreshAtom } from "../store/atoms/cardsRefresh";
import { handleError } from "../utils/handleError";
import CardSkeleton from "../components/CardSkeleton";
import Pagination from "../components/Pagination"; // ← import
import Layout from "../layouts/Layout";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface PaginationMeta {
  totalCards: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Cards = () => {
  const setShareLink = useSetRecoilState(sharelink);
  const allCards = useRecoilValue(allcardsAtom);
  const setAllCards = useSetRecoilState(allcardsAtom);
  const modal = useRecoilValue(modalAtom);
  const setModal = useSetRecoilState(modalAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const [search, setSearch] = useState("");
  const isOpen = useRecoilValue(sidebarAtom);
  const searchModal = useRecoilValue(searchModalAtom);
  const setSearchModal = useSetRecoilState(searchModalAtom);
  const setHideIcons = useSetRecoilState(hideIconAtom);
  const [debouncedSearch,setDebouncedSearch] = useState("");
  
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsRefresh = useRecoilValue(cardsRefreshAtom);
  const loadStartTime = useRef<number>(Date.now());

  

  const handleClick = () => setModal((prev) => !prev);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // reset page on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchCards = async (page: number, searchQuery = "") => {
    setHideIcons(true);
    const token = Cookies.get("token");
    setLoading(true);
    loadStartTime.current = Date.now();

    try {
      const res = await axios.get(`${backendUrl}/api/v1/content/cards`, {
        params: { 
          page, 
          limit: 9,
          search: searchQuery
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setAllCards(res.data.cards);
      setPagination(res.data.pagination);

      if (
        res.data.pagination?.totalPages &&
        page > res.data.pagination.totalPages
      ) {
        setCurrentPage(res.data.pagination.totalPages || 1);
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cards");
    } finally {
      const elapsed = Date.now() - loadStartTime.current;
      const remaining = Math.max(0, 1000 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  };

  useEffect(() => {
    fetchCards(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, cardsRefresh]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value.trim();
    setSearch(str);
  };

  const handleShare = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/v1/brain/share`,
        {
          sectionId:null
        },
        {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      // toast.success("Shareable Link generated");
      setSearchModal(true);
      const baseUrl = window.location.origin;
      
      setShareLink(`${baseUrl}/${res.data.ShareableLink}`);
    } catch (err: unknown) {
      handleError(err, "Error while sharing brain");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <Layout>
      <div>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Cards</h1>

          <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">

            {/* SEARCH */}
            <div className="flex-1 min-w-[200px]">
              <input
                value={search}
                type="text"
                className="w-full dark:bg-neutral-900 bg-white/60 border dark:border-white/8 border-black/20 rounded-xl px-4 py-2 text-sm outline-none placeholder:text-neutral-500 dark:focus:border-white/20 focus:border-black/20 transition"
                placeholder="Search cards..."
                onChange={handleSearch}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClick}
                className="flex items-center gap-2 dark:bg-white bg-black/90 dark:text-black text-white text-sm font-medium px-4 py-2 rounded-full hover:scale-[1.03] transition-all"
              >
                <Plus size={18} />
                Add
              </button>

              <button
                onClick={handleShare}
                className="flex dark:bg-black text-neutral-900 bg-white/80 items-center gap-2 border dark:border-black/80 dark:text-white/80 cursor-pointer text-sm px-4 py-2 rounded-full dark:hover:bg-white/10 hover:-black/70 hover:scale-[1.03] transition"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

          </div>
        </div>

        {/* GRID */}
        <div
          className={`grid gap-4 ${
            isOpen
              ? "lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1"
              : "md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1"
          }`}
        >
          {Array.isArray(allCards) &&
            allCards.map((item) => (
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

        {/* PAGINATION */}
        {pagination && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalCards}
              limit={pagination.limit}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
              itemLabel="cards"
            />
          </div>
        )}

        {/* MODALS */}
        {modal && <AddCard id={null} />}
        {searchModal && <ShareModal />}

        {/* EMPTY STATE */}
        {allCards.length === 0 && (
          <p className="text-neutral-500 text-sm text-center py-10">
            No cards yet. Create your first card!
          </p>
        )}

      </div>
    </Layout>
  );
};

export default Cards;