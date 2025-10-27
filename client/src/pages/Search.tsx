import { useRecoilValue, useSetRecoilState } from "recoil";
import { searchAtom } from "../store/atoms/search"
import {type KeyboardEvent } from "react"; 
import { loadingAtom } from "../store/atoms/loading";
import LoadingOverlay from "../components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Search = () => {
  const search = useRecoilValue(searchAtom);
  const setSearch = useSetRecoilState(searchAtom)
  const loading = useRecoilValue(loadingAtom)
  const setLoading = useSetRecoilState(loadingAtom)
  const handleChange = (e: any) => {
    setSearch(e.target.value)
  }
  const handleSearch = () => {
    console.log(search);
    setSearch("")
  }
  const handleKeyDown = async(e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && search.trim() !== "" ) {
      e.preventDefault();
      setSearch("")
    
      const token = Cookies.get('token')
      setLoading(true)
      try {
        const res = await axios.post('http://localhost:5000/api/v1/query',
          {
            query:search
          },
          {
            withCredentials:true,
            headers: {
              'Authorization':`Bearer ${token}`,
              'Content-Type':'application/json'
            }
          }
        )
        console.log(res.data.searchResults);

        toast.success('query results')
      }catch(err: any) {
        console.log(err.response.message);
        toast.error(err.response.message || 'Error while fetching quer')
      }finally {
        setLoading(false)
      }
    }
  }
  return (
    <>
      {loading?<LoadingOverlay/>:
      <div className="h-full w-full p-9 m-auto">
        <div className="items-center py-4">
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Search
          </h1>
          <div className="flex justify-between max-w-full gap-3 py-4">
            <input onKeyDown={handleKeyDown} value={search} type="text" className="flex-1 border border-gray-300 focus-within:scale-102 rounded-2xl bg-gray-50 p-2 outline-none placeholder:opacity-45 transition" placeholder="eg: what's the update on tweet I saved about trump" onChange={handleChange}/>
            <button onClick={handleSearch} className="p-2 bg-gray-700 text-lg font-semibold text-gray-50 hover:scale-104 transition cursor-pointer rounded-2xl z-10">Search</button>
          </div>
        </div>
      </div>}
    </>
  )
}

export default Search