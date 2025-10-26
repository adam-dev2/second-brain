import { useEffect, useState } from "react"
import Card from "../components/Card"
import {Share2,Plus} from'lucide-react'
import axios from "axios"
import toast from "react-hot-toast"
import Cookies from 'js-cookie'
import AddCard from "../components/AddCard"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { modalAtom } from "../store/atoms/modal"
import { allcardsAtom } from "../store/atoms/allcards"

const Cards = () => {
  const allCards = useRecoilValue(allcardsAtom)
  const setAllCards = useSetRecoilState(allcardsAtom)
  const modal = useRecoilValue(modalAtom);
  const setModal = useSetRecoilState(modalAtom);
  
  const handleClick = () => {
    setModal(prev=>!prev)
  }
  
  useEffect(()=>{
    const fetchCards = async() => {
      try{
        const token = Cookies.get('token');
        
        if(!token) {
          toast.error('Token not found')
          return;
        }
        let res = await axios.get('http://localhost:5000/api/v1/cards',{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
        
        setAllCards(res.data.cards);
        // Log the fetched data directly instead of state
        // console.log(res.data.cards);
        
        toast.success('Fetched all cards successfully');
      }catch(err) {
        console.error(err);
        toast.error('Failed to fetch cards')
      }
    }
    fetchCards();
  },[setAllCards]) // Added setAllCards to dependencies

  const [search,setSearch] = useState('');
  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  }
  
  return (
    <>
      <div className="h-full w-full p-9">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Cards
          </h1>
          <div className="flex items-center gap-3">
            <input value={search} type="text" className="border rounded-2xl bg-gray-50 p-2 outline-none placeholder:opacity-45 w-xs focus-within:scale-103 transition" placeholder="eg: Title" onChange={handleSearch}/>
            <button className="p-2 bg-gray-700 text-lg font-semibold text-gray-50 hover:scale-104 transition cursor-pointer rounded-2xl z-10">Search</button>
            <button onClick={handleClick} className="cursor-pointer flex items-center gap-2 bg-blue-100 text-blue-700 font-medium rounded-full py-2 px-4 hover:bg-blue-200 hover:scale-[1.03] transition-all duration-200">
              <Plus size={20} />
              <span>Add Card</span>
            </button>
            <button className="cursor-pointer flex items-center gap-2 bg-purple-100 text-purple-700 font-medium rounded-full py-2 px-4 border border-purple-200 hover:bg-purple-200 hover:scale-[1.03] transition-all duration-200">
              <Share2 size={20} />
              <span>Share Brain</span>
            </button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-3 sm:grid-cols-1 gap-3">
          {Array.isArray(allCards) && allCards.map((item,idx)=>{
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
        {modal && <AddCard />}
      </div>
    </>
  )
}

export default Cards