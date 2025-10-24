import { useRecoilValue, useSetRecoilState } from "recoil";
import { searchAtom } from "../store/atoms/search"
const Search = () => {
  const search = useRecoilValue(searchAtom);
  const setSearch = useSetRecoilState(searchAtom)
  const handleChange = (e: any) => {
    setSearch(e.target.value)
  }
  return (
    <>
      <div className="h-full w-full p-9">
        <div className="items-center py-4">
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Search
          </h1>
          <div className="flex justify-between max-w-full gap-3 py-4">
            <input value={search} type="text" className="flex-1 border rounded-2xl bg-gray-50 p-2 outline-none placeholder:opacity-45 w-2xl focus-within:scale-103 transition" placeholder="eg: what's the update on tweet I saved about trump" onChange={handleChange}/>
            <button className="p-2 bg-gray-700 text-lg font-semibold text-gray-50 hover:scale-104 transition cursor-pointer rounded-2xl z-10">Search</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search