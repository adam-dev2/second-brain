const StatCard = ({ label, value }:any) => {
  return (
    <div className="bg-neutral-900 border border-white/8 rounded-2xl p-5 transition-all hover:border-white/20 hover:bg-neutral-800">
      <p className="text-xs text-neutral-400 mb-2">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
};

export default StatCard;