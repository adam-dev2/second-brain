// components/ui/TagBar.tsx
const TagBar = ({ name, count, max }:any) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-neutral-300">{name}</span>
        <span className="text-xs text-white">{count}</span>
      </div>

      <div className="w-full bg-white/6 rounded-full h-1.5">
        <div
          className="bg-white/40 h-1.5 rounded-full transition-all"
          style={{ width: `${(count / max) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default TagBar;