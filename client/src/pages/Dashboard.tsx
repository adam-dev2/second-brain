import { useRecoilValue, useSetRecoilState } from "recoil";
import { FileText, Video, Twitter, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadingAtom } from "../store/atoms/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { handleError } from "../utils/handleError";
import DashboardSkeleton from "../components/DashboardSkeleton";
import StatCard from "../ui-compo/StatCard";
import SectionCard from "../ui-compo/SectionCard";
import TagBar from "../ui-compo/TagBar";
import Layout from "../layouts/Layout";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface MetricsData {
  stats: {
    totalCards: number;
    cardsChangePercent: number;
    tags: number;
    tagsChange: number;
    aiSearches: number;
    searchesChange: number;
    thisWeek: number;
  };
  weeklyActivity: Array<{
    day: string;
    cards: number;
  }>;
  topTags: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  recentCards: Array<{
    id: string;
    title: string;
    type: string;
    tags: string[];
    createdAt: string;
  }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const loading = useRecoilValue(loadingAtom);
  const setLoading = useSetRecoilState(loadingAtom);

  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  useEffect(() => {
    const fetchMetrics = async () => {
      const token = Cookies.get("token");
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/v1/content/metrics`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        setMetrics(res.data.metrics);
      } catch (err: unknown) {
        
        handleError(err, "Error while fetching metrics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  },[]);
  
  
  

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "tweet":
        return <Twitter className="w-4 h-4" />;
      default:
        return <Link2 className="w-4 h-4" />;
    }
  };

  if (loading || !metrics) {
    return <DashboardSkeleton />;
  }

  const { stats, topTags, recentCards } = metrics;

  return (
    <Layout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-neutral-400 mt-1 text-sm">Overview of your knowledge base</p>
        <div className="text-xs text-neutral-600 mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: "Total Cards",     value: stats.totalCards },
          { label: "Unique Tags",     value: stats.tags },
          { label: "Shared Cards",    value: stats.aiSearches },
          { label: "Added This Week", value: stats.thisWeek },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="relative bg-neutral-900 border border-white/[0.08] rounded-2xl p-5 overflow-hidden"
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-white/[0.07] rounded-bl-2xl" />
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-500 mb-3">
              {label}
            </p>
            <p className="text-4xl font-black tracking-tight text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* RECENT CARDS */}
        <div className="relative lg:col-span-2 bg-neutral-900 border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
          {/* Corner accent */}
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-white/[0.07] rounded-tr-2xl" />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-tight">Recent Cards</h2>
            <button
              onClick={() => navigate("/home/cards")}
              className="text-xs text-neutral-500 hover:text-white transition-colors duration-200"
            >
              View All →
            </button>
          </div>

          <div className="space-y-1">
            {recentCards.length > 0 ? (
              recentCards.slice(0, 4).map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-neutral-800 hover:border-white/[0.08] transition-all duration-200 cursor-pointer group"
                >
                  <div className="p-2 bg-white/[0.08] rounded-lg shrink-0">
                    {getTypeIcon(card.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-200 truncate">
                      {card.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                      <span>{card.createdAt}</span>
                      {card.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex gap-1 flex-wrap">
                            {card.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-white/[0.08] text-white/50 rounded text-[11px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-sm text-center py-10">
                No cards yet. Create your first card!
              </p>
            )}
          </div>
        </div>

        {/* TOP TAGS */}
        <div className="relative bg-neutral-900 border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-white/[0.07] rounded-tr-2xl" />

          <h2 className="text-sm font-bold tracking-tight mb-6">Top Tags</h2>

          {topTags.length > 0 ? (
            <div className="space-y-5">
              {topTags.map((tag, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span className="text-neutral-300 font-medium">{tag.name}</span>
                    <span className="text-neutral-500">{tag.count}</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? "bg-white" : "bg-white/30"
                      }`}
                      style={{ width: `${(tag.count / topTags[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm text-center py-10">
              No tags yet. Start adding cards!
            </p>
          )}
        </div>

      </div>
      </Layout>
);
};

export default Dashboard;
