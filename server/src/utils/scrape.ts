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
    // const title = extractTitle(text);
    return text;
  } catch (err) {
    console.log("Scrape Failed", err);
    return "";
  }
};

// function extractTitle(text: string): string | null {
//   if (!text) return null;

//   const titleLine = text.match(/^Title:\s*(.+)$/im);
//   if (titleLine && titleLine[1]) {
//     return titleLine[1].trim().replace(/^["']|["']$/g, "");
//   }
//   const heading = text.match(/^\s{0,3}#{1,3}\s+(.+)$/m);
//   if (heading && heading[1]) return heading[1].trim();
//   const firstNonEmpty = text.split("\n").find((l) => l.trim().length > 0);
//   return firstNonEmpty ? firstNonEmpty.trim() : null;
// }
