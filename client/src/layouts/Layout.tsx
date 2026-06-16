import ThemeToggle from "../components/ThemeToggle";

export default function Layout({ children }: any) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white relative overflow-hidden transition-colors duration-300">

      {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none
          bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)]
          dark:bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)]
          bg-[size:44px_44px]"
        />

        {/* Premium fade overlay (this is key) */}
        <div className="absolute inset-0 pointer-events-none 
          bg-gradient-to-br 
          from-white via-white/70 to-transparent 
          dark:from-neutral-950 dark:via-neutral-950/60 dark:to-transparent"
        />

      {/* Glow orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-black/3 dark:bg-white/4 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-black/3 dark:bg-white/4 blur-[140px] pointer-events-none" />

      {/* Theme toggle — fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Page content */}
      <div className="relative z-10 p-9">
        {children}
      </div>
    </div>
  );
}