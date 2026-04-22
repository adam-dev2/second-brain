export default function Layout({ children }:any) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[140px] pointer-events-none" />

      {/* Page content */}
      <div className="relative z-10 p-9">
        {children}
      </div>
    </div>
  );
}