import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  Search,
  Tag,
  Share2,
  Lock,
  BarChart3,
  Clock,
  Zap,
  Github,
  ArrowRight,
  BookmarkPlus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileStack,
  Tags,
  User,
  FileText,
  Video,
  Twitter,
  Link2,
  Bookmark,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const navigtate = useNavigate();

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Elastic Search",
      description:
        "Lightning-fast search powered by Elasticsearch to find your bookmarks instantly",
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Smart Tagging",
      description: "Organize with custom tags and see your most-used tags at a glance",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Share Your Brain",
      description: "Make your second brain public and share knowledge with anyone",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Privacy Control",
      description: "Toggle between private and public for each bookmark with one click",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "KPI Dashboard",
      description: "Track your bookmarking habits with insightful metrics and analytics",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Recent Activity",
      description: "View your top 5 recent bookmarks for quick access to latest saves",
    },
  ];

  const stats = [
    { label: "Bookmarks Created", value: "10K+", icon: <Bookmark className="w-8 h-8 md:w-10 md:h-10" /> },
    { label: "Active Users", value: "2.5K+", icon: <User className="w-8 h-8 md:w-10 md:h-10" /> },
    { label: "Shared Brains", value: "1.2K+", icon: <Share2 className="w-8 h-8 md:w-10 md:h-10" /> },
    { label: "Tags Used", value: "50K+", icon: <Tag className="w-8 h-8 md:w-10 md:h-10" /> },
  ];

  const sidebarLinks = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Cards", icon: FileStack, active: false },
    { label: "Tags", icon: Tags, active: false },
    { label: "Search", icon: Search, active: false },
    { label: "Profile", icon: Settings, active: false },
  ];

  const mockRecentCards = [
    {
      id: 1,
      title: "React Performance Optimization",
      type: "document",
      tags: ["react", "performance"],
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      type: "video",
      tags: ["typescript", "tutorial"],
      date: "5 hours ago",
    },
    {
      id: 3,
      title: "Design System Best Practices",
      type: "document",
      tags: ["design", "ui"],
      date: "1 day ago",
    },
    {
      id: 4,
      title: "API Design Guidelines",
      type: "tweet",
      tags: ["api", "backend"],
      date: "2 days ago",
    },
  ];

  const mockTopTags = [
    { name: "react", count: 45 },
    { name: "typescript", count: 38 },
    { name: "design", count: 32 },
    { name: "backend", count: 28 },
    { name: "tutorial", count: 24 },
  ];

  const sampleCards = [
    {
      title: "Design Inspiration Board",
      link: "dribbble.com/shots/12345",
      tags: ["design", "ui", "inspiration"],
    },
    {
      title: "Next.js Performance Tips",
      link: "vercel.com/blog/nextjs-performance",
      tags: ["nextjs", "performance", "dev"],
    },
    {
      title: "Building a Second Brain",
      link: "aliabdaal.com/second-brain",
      tags: ["productivity", "notes", "learning"],
    },
  ];

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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-black to-gray-900 opacity-50" />
      <div className="fixed inset-0 bg-[radial-linear(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8"
        style={{ opacity, scale }}
      >
        <div className="max-w-6xl mx-auto text-center z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
              <Bookmark className="w-4 h-4 text-white shrink-0" />
              <span className="text-xs sm:text-sm text-gray-300">Your Digital Knowledge Hub</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 bg-linear-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
          >
            Second Brain
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400 mb-8 md:mb-12 max-w-3xl mx-auto px-2"
          >
            Think less about <span className="font-bold text-gray-200">remembering</span>. Let your{" "}
            <span className="font-bold text-gray-200">second brain</span> do it for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-2"
          >
            <button onClick={() => navigtate('/auth')} className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-sm sm:text-base">
              <Github className="w-5 h-5 shrink-0" />
              <span>Sign in with GitHub</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:inline" />
            </button>
            <button onClick={() => navigtate('/auth')} className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-sm sm:text-base">
              <FcGoogle className="w-5 h-5 shrink-0" />
              <span>Sign in with Google</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 md:mt-16 relative w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto px-2">
              {sampleCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <div className="flex justify-between w-full gap-2">
                      <h3 className="text-sm font-semibold mb-2 text-white line-clamp-2">{card.title}</h3>
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-white/60" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 truncate w-full">{card.link}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {card.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 md:bottom-10 z-50 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div className="w-1 h-2 bg-white rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </motion.section>

      <section className="relative py-12 md:py-20 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2 md:mb-3 text-gray-400">{stat.icon}</div>
                <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-500 line-clamp-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-base md:text-lg px-2">Everything you need to build your second brain</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/10 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-32 px-4 sm:px-6 border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Experience the Dashboard</h2>
            <p className="text-gray-400 text-base md:text-lg px-2">
              A glimpse into your command center for knowledge management
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row h-auto md:h-[600px] lg:h-[700px]">
              <div
                className={`${sidebarOpen ? "w-full md:w-64" : "w-full md:w-20"} bg-black border-b md:border-b-0 md:border-r border-white/10 whitespace-nowrap transition-all duration-300 flex flex-col p-4`}
              >
                <div className="flex items-center justify-between mb-6 md:mb-10 mt-2">
                  {sidebarOpen && (
                    <h1 className="text-lg md:text-xl font-bold tracking-wide text-white">Second Brain</h1>
                  )}
                </div>

                <nav className="flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
                  {sidebarLinks.map(({ label, icon: Icon, active }) => (
                    <div
                      key={label}
                      className={`flex items-center justify-center md:justify-start gap-3 p-2 rounded-md transition-all shrink-0 ${
                        active
                          ? "bg-white text-black font-semibold"
                          : "text-white hover:bg-neutral-900"
                      }`}
                    >
                      <Icon className="shrink-0" size={sidebarOpen ? 20 : 24} />
                      {sidebarOpen && <span className="truncate hidden md:inline text-sm">{label}</span>}
                    </div>
                  ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-white/10 hidden md:block">
                  <div className="flex items-center justify-center gap-3 p-2 rounded-md border border-neutral-800 text-white hover:bg-black/90 transition">
                    <LogOut size={20} />
                    {sidebarOpen && <span className="text-sm">Logout</span>}
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`hidden md:flex absolute top-4 ${sidebarOpen ? "left-60" : "left-6"} p-2 rounded-lg bg-black transition-all z-10`}
                >
                  {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>

              <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
                <div className="mb-4 md:mb-6">
                  <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 tracking-tight mb-1">
                    Dashboard
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">Overview of your knowledge base</p>
                  <div className="text-xs md:text-sm text-gray-500 mt-2 opacity-85">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-semibold text-xs md:text-sm mb-1 md:mb-2">Total Cards</p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">247</h3>
                  </div>
                  <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-semibold text-xs md:text-sm mb-1 md:mb-2">Unique Tags</p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">38</h3>
                  </div>
                  <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-semibold text-xs md:text-sm mb-1 md:mb-2">Shared Cards</p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">15</h3>
                  </div>
                  <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-semibold text-xs md:text-sm mb-1 md:mb-2">This Week</p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">12</h3>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Cards</h2>
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium text-xs md:text-sm">
                        View All →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {mockRecentCards.slice(0, 4).map((card) => (
                        <div
                          key={card.id}
                          className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
                        >
                          <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm shrink-0">
                            {getTypeIcon(card.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-xs md:text-sm group-hover:text-indigo-600 transition-colors truncate">
                              {card.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs text-gray-500">{card.date}</span>
                              <span className="text-gray-300 hidden sm:inline">•</span>
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Top Tags</h2>
                    <div className="space-y-3">
                      {mockTopTags.map((tag, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs md:text-sm font-medium text-gray-700">{tag.name}</span>
                            <span className="text-xs md:text-sm font-semibold text-gray-900">{tag.count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-gray-600 h-2 rounded-full transition-all"
                              style={{ width: `${(tag.count / mockTopTags[0].count) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 md:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-neutral-300/5 to-white/5 border border-white/20 rounded-2xl md:rounded-3xl p-8 md:p-12 backdrop-blur-sm"
          >
            <Zap className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-2">
              Start Building Your Second Brain
            </h2>
            <p className="text-base md:text-xl text-gray-400 mb-8 px-2">
              Join thousands of users organizing their digital knowledge
            </p>
            <div className="flex flex-col gap-4 justify-center px-2">
              <button onClick={() => navigtate('/auth')} className="group w-full sm:w-auto mx-auto px-8 py-3 md:py-4 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-sm md:text-base">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:inline" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-6 md:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-4 h-4 md:w-5 md:h-5" />
            <span>Second Brain © 2025</span>
          </div>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;