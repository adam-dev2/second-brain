import axios from 'axios'
import { SquarePen, Trash2, ExternalLink, Globe, Lock } from 'lucide-react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { allcardsAtom } from '../store/atoms/allcards'
import { formdataAtom } from '../store/atoms/formData'
import { modalAtom } from '../store/atoms/modal'
import { editCardAtom } from '../store/atoms/editcard'
import { loadingAtom } from "../store/atoms/loading";
import { hideIconAtom } from '../store/atoms/hideIcons'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Iprops {
  title: string
  link: string
  tags: string[]
  share: boolean
  createdAt: string
  updatedAt: string
  id: string
  index?: number
}

const Card = (props: Iprops) => {
  const allCards = useRecoilValue(allcardsAtom);
  const setAllCards = useSetRecoilState(allcardsAtom);
  const setFormdata = useSetRecoilState(formdataAtom);
  const setModal = useSetRecoilState(modalAtom);
  const setEditCardId = useSetRecoilState(editCardAtom);
  const setLoading = useSetRecoilState(loadingAtom)
  const hideIcons = useRecoilValue(hideIconAtom)

  const handleEdit = async () => {
    const findCard = allCards.find(item => item._id === props.id);
    if (findCard) {
      setFormdata(prev => ({
        ...prev,
        title: findCard.title,
        link: findCard.link,
        tags: findCard.tags,
        type: findCard.type,
        share: findCard.share,
        heading: 'Edit Card',
        button: 'Save Details'
      }));
    }

    setModal(prev => !prev);
    setEditCardId(props.id)
  }

  const handleDelete = async () => {
    const token = Cookies.get('token')
    if (!token) {
      toast.error('No Token Found');
      return;
    }
    setLoading(true)
    try {
      await axios.delete(`${backendUrl}/api/v1/content/${props.id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      setAllCards(allCards.filter(item => item._id !== props.id));
      toast.success('Card Deleted successfully');
    } catch (err: any) {
      console.log(err.response.message);
      toast.error(err.response.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden">
      {/* Rank Badge - only show if index is provided */}
      {props.index !== undefined && (
        <div className="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {props.index + 1}
        </div>
      )}

      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-gray-400 via-gray-600 to-gray-800"></div>

      <div className="flex items-start justify-between gap-3 flex-1 mt-2">
        <h1 className="flex-1 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {props.title}
        </h1>
        {hideIcons && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleEdit} 
              className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer hover:scale-110 transition-all"
              aria-label="Edit card"
            >
              <SquarePen size={16} className="text-gray-600 hover:text-gray-900" />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer hover:scale-110 transition-all"
              aria-label="Delete card"
            >
              <Trash2 size={16} className="text-gray-600 hover:text-red-600" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 gap-3">
        <a
          href={props.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 text-sm truncate flex-1 hover:underline transition-colors font-medium flex items-center gap-1.5 group/link"
        >
          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          Visit Link
        </a>
        <span
          className={`px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
            props.share
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {props.share ? (
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
        {props.tags.map((tag, index) => (
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
          <span className="text-gray-700">{props.createdAt?.slice(0, 10)}</span>
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="text-gray-400">Updated:</span>
          <span className="text-gray-700">{props.updatedAt?.slice(0, 10)}</span>
        </span>
      </div>
    </div>
    </>
  );
}

export default Card