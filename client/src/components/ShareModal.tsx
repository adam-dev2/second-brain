import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingAtom } from "../store/atoms/loading";
import Loading from "./Loading";
import { X, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sharelink } from "../store/atoms/sharelink";
import { searchModalAtom } from "../store/atoms/searchModal"
import { hideIconAtom } from "../store/atoms/hideIcons";

const ShareModal = () => {
  const setSearchModal = useSetRecoilState(searchModalAtom);
  const loading = useRecoilValue(loadingAtom);
  const [copied, setCopied] = useState(false);
  const shareLink = useRecoilValue(sharelink)
  const setHideIcons = useSetRecoilState(hideIconAtom)

  useEffect(()=>{
    setHideIcons(false);
  },[])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white/70 backdrop-blur-xl w-96 p-6 rounded-2xl shadow-2xl border border-gray-200"
        >
          <button
            className="cursor-pointer absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
            onClick={() =>setSearchModal(prev => !prev)}
          >
            <X size={20} />
          </button>

          <div className="text-center mb-5">
            <h1 className="text-xl font-semibold text-gray-900">
              Shareable Link
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Anyone with this link can view the shared content.
            </p>
          </div>

          <div className="flex items-center gap-2 border rounded-lg bg-gray-100 p-2">
            <input
              readOnly
              type="text"
              value={shareLink}
              className="flex-1 bg-transparent text-gray-800 text-sm outline-none"
            />
            <button
              onClick={handleCopy}
              className="text-gray-700 hover:text-gray-900 p-1 transition"
              title="Copy link"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => window.open(shareLink, "_blank")}
              className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg cursor-pointer hover:scale-102 transition hover:bg-gray-900"
            >
              Open Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareModal;
