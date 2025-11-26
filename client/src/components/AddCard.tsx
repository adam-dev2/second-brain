import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowRight, X } from "lucide-react";
import Cookies from "js-cookie";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { modalAtom } from "../store/atoms/modal";
import { allcardsAtom, type Card } from "../store/atoms/allcards";
import { formdataAtom } from "../store/atoms/formData";
import { editCardAtom } from "../store/atoms/editcard";
import { loadingAtom } from "../store/atoms/loading";
import Loading from "./Loading";
import { handleError } from "../utils/handleError";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddCard = () => {
  const formData = useRecoilValue(formdataAtom);
  const setFormData = useSetRecoilState(formdataAtom);
  const [domainName, setDomainName] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const modal = useRecoilValue(modalAtom);
  const setModal = useSetRecoilState(modalAtom);
  const allCards = useRecoilValue(allcardsAtom);
  const setAllCards = useSetRecoilState(allcardsAtom);
  const editCardId = useRecoilValue(editCardAtom);
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    if (formData.link) {
      setDomainName(getDomainName(formData.link));
    }
  }, [formData.link]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "link") {
      setDomainName(getDomainName(value));
    }
  };

  const getDomainName = (url: string): string | null => {
    try {
      const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
      const hostname = new URL(urlWithProtocol).hostname;

      const match = hostname.match(
        /(?:www\.)?([^.]+)\.(com|org|net|io|co|edu|gov|tv|me|ai|dev|app)/
      );

      return match ? match[1] : hostname.split(".")[0];
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/content/card`,
        {
          title: formData.title,
          link: formData.link,
          tags: formData.tags,
          share: formData.share,
          type: domainName,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newCard: Card = response?.data?.card;
      setAllCards([...allCards, newCard]);
      toast.success("Card saved successfully!");
      setFormData({
        title: "",
        link: "",
        tags: [],
        share: false,
        type: "",
        heading: "Add Card",
        button: "Save Card",
      });
      setModal(!modal);
    } catch (err: unknown) {
      console.log(err);
      handleError(err, "Failed to Save card");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/content/editCard/${editCardId}`,
        {
          title: formData.title,
          link: formData.link,
          tags: formData.tags,
          share: formData.share,
          type: domainName,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Edit response:", response.data);
      const updatedCard = response.data.updateCard || response.data;
      console.log(updatedCard);
      const res = await axios.get(`${backendUrl}/api/v1/content/cards`, {
        withCredentials:true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setAllCards(res.data.cards);
      toast.success("Card updated successfully!");
      setFormData({
        title: "",
        link: "",
        tags: [],
        share: false,
        type: "",
        heading: "Add Card",
        button: "Save Card",
      });
      setModal(false);
    } catch (err: unknown) {
      handleError(err, "Failed to update card");
      console.log("Edit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm bg-opacity-40 z-50">
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-gray-50 backdrop-blur-2xl w-96 p-6 rounded-xl shadow-lg border border-gray-400"
          >
            <button
              className="cursor-pointer text-end z-10 w-full flex justify-end m-0"
              onClick={() => {
                setModal(!modal);
                setFormData({
                  title: "",
                  link: "",
                  tags: [],
                  share: false,
                  type: "",
                  heading: "Add Card",
                  button: "Save Card",
                });
              }}
            >
              <X className="hover:scale-105 transition" size={20} />
            </button>
            <div className="text-center text-gray-900 mb-4 flex">
              <h1 className="flex-1 text-2xl font-semibold">{formData.heading}</h1>
            </div>

            <form
              onSubmit={formData.heading === "Add Card" ? handleSubmit : handleEditSubmit}
              className="space-y-5"
            >
              {/* Title */}
              <div className="relative">
                <input
                  value={formData.title}
                  name="title"
                  onChange={handleChange}
                  type="text"
                  placeholder="Title"
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                         focus:border-gray-500 focus:bg-white transition-all outline-none text-gray-900"
                />
              </div>

              {/* Link */}
              <div className="relative">
                <input
                  value={formData.link}
                  name="link"
                  onChange={handleChange}
                  type="url"
                  placeholder="Link (https://example.com)"
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                         focus:border-gray-500 focus:bg-white transition-all outline-none text-gray-900"
                />
                {domainName && (
                  <p className="text-sm text-gray-600 mt-1">
                    Domain: <span className="font-semibold text-gray-800">{domainName}</span>
                  </p>
                )}
              </div>

              {/* Share Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Share:</span>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, share: !prev.share }))}
                  className={`cursor-pointer px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    formData.share ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {formData.share ? "Public" : "Private"}
                </button>
              </div>

              {/* Tags Input */}
              <div>
                <div
                  className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 
                         focus-within:ring-2 focus-within:ring-gray-500 bg-white"
                >
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tag & press Enter"
                    className="flex-1 outline-none py-1 text-gray-700"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="cursor-pointer w-full bg-linear-to-r from-gray-600 via-zinc-600 to-gray-700 
                       text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] 
                       transition-all flex items-center justify-center gap-2 group"
              >
                {formData.button}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 shadow-sm flex items-start gap-2">
                <span className="text-gray-500 text-base">💡</span>
                <p>
                  <span className="font-medium">Tip:</span> Use a descriptive and relevant name, it
                  helps improve
                  <span className="font-semibold text-gray-800"> search accuracy</span> and results
                  when using
                  <span className="font-semibold text-gray-800"> Elasticsearch</span>.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCard;
