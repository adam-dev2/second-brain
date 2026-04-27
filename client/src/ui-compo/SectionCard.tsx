// components/ui/SectionCard.tsx
const SectionCard = ({ children, className = "" }:any) => {
  return (
    <div
      className={`bg-neutral-900 border border-white/8 rounded-2xl p-6 transition-all hover:border-white/20 ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionCard;