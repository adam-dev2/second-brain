import React, { useEffect, useState } from "react"
import Card from "../components/Card"
import {Share2,Plus} from'lucide-react'
import axios from "axios"
import toast from "react-hot-toast"
import Cookies from 'js-cookie'
import AddCard from "../components/AddCard"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { modalAtom } from "../store/atoms/modal"
import { allcardsAtom } from "../store/atoms/allcards"
import { loadingAtom } from "../store/atoms/loading"
import Loading from "../components/Loading"
import { useNavigate } from "react-router-dom"
import { sidebarAtom } from "../store/atoms/sidebar"
import { searchModalAtom } from "../store/atoms/searchModal"
import ShareModal from "../components/ShareModal"
import { sharelink } from "../store/atoms/sharelink"
import { hideIconAtom } from "../store/atoms/hideIcons"

const Cards = () => {
  const setShareLink = useSetRecoilState(sharelink)
  const allCards = useRecoilValue(allcardsAtom)
  const setAllCards = useSetRecoilState(allcardsAtom)
  const modal = useRecoilValue(modalAtom);
  const setModal = useSetRecoilState(modalAtom);
  const loading = useRecoilValue(loadingAtom)
  const setLoading = useSetRecoilState(loadingAtom)
  const [search,setSearch] = useState('');
  const [originalCards, setOriginalCards] = useState<any[]>([]);
  const navigate = useNavigate();
  const isOpen = useRecoilValue(sidebarAtom)
  const searchModal = useRecoilValue(searchModalAtom)
  const setSearchModal = useSetRecoilState(searchModalAtom)
  const setHideIcons = useSetRecoilState(hideIconAtom)

  
  const handleClick = () => {
    setModal(prev=>!prev)
  }
  
  useEffect(()=>{
    console.log(searchModal);
    setHideIcons(true);
    const fetchCards = async() => {
      const token = Cookies.get('token');
      setLoading(true);
      try{
        
        if(!token) {
          toast.error('Token not found')
          navigate('/')
          return;
        }
        let res = await axios.get('http://localhost:5000/api/v1/cards',{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
        setAllCards(res.data.cards);
        setOriginalCards(res.data.cards);
        toast.success('Fetched all cards successfully');
      }catch(err) {
        console.error(err);
        toast.error('Failed to fetch cards')
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  },[setAllCards])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value)
    console.log(value.length, value.trim() !== "");
    if(value.trim() !== "") {
      const filtered = originalCards.filter(item => item.title.toLowerCase().includes(value.toLowerCase()))
      setAllCards(filtered);
    }else {
      setAllCards(originalCards);
    }
  }

  const handleShare = async() => {
    const token = Cookies.get('token');
    if(!token) {
      toast.error("Token not found");
      navigate('/');
    }
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/v1/brain/share',
        {
          withCredentials:true,
          headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        }
      )
      console.log(res.data.ShareableLink);
      toast.success('Shareable Link generated')
      setSearchModal(true)
      setShareLink(`http://localhost:5173/${res.data.ShareableLink}`);
    }catch(err: any) {
      console.log(err.response.message);
      
      toast.error('Error while sharing brain')
      throw err
    }finally {
      setLoading(false)
    }
  }
  return (
    <>
      {loading?<Loading />:
      <div className="h-full w-full p-9">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Cards
          </h1>
          <div className={`flex items-center gap-3`}>
            <input value={search} type="text" className="border border-gray-400 rounded-2xl bg-gray-50 p-2 outline-none placeholder:opacity-45  focus-within:scale-103 transition" placeholder="eg: Title" onChange={handleSearch}/>
            <button onClick={handleClick} className="cursor-pointer flex items-center gap-2 bg-blue-100 text-blue-700 font-medium rounded-full py-2 px-4 hover:bg-blue-200 hover:scale-[1.03] transition-all duration-200">
              <Plus size={20} />
              <span>Add Card</span>
            </button>
            <button onClick={handleShare} className="cursor-pointer flex items-center gap-2 bg-purple-100 text-purple-700 font-medium rounded-full py-2 px-4 border border-purple-200 hover:bg-purple-200 hover:scale-[1.03] transition-all duration-200">
              <Share2 size={20} />
              <span>Share Brain</span>
            </button>
          </div>
        </div>
        <div className={`grid gap-3 ${isOpen ? "lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1"}`}>
          {Array.isArray(allCards)&& allCards.map((item,idx)=>{
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
            )
          })}
        </div>
        {modal && <AddCard/>}
        {searchModal && <ShareModal />}
        {allCards.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No cards yet. Create your first card!</p>}
      </div>
      }
    </>
  )
}

export default Cards