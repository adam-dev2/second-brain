import axios from "axios";

export const scrapeLink = async(url:string) => {
    const token = process.env.JINA_API;
    try {
        const res = await axios.get(`https://r.jina.ai/${url}`,{
            headers:{
                'Authorization':`Bearer ${token}`
            },
            timeout:5000
        });
        return res.data;
    }catch(err) {
        console.log('Scrape Failed',err);
        return "";
    }
}