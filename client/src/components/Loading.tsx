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

      <style>{`
        @keyframes indeterminate {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;