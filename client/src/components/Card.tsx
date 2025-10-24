import {SquarePen} from 'lucide-react'

interface Iprops {
    title:string
    link:string
    tags:string[]
    share:boolean
    createdAt: string
    updatedAt:string
}
const Card = (props:Iprops) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-800 max-w-2xl flex flex-col">
      <div className="flex items-start justify-between gap-3 flex-1 ">
        <h1 className="flex-1 text-xl font-semibold text-gray-900 line-clamp-2">
            {props.title}
        </h1>
        <button className="pr-1 m-auto cursor-pointer hover:scale-120 transition"><SquarePen size={16}/></button>
      </div>
      
      <div className="flex items-center justify-between mt-4 mb-4 gap-3">
        <a 
          href={props.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm truncate flex-1 hover:underline transition-colors"
        >
          {props.link}
        </a>
        <span 
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${
            props.share 
              ? 'bg-green-100 text-green-700' 
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {props.share ? 'Public' : 'Private'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {props.tags.map((item, index) => (
          <span 
            key={index}
            className="bg-blue-50 text-blue-700 text-xs font-medium rounded-lg px-3 py-1.5 border border-blue-200"
          >
            {item}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1.5">
          <span className="font-medium">Created:</span>
          <span>{props.createdAt.split(' ')[0]}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-medium">Updated:</span>
          <span>{props.updatedAt.split(' ')[0]}</span>
        </span>
      </div>
    </div>
  );
}

export default Card