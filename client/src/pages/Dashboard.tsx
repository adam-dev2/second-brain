import { useRecoilValue, useSetRecoilState } from "recoil";
import { FileText, Video, Twitter, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadingAtom } from "../store/atoms/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import LoadingOverlay from "../components/Loading";
import { handleError } from "../utils/handleError";
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
      
      if (!token) {
        navigate("/auth");
      }
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
        toast.success("Metrics fetched successfully");
      } catch (err: unknown) {
        handleError(err, "Error while fetching metrics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

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
    return <LoadingOverlay />;
  }

  const { stats, topTags, recentCards } = metrics;

  return (
    <div className="h-full w-full p-9 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your knowledge base</p>
          <div className="text-sm text-gray-500 mt-2 opacity-85">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 font-semibold text-lg ">Total Cards</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalCards}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 font-semibold text-lg ">Unique Tags</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.tags}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 font-semibold text-lg ">Shared cards</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.aiSearches}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 font-semibold text-lg ">Added This Week</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.thisWeek}</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-2 ">
        <div className="bg-white rounded-xl p-6 shadow-sm border col-span-1 lg:col-span-2 border-gray-200  h-[420px] mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Cards</h2>
            <button
              onClick={() => {
                navigate("/home/cards");
              }}
              className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          {recentCards.length > 0 ? (
            <div className="space-y-1">
              {recentCards.slice(0, 4).map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group "
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">{getTypeIcon(card.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {card.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{card.createdAt}</span>
                      {card.tags.length > 0 && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex gap-1 flex-wrap">
                            {card.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded font-medium"
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
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              No cards yet. Create your first card!
            </p>
          )}
        </div>
        <div className="bg-white  rounded-xl p-6 shadow-sm border  h-[420px] pb-10 border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Tags</h2>
          {topTags.length > 0 ? (
            <div className="space-y-6 w-full ">
              {topTags.map((tag, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-md font-medium text-gray-700">{tag.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{tag.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`bg-gray-600 h-2 rounded-full transition-all`}
                      style={{ width: `${(tag.count / topTags[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              No tags yet. Start adding cards!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
