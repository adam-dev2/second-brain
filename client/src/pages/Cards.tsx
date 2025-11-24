import React, { useEffect, useState } from "react";
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
import Loading from "../components/Loading";
import { sidebarAtom } from "../store/atoms/sidebar";
import { searchModalAtom } from "../store/atoms/searchModal";
import ShareModal from "../components/ShareModal";
import { sharelink } from "../store/atoms/sharelink";
import { hideIconAtom } from "../store/atoms/hideIcons";
import { handleError } from "../utils/handleError";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface IOrgCard {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
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
  const [originalCards, setOriginalCards] = useState<IOrgCard[]>([]);
  const isOpen = useRecoilValue(sidebarAtom);
  const searchModal = useRecoilValue(searchModalAtom);
  const setSearchModal = useSetRecoilState(searchModalAtom);
  const setHideIcons = useSetRecoilState(hideIconAtom);

  const handleClick = () => {
    setModal((prev) => !prev);
  };
  let processingToastId: string | undefined;
  useEffect(() => {
    const es = new EventSource(`${backendUrl}/events`, {
      withCredentials: true,
    });

    es.addEventListener("startCardProcessing", (e) => {
      const data = JSON.parse(e.data);
      processingToastId = toast.loading(`${data.message}`, {
        position: "top-right",
      });
    });

    es.addEventListener("cardProcessed", (e) => {
      const data = JSON.parse(e.data);
      console.log("Card Processed succesfull", data);
      toast.success(`${data.message}`, {
        id: processingToastId,
        position: "top-right",
      });
    });

    es.addEventListener("cardFailed", (e) => {
      const data = JSON.parse(e.data);
      console.log("Card processing failed");
      toast.error(`${data.message}`, {
        id: processingToastId,
        position: "top-right",
      });
    });

    return () => es.close();
  }, []);
  useEffect(() => {
    console.log(searchModal);
    setHideIcons(true);
    const token = Cookies.get("token");
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/v1/content/cards`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAllCards(res.data.cards);
        setOriginalCards(res.data.cards);
        toast.success("Fetched all cards successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch cards");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [setAllCards]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    console.log(value.length, value.trim() !== "");
    if (value.trim() !== "") {
      const filtered = originalCards.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setAllCards(filtered);
    } else {
      setAllCards(originalCards);
    }
  };

  const handleShare = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/v1/brain/share`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res.data.ShareableLink);
      toast.success("Shareable Link generated");
      setSearchModal(true);
      setShareLink(`https://seconbrain.madebyadam.xyz/${res.data.ShareableLink}`);
    } catch (err: unknown) {
      handleError(err, "Error while sharing brain");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen w-full p-9">
          <div className="">
            <h1 className="text-4xl font-semibold text-gray-800 tracking-tight py-4">
              Cards
            </h1>
            <div className="flex items-center justify-between pb-4">
              <div className="flex justify-start  md:justify-end-safe w-full mr-4">
                <input
                  value={search}
                  type="text"
                  className="border border-gray-400 rounded-2xl bg-gray-50 p-2 outline-none placeholder:opacity-45  focus-within:scale-103 transition "
                  placeholder="eg: Title"
                  onChange={handleSearch}
                />
              </div>
              <div className={`flex flex-row items-center gap-3`}>
                <button
                  onClick={handleClick}
                  className="cursor-pointer flex items-center gap-2 bg-zinc-900 text-gray-100 hover:text-gray-800 hover:border hover:border-gray-700 font-medium rounded-full py-2 px-4 hover:bg-zinc-200 hover:scale-[1.03] transition-all duration-150"
                >
                  <Plus size={20} />
                  <span >Add</span>
                </button>
                <button
                  onClick={handleShare}
                  className="cursor-pointer flex items-center gap-2 bg-red-50 text-red-400 font-medium rounded-full py-2 px-4 border border-red-400 hover:bg-red-100 hover:text-red-500 hover:scale-[1.03] transition-all duration-200"
                >
                  <Share2 size={20} />
                  <span >Share</span>
                </button>
              </div>
            </div>
          </div>
          <div
            className={`grid gap-3 ${isOpen ? "lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1"}`}
          >
            {Array.isArray(allCards) &&
              allCards.map((item, idx) => {
                return (
                  <Card
                    key={idx}
                    title={item.title}
                    link={item.link}
                    tags={item.tags}
                    share={item.share}
                    createdAt={item.createdAt}
                    updatedAt={item.updatedAt}
                    id={item._id}
                  />
                );
              })}
          </div>
          {modal && <AddCard />}
          {searchModal && <ShareModal />}
          {allCards.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">
              No cards yet. Create your first card!
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default Cards;
