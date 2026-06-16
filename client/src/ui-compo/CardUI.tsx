export const CardUI = ({ children, className = "" }:any) => (
  <div className={`bg-neutral-900 border border-white/8 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);