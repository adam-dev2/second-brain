import { useRecoilValue, useSetRecoilState } from "recoil";
import { Bookmark, Tag, Share2, TrendingUp, Clock, FileText, Video, Twitter, Link2, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadingAtom } from "../store/atoms/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import LoadingOverlay from "../components/Loading";
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
      const token = Cookies.get('token');
      
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/v1/metrics`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(res.data.metrics);
        setMetrics(res.data.metrics);
        toast.success('Metrics fetched successfully');
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error while fetching metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'tweet': return <Twitter className="w-4 h-4" />;
      default: return <Link2 className="w-4 h-4" />;
    }
  };

  if (loading || !metrics) {
    return (
      <LoadingOverlay/>
    );
  }

  const { stats, weeklyActivity, topTags, recentCards } = metrics;
  const maxCards = Math.max(...weeklyActivity.map(d => d.cards), 1);

  return (
    <div className="h-full w-full p-9 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Overview of your knowledge base</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            {/* <div className="p-2 bg-blue-50 rounded-lg">
              <Bookmark className="w-5 h-5 text-blue-600" />
            </div> */}
            {/* <div className={`flex items-center gap-1 text-sm font-medium ${stats.cardsChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.cardsChangePercent > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(stats.cardsChangePercent)}%
            </div> */}
          <p className="text-gray-600 font-semibold text-lg ">Total Cards</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalCards}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            {/* <div className="p-2 bg-purple-50 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600" />
            </div> */}
            {/* <div className={`flex items-center gap-1 text-sm font-medium ${stats.tagsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.tagsChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(stats.tagsChange)}
            </div> */}
          <p className="text-gray-600 font-semibold text-lg ">Unique Tags</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.tags}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            {/* <div className="p-2 bg-indigo-50 rounded-lg">
              <Share2 className="w-5 h-5 text-indigo-600" />
            </div> */}
            {/* <div className={`flex items-center gap-1 text-sm font-medium ${stats.searchesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.searchesChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(stats.searchesChange)}%
            </div> */}
          <p className="text-gray-600 font-semibold text-lg ">Shared cards</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.aiSearches}</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            {/* <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div> */}
            {/* <span className="text-xs text-gray-500 font-medium">Last 7 days</span> */}
          <p className="text-gray-600 font-semibold text-lg ">Added This Week</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.thisWeek}</h3>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        
        
      <div className="bg-white rounded-xl p-6 shadow-sm border col-span-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Cards</h2>
          <button 
            onClick={() => { navigate('/home/cards') }} 
            className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            View All →
          </button>
        </div>
        
        {recentCards.length > 0 ? (
          <div className="space-y-3">
            {recentCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {getTypeIcon(card.type)}
                </div>
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
          <p className="text-gray-500 text-sm text-center py-8">No cards yet. Create your first card!</p>
        )}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border max-h-fit pb-10 border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Tags</h2>
          {topTags.length > 0 ? (
            <div className="space-y-4">
              {topTags.map((tag, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{tag.name}</span>
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
            <p className="text-gray-500 text-sm text-center py-8">No tags yet. Start adding cards!</p>
          )}
        </div>
      </div>

      {/* Recent Cards */}
    </div>
  );
};

export default Dashboard;