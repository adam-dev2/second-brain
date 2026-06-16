import axios from "axios";

export const scrapeLink = async (url: string) => {
  const token = process.env.JINA_API;
  try {
    const res = await axios.get(`https://r.jina.ai/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Token-Budget": 10000,
      },
      timeout: 10000,
    });
    if (res.data.code !== 200) {
      return "Status ";
    }
    const text = res.data.title;
    return text;
  } catch (err) {
    console.log("Scrape Failed", err);
    return "";
  }
};