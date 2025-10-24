import { useState } from "react"
import Card from "../components/Card"
import {Share2,Plus} from'lucide-react'

const Cards = () => {
  const content =[
    {
      "link": "https://google.com",
      "title": "How to train a neural network from scratch",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40"
      },
      "updatedAt": {
      "date": "2025-10-23 12:40"
      }
      },
      {
      "link": "https://google.com",
      "title": "Understanding deep learning and backpropagation",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40" 
      },
      "updatedAt": {
      "date": "2025-10-23 12:40" 
      }
      },
      {
      "link": "https://google.com",
      "title": "Tips for improving your JavaScript performance",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40" 
      },
      "updatedAt": {
      "date": "2025-10-23 12:40" 
      }
      },
      {
      "link": "https://google.com",
      "title": "How to debug a React application effectively",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40" 
      },
      "updatedAt": {
      "date": "2025-10-23 12:40" 
      }
      },
      {
      "link": "https://google.com",
      "title": "The best techniques for semantic text search",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40"
      },
      "updatedAt": {
      "date": "2025-10-23 12:40"
      }
      },
      {
      "link": "https://google.com",
      "title": "Difference between supervised and unsupervised learning",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40" 
      },
      "updatedAt": {
      "date": "2025-10-23 12:40" 
      }
      },
      {
      "link": "https://google.com",
      "title": "Building a REST API using Node.js and Express",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40" 
      },
      "updatedAt": {
      "date": "2025-10-23 12:40" 
      }
      },
      {
      "link": "https://google.com",
      "title": "Introduction to vector databases and embeddings",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40" 
      },
      "updatedAt": {
      "date": "2025-10-23 12:40" 
      }
      },
      {
      "link": "https://google.com",
      "title": "How to blueuce memory usage in Python applications",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40"
      },
      "updatedAt": {
      "date": "2025-10-23 12:40"
      }
      },
      {
      "link": "https://google.com",
      "title": "A guide to scaling MongoDB for large datasets",
      "type": "google",
      "tags": [
      "engine",
      "google",
      "search"
      ],
      "share": true,
      "embedding": [],
      "createdAt": {
      "date": "2025-10-23 12:40"
      },
      "updatedAt": {
      "date": "2025-10-23 12:40"
      }
      }
  ]
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
            <button className="cursor-pointer flex items-center gap-2 bg-blue-100 text-blue-700 font-medium rounded-full py-2 px-4 hover:bg-blue-200 hover:scale-[1.03] transition-all duration-200">
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
          {content.map((item)=>{
              return (
              <Card 
                title={item.title} 
                link={item.link} 
                tags={item.tags} 
                share={item.share} 
                createdAt={item.createdAt.date} 
                updatedAt={item.updatedAt.date}
              />
            )
          })}
        </div>

      </div>
    </>
  )
}

export default Cards