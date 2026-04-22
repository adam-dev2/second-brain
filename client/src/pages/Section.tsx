import React, { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import { Share2, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import AddCard from "../components/AddCard";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { modalAtom } from "../store/atoms/modal";
import { loadingAtom } from "../store/atoms/loading";
import { sidebarAtom } from "../store/atoms/sidebar";
import { searchModalAtom } from "../store/atoms/searchModal";
import ShareModal from "../components/ShareModal";
import { sharelink } from "../store/atoms/sharelink";
import { hideIconAtom } from "../store/atoms/hideIcons";
import { handleError } from "../utils/handleError";
import CardSkeleton from "../components/CardSkeleton";
import { useParams } from "react-router-dom";
import { sectionsAtom } from "../store/atoms/sections";
import { secitonCardsAtom } from "../store/atoms/sectionCards";
import Layout from "../layouts/Layout";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Section = () => {
  const setShareLink = useSetRecoilState(sharelink);
  const modal = useRecoilValue(modalAtom);
  const setModal = useSetRecoilState(modalAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const [search, setSearch] = useState("");
  const isOpen = useRecoilValue(sidebarAtom);
  const searchModal = useRecoilValue(searchModalAtom);
  const setSearchModal = useSetRecoilState(searchModalAtom);
  const setHideIcons = useSetRecoilState(hideIconAtom);
  const { id } = useParams();
  const sectionNameRef = useRef("")
  const sections = useRecoilValue(sectionsAtom);
  const sectionCards = useRecoilValue(secitonCardsAtom)
  const setSectionCards = useSetRecoilState(secitonCardsAtom)
  const processingToastId = useRef<string | undefined>(undefined)
  

  const handleClick = () => {
    setModal((prev) => !prev);
  };
  useEffect(() => {
    const es = new EventSource(`${backendUrl}/events`, {
      withCredentials: true,
    });

    es.addEventListener("startCardProcessing", (e) => {
      const data = JSON.parse(e.data);
      processingToastId.current = toast.loading(`${data.message}`, {
        position: "top-right",
      });
    });

    es.addEventListener("cardProcessed", (e) => {
      const data = JSON.parse(e.data);
      console.log("Card Processed succesfull", data);
      toast.success(`${data.message}`, {
        id: processingToastId.current,
        position: "top-right",
      });
    });

    es.addEventListener("cardFailed", (e) => {
      const data = JSON.parse(e.data);
      console.log("Card processing failed");
      toast.error(`${data.message}`, {
        id: processingToastId.current,
        position: "top-right",
      });
    });
    sections.find((section) => {
        if(section.id === id) {
            sectionNameRef.current = section.label
        }
    })
    return () => es.close();
  },[]);
  useEffect(() => {
    console.log(searchModal);
    setHideIcons(true);
    const token = Cookies.get("token");
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/v1/section/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSectionCards(res.data.cards)
        toast.success("Fetched all cards successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch cards");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [id]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    console.log(value.length, value.trim() !== "");
    if (value.trim() !== "") {
      const filtered = sectionCards.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setSectionCards(filtered);
    } else {
      setSectionCards(sectionCards);
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
      setShareLink(`${backendUrl}/${res.data.ShareableLink}`);
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
        <h1 className="text-3xl font-black tracking-tight">
          {sectionNameRef.current}
        </h1>

        <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">

          {/* SEARCH */}
          <div className="flex-1 min-w-[200px]">
            <input
              value={search}
              type="text"
              className="w-full bg-neutral-900 border border-white/[0.08] rounded-xl px-4 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-white/20 transition"
              placeholder="Search cards..."
              onChange={handleSearch}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClick}
              className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:scale-[1.03] transition"
            >
              <Plus size={18} />
              Add
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 border border-white/20 text-white text-sm px-4 py-2 rounded-full hover:bg-white/10 transition"
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
        {Array.isArray(sectionCards) &&
          sectionCards.map((item, idx) => (
            <Card
              key={idx}
              title={item.title}
              link={item.link}
              tags={item.tags}
              share={item.share}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              id={item.id}
            />
          ))}
      </div>

      {/* MODALS */}
      {modal && <AddCard id={id || null} />}
      {searchModal && <ShareModal />}

      {/* EMPTY STATE */}
      {sectionCards.length === 0 && (
        <p className="text-neutral-500 text-sm text-center py-10">
          No cards yet. Create your first card!
        </p>
      )}

    </div>
  </Layout>
);
};

export default Section;