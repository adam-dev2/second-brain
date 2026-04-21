import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
        <div
          className="h-full w-[40%] rounded-full"
          style={{
            background: "linear-gradient(90deg, #7F77DD, #1D9E75, #D4537E)",
            animation: "indeterminate 1.4s ease-in-out infinite",
          }}
        />
      </div>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              style={{
                animation: "dotPulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes indeterminate {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
      `}</style>
    </div>
    </div>
  );
};

export default LoadingOverlay;