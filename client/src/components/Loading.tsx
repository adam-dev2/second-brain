import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-50">
      <div className="bg-white/50 rounded-2xl p-8 shadow-2xl">
        <svg width="60" height="60" viewBox="0 0 50 50">
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(0 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0s" repeatCount="indefinite"></animate>
          </line>
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(45 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.15s" repeatCount="indefinite"></animate>
          </line>
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(90 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.3s" repeatCount="indefinite"></animate>
          </line>
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(135 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.45s" repeatCount="indefinite"></animate>
          </line>
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(180 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.6s" repeatCount="indefinite"></animate>
          </line>
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(225 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.75s" repeatCount="indefinite"></animate>
          </line>
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(270 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.9s" repeatCount="indefinite"></animate>
          </line>
          <line x1="25" y1="10" x2="25" y2="15" stroke="#181818" strokeWidth="3" strokeLinecap="round" transform="rotate(315 25 25)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="1.05s" repeatCount="indefinite"></animate>
          </line>
        </svg>
      </div>
    </div>
  );
};

export default LoadingOverlay;