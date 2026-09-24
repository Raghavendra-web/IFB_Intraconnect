import React, { useState, useEffect } from 'react';

export const BottomStatusBar: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState(34);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.min(48, Math.max(28, next));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="h-[28px] bg-white border-t border-[#E9EDEF] px-4 flex items-center justify-between text-[11px] text-[#667781] select-none flex-shrink-0 z-30 transition-colors">
      {/* Left status indicators: Clean colored dots */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
          <span className="text-[#111B21] font-medium">Plant Net Online</span>
        </div>
        <span className="text-[#D1D7DB]">·</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
          <span>MQTT Broker</span>
        </div>
        <span className="text-[#D1D7DB] hidden sm:inline">·</span>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e88e5]"></span>
          <span>SAP ERP Synced</span>
        </div>
      </div>

      {/* Center Branding */}
      <div className="hidden md:flex items-center gap-1 text-[#111B21] font-medium text-[11px]">
        <span>IFB Automotive Pvt Ltd</span>
        <span className="text-[#D1D7DB]">·</span>
        <span className="text-[#667781]">Operations Hub</span>
      </div>

      {/* Right Hardware Telemetry: Numbers in monospace, clean labels */}
      <div className="flex items-center gap-2.5">
        <span>
          CPU <span className="font-mono-code font-semibold text-[#111B21]">{cpuUsage}%</span>
        </span>
        <span className="text-[#D1D7DB]">·</span>
        <span>
          MEM <span className="font-mono-code text-[#111B21]">1.2 GB</span>
        </span>
        <span className="text-[#D1D7DB] hidden lg:inline">·</span>
        <span className="hidden lg:inline">
          Uptime <span className="font-mono-code text-[#111B21]">14d 6h</span>
        </span>
      </div>
    </footer>
  );
};
