import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  Search, Tag, Share2, Lock, BarChart3, Clock, Zap, Github,
  ArrowRight, LogOut, ChevronLeft, ChevronRight,
  LayoutDashboard, FileStack, Tags, FileText, Video,
  Twitter, Link2, Bookmark, Settings, Sparkles, Star,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Typography via Google Fonts ─── */
// Add to your index.html or _document.tsx:
// <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

/* ─── Constants ─── */
const SPRING = { type: "spring", stiffness: 320, damping: 28 } as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ─── Helpers ─── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return { ref, inView, delay };
}

function Reveal({
  children,
  delay = 0,
  className = "",
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const { ref, inView } = useReveal(delay);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ════════════════════════════════════════ LANDING PAGE ═════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── data ── */
  const features = [
    { icon: <Search className="w-4 h-4" />, title: "Elastic Search", desc: "Sub-100ms full-text search across all your saved content. Find anything, instantly." },
    { icon: <Tag className="w-4 h-4" />, title: "Smart Tagging", desc: "Hierarchical tags with auto-suggestions. See your most-used at a glance." },
    { icon: <Share2 className="w-4 h-4" />, title: "Share Your Brain", desc: "Make curated collections public. Let others explore your knowledge graph." },
    { icon: <Lock className="w-4 h-4" />, title: "Privacy Control", desc: "Granular visibility per bookmark. Private by default, public when you choose." },
    { icon: <BarChart3 className="w-4 h-4" />, title: "KPI Dashboard", desc: "Beautiful analytics on your saving habits, top domains, and activity streaks." },
    { icon: <Clock className="w-4 h-4" />, title: "Recent Activity", desc: "Your 5 most recent bookmarks pinned for one-tap access. Always within reach." },
  ];

  const stats = [
    { label: "Bookmarks saved", value: 10000, suffix: "+" },
    { label: "Active users", value: 2500, suffix: "+" },
    { label: "Shared brains", value: 1200, suffix: "+" },
    { label: "Tags created", value: 50000, suffix: "+" },
  ];

  const sampleCards = [
    { title: "Design Inspiration Board", link: "dribbble.com/shots/12345", tags: ["design", "ui", "inspiration"], time: "2d ago", color: "#6366f1" },
    { title: "Next.js Performance Tips", link: "vercel.com/blog/nextjs-performance", tags: ["nextjs", "performance"], time: "5d ago", color: "#0ea5e9" },
    { title: "Building a Second Brain", link: "aliabdaal.com/second-brain", tags: ["productivity", "learning"], time: "1w ago", color: "#10b981" },
  ];

  const testimonials = [
    { quote: "This changed how I manage knowledge. Everything I save is now actually findable.", name: "Alex Chen", role: "Product Designer", co: "Figma" },
    { quote: "The search speed is insane. I went from losing bookmarks to actually using them daily.", name: "Priya Sharma", role: "Software Engineer", co: "Stripe" },
    { quote: "Finally a tool that doesn't feel like a chore. The tagging UX is incredibly smart.", name: "Jordan Miles", role: "Content Creator", co: "YouTube" },
  ];

  const sidebarLinks = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Cards", icon: FileStack, active: false },
    { label: "Tags", icon: Tags, active: false },
    { label: "Search", icon: Search, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];

  const recentCards = [
    { id: 1, title: "React Performance Optimization", type: "document", tags: ["react", "perf"], date: "2h ago" },
    { id: 2, title: "Advanced TypeScript Patterns", type: "video", tags: ["typescript"], date: "5h ago" },
    { id: 3, title: "Design System Best Practices", type: "document", tags: ["design"], date: "1d ago" },
    { id: 4, title: "API Design Guidelines", type: "tweet", tags: ["api"], date: "2d ago" },
  ];

  const topTags = [
    { name: "react", count: 45, max: 45 },
    { name: "typescript", count: 38, max: 45 },
    { name: "design", count: 32, max: 45 },
    { name: "backend", count: 28, max: 45 },
    { name: "tutorial", count: 24, max: 45 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-3 h-3" />;
      case "video": return <Video className="w-3 h-3" />;
      case "tweet": return <Twitter className="w-3 h-3" />;
      default: return <Link2 className="w-3 h-3" />;
    }
  };

  /* ══════════════════════════════════════════ JSX ══════════════════════════ */
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: "#05050a",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Global CSS Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

        * { -webkit-font-smoothing: antialiased; }

        .serif { font-family: 'Instrument Serif', Georgia, serif; }
        .mono { font-family: 'DM Mono', monospace; }

        .noise-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .glow-ring {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(99,102,241,0.08);
        }

        .feature-card:hover .feature-icon {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
          color: #818cf8;
        }

        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          letter-spacing: -0.02em;
          line-height: 1;
          background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.55) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tag-pill {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.4; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .float { animation: float 4s ease-in-out infinite; }
        .float-delay { animation: float 4s ease-in-out infinite 1.3s; }
        .float-delay2 { animation: float 4s ease-in-out infinite 2.1s; }
      `}</style>

      {/* ── noise layer ── */}
      <div className="noise-bg" />

      {/* ═══════════════ NAV ═══════════════ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <div
          className="flex items-center justify-between px-6 sm:px-10 py-4 mx-auto max-w-6xl"
          style={{
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
            background: scrolled ? "rgba(5,5,10,0.85)" : "transparent",
            backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
            transition: "all 0.4s ease",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}
              >
                <Bookmark className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white/90">Second Brain</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-xs text-white/40 font-medium">
            {["Features", "Dashboard", "Testimonials"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="hover:text-white/90 transition-colors duration-200 tracking-wide"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <button
            onClick={() => navigate("/auth")}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).closest('button')!.style.background = "rgba(99,102,241,0.2)";
              (e.target as HTMLElement).closest('button')!.style.borderColor = "rgba(99,102,241,0.5)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).closest('button')!.style.background = "rgba(99,102,241,0.12)";
              (e.target as HTMLElement).closest('button')!.style.borderColor = "rgba(99,102,241,0.25)";
            }}
          >
            Get started <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.header>

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-16 overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 grid-bg opacity-60" />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 100%, #05050a 10%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.08) 0%, transparent 60%)" }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mb-10"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wider"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#818cf8",
              }}
            >
              <Sparkles className="w-3 h-3" />
              Your digital knowledge hub
            </div>
          </motion.div>

          {/* Headline */}
          <div className="text-center mb-8 w-full">
            <div className="overflow-hidden mb-1">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
                className="serif text-white leading-none"
                style={{ fontSize: "clamp(64px, 12vw, 136px)", letterSpacing: "-0.03em" }}
              >
                Second
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.22, ease: EASE_OUT }}
                className="serif leading-none italic"
                style={{
                  fontSize: "clamp(64px, 12vw, 136px)",
                  letterSpacing: "-0.03em",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.2)",
                  color: "transparent",
                }}
              >
                Brain.
              </motion.h1>
            </div>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: EASE_OUT }}
            className="text-center text-base text-white/40 font-light max-w-[360px] leading-relaxed mb-10"
          >
            Stop losing what matters. Save, tag, search, and share your entire knowledge base — all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-16"
          >
            <button
              onClick={() => navigate("/auth")}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 0 0 1px rgba(99,102,241,0.5), 0 8px 32px rgba(99,102,241,0.3)" }}
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium text-white/70 transition-all duration-200 hover:text-white"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <FcGoogle className="w-4 h-4" />
              Continue with Google
            </button>
          </motion.div>

          {/* Hero Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.72, ease: EASE_OUT }}
            className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {sampleCards.map((card, i) => (
              <motion.div
                key={i}
                className={`relative rounded-2xl p-5 cursor-pointer overflow-hidden float${i === 1 ? "-delay" : i === 2 ? "-delay2" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ ...SPRING }}
                onHoverStart={() => setActiveCard(i)}
                onHoverEnd={() => setActiveCard(null)}
              >
                {/* color accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}60, transparent)` }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% -30%, ${card.color}12, transparent 60%)` }}
                />

                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs font-semibold text-white/80 leading-snug pr-2">{card.title}</p>
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <Lock className="w-2.5 h-2.5 text-white/25" />
                  </div>
                </div>

                <p className="tag-pill text-white/20 mb-4 truncate">{card.link}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {card.tags.map((t) => (
                    <span
                      key={t}
                      className="tag-pill px-2 py-0.5 rounded-md"
                      style={{ background: `${card.color}18`, border: `1px solid ${card.color}30`, color: card.color }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center justify-between pt-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-[10px] text-white/20">{card.time}</span>
                  <ArrowUpRight
                    className="w-3 h-3 transition-all duration-200"
                    style={{ color: activeCard === i ? card.color : "rgba(255,255,255,0.2)" }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="relative z-10 mt-14 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full flex justify-center items-start pt-1.5"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="w-px h-2 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section
        className="py-20 px-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="text-center">
              <p className="stat-num mb-2">
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-medium">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section
        id="features"
        className="py-28 px-4 sm:px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-16">
            <p
              className="text-[10px] font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: "#6366f1" }}
            >
              Features
            </p>
            <h2
              className="serif text-white mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Everything you need<br />
              <span className="italic text-white/40">to remember everything.</span>
            </h2>
          </Reveal>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  className="feature-card p-7 h-full group cursor-default transition-all duration-200"
                  style={{ background: "#05050a" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.04)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "#05050a";
                  }}
                >
                  <div
                    className="feature-icon w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 text-white/30"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white/80 mb-2.5">{f.title}</h3>
                  <p className="text-xs text-white/30 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DASHBOARD ═══════════════ */}
      <section
        id="dashboard"
        className="py-28 px-4 sm:px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: "#6366f1" }}>
              Dashboard
            </p>
            <h2
              className="serif text-white mb-3"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Your command center
            </h2>
            <p className="text-sm text-white/30 max-w-sm">See your knowledge at a glance. Everything organized, searchable, and accessible.</p>
          </Reveal>

          <Reveal delay={0.1}>
            {/* Browser chrome */}
            <div
              className="rounded-2xl overflow-hidden glow-ring"
              style={{ boxShadow: "0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              {/* Bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: "#0e0e16", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.5 }} />
                  ))}
                </div>
                <div className="flex-1 flex justify-center">
                  <span
                    className="mono px-4 py-1 text-[10px] text-white/20 rounded-md"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    app.secondbrain.io/dashboard
                  </span>
                </div>
              </div>

              <div className="flex md:h-[580px]">
                {/* Sidebar */}
                <div
                  className={`hidden md:flex flex-col flex-shrink-0 border-r transition-all duration-300 ease-out ${sidebarOpen ? "w-[200px]" : "w-[60px]"}`}
                  style={{ background: "#080810", borderColor: "rgba(255,255,255,0.05)" }}
                >
                  {/* Logo */}
                  <div className="h-14 flex items-center px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
                      >
                        <Bookmark className="w-3 h-3 text-white" />
                      </div>
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-xs font-semibold text-white/80 whitespace-nowrap"
                          >
                            Second Brain
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Nav */}
                  <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
                    {sidebarLinks.map(({ label, icon: Icon, active }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 overflow-hidden"
                        style={{
                          background: active ? "rgba(99,102,241,0.15)" : "transparent",
                          color: active ? "#818cf8" : "rgba(255,255,255,0.3)",
                          border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                        }}
                      >
                        <Icon size={13} className="shrink-0" />
                        <AnimatePresence>
                          {sidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-xs font-medium whitespace-nowrap"
                            >
                              {label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </nav>

                  {/* Bottom */}
                  <div className="p-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer text-white/20 hover:text-white/50 transition-colors overflow-hidden">
                      <LogOut size={13} className="shrink-0" />
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs whitespace-nowrap">
                            Logout
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute mt-[56px] ml-[calc(var(--sw)-12px)] w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10 z-10"
                    style={
                      {
                        "--sw": sidebarOpen ? "200px" : "60px",
                        marginLeft: sidebarOpen ? "188px" : "48px",
                        background: "#0e0e16",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.4)",
                        position: "relative",
                        alignSelf: "flex-start",
                      } as React.CSSProperties
                    }
                  >
                    {sidebarOpen ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
                  </button>
                </div>

                {/* Main content — light bg to contrast dark shell */}
                <div className="flex-1 overflow-y-auto" style={{ background: "#f8f7f5" }}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-5">
                      <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                      <p className="text-xs text-gray-400 mt-0.5 mono">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-2.5 mb-5">
                      {[
                        { label: "Total Cards", value: "247", delta: "+12" },
                        { label: "Unique Tags", value: "38", delta: "+3" },
                        { label: "Shared", value: "15", delta: "+1" },
                        { label: "This Week", value: "12", delta: "+5" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm"
                        >
                          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{m.label}</p>
                          <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold text-gray-900 tracking-tight">{m.value}</p>
                            <span className="text-[9px] font-semibold text-emerald-500 mb-0.5">{m.delta}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cards + Tags grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* Recent cards */}
                      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm col-span-2">
                        <div className="flex justify-between items-center mb-3.5">
                          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent Cards</h2>
                          <button className="text-[10px] font-semibold" style={{ color: "#6366f1" }}>View all →</button>
                        </div>
                        <div className="space-y-1">
                          {recentCards.map((card) => (
                            <div
                              key={card.id}
                              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-indigo-50/50 cursor-pointer group transition-colors"
                            >
                              <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 text-gray-300 group-hover:text-indigo-400 transition-colors border border-gray-100">
                                {getTypeIcon(card.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate group-hover:text-indigo-600 transition-colors">{card.title}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="mono text-[9px] text-gray-300">{card.date}</span>
                                  {card.tags.map((t) => (
                                    <span key={t} className="mono text-[9px] text-indigo-400 bg-indigo-50 px-1.5 py-px rounded font-medium">#{t}</span>
                                  ))}
                                </div>
                              </div>
                              <ArrowUpRight className="w-3 h-3 text-gray-200 group-hover:text-indigo-400 shrink-0 transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top tags */}
                      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Top Tags</h2>
                        <div className="space-y-3.5">
                          {topTags.map((tag, i) => (
                            <div key={i}>
                              <div className="flex justify-between mb-1.5">
                                <span className="mono text-[10px] text-gray-500">#{tag.name}</span>
                                <span className="mono text-[10px] font-bold text-gray-700">{tag.count}</span>
                              </div>
                              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${(tag.count / tag.max) * 100}%`,
                                    background: `hsl(${240 + i * 15}, 70%, 65%)`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section
        id="testimonials"
        className="py-28 px-4 sm:px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-16">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: "#6366f1" }}>
              Testimonials
            </p>
            <h2
              className="serif text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Loved by<br />
              <span className="italic text-white/40">knowledge builders.</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={SPRING}
                  className="rounded-2xl p-6 h-full flex flex-col group cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.2)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.04)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className="w-3 h-3" fill="rgba(99,102,241,0.5)" stroke="none" />
                    ))}
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed mb-6 flex-1 italic serif">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/70">{t.name}</p>
                      <p className="text-[10px] text-white/25">{t.role} · {t.co}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-28 px-4">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <div
              className="relative rounded-3xl text-center overflow-hidden px-12 py-20"
              style={{
                background: "radial-gradient(ellipse at 50% -20%, rgba(99,102,241,0.18) 0%, rgba(5,5,10,0) 60%)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              {/* Top glow line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48"
                style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }}
              />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <Zap className="w-6 h-6" style={{ color: "#818cf8" }} />
              </div>

              <h2
                className="serif text-white mb-4"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                Build your second<br />
                <span className="italic text-white/40">brain today.</span>
              </h2>
              <p className="text-sm text-white/30 mb-10 max-w-xs mx-auto leading-relaxed">
                Join thousands of curious minds organizing their digital world.
              </p>

              <button
                onClick={() => navigate("/auth")}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 mb-4"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  boxShadow: "0 0 0 1px rgba(99,102,241,0.5), 0 16px 48px rgba(99,102,241,0.35)",
                }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-[11px] text-white/20 mono">No credit card · Free forever · Open source</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer
        className="py-8 px-6 sm:px-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
            >
              <Bookmark className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs text-white/25 font-medium">Second Brain © 2025</span>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-xs text-white/20 hover:text-white/60 transition-colors duration-200">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}