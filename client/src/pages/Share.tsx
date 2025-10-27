import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { loadingAtom } from "../store/atoms/loading"
import toast from "react-hot-toast"
import axios from "axios"
import LoadingOverlay from "../components/Loading"
import Card from "../components/Card"

interface Card {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  share: boolean;
  type:string;
  createdAt: string;
  updatedAt: string;
}

const Share = () => {
    const params = useParams();
    const loading = useRecoilValue(loadingAtom);
    const setLoading = useSetRecoilState(loadingAtom);
    const [cards,setCards] = useState<Card[]>();

    useEffect(()=>{
        const fetchCards = async() => {
            setLoading(true);
            try{
                let res = await axios.get(`http://localhost:5000/api/v1/brain/${params.id}`,{
                headers: {
                    'Content-Type':'application/json'
                }
                });
                console.log(res.data.ShareableCards);
                setCards(res.data.ShareableCards)
                toast.success('Fetched all cards');
            }catch(err) {
                console.error(err);
                toast.error('Failed to fetch cards')
            } finally {
                setLoading(false);
            }
        }
        
        fetchCards();
    },[])
  return (
    <>
        {loading?<LoadingOverlay/>:
        <div>
            <div className={"grid gap-3 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1"}>
                {Array.isArray(cards) && cards.map((item,idx)=>{
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
        </div>
        }
    </>
  )
}

export default Share