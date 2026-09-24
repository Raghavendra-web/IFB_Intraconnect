import React, { useState, useEffect } from 'react';
import { Bell, Search, Settings, Sun, Moon } from 'lucide-react';
import { IfbBrandLogo } from './IfbBrandLogo';

interface AppTopBarProps {
  onOpenAnnouncements: () => void;
  onOpenSettings: () => void;
  unreadCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  onOpenAnnouncements,
  onOpenSettings,
  unreadCount = 3,
  theme = 'light',
  onToggleTheme
}) => {
  const [timeStr, setTimeStr] = useState<string>('06:24 AM IST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      setTimeStr(`${hours}:${minutes} ${ampm} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-[52px] bg-white border-b border-[#E9EDEF] px-4 flex items-center justify-between select-none flex-shrink-0 z-30 transition-colors">
      {/* Left: Brand + Official IFB Logo + WhatsApp style Subtitle */}
      <div className="flex items-center gap-3">
        <IfbBrandLogo variant="badge" theme={theme} className="w-[34px] h-[34px] rounded-lg shadow-2xs" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-[#111B21] leading-none tracking-tight">
              Intraconnect
            </span>
            <span className="text-[10px] font-semibold text-[#667781] bg-[#F0F2F5] px-1.5 py-0.5 rounded leading-none hidden sm:inline">
              IFB Automotive
            </span>
          </div>
          <span className="text-[11px] text-[#667781] leading-none mt-1">
            Automotive Systems Division
          </span>
        </div>
      </div>

      {/* Center: Clean Plant Timestamp */}
      <div className="hidden md:flex items-center gap-1.5 text-[12px] text-[#667781]">
        <span>Plant time:</span>
        <span className="text-[#111B21] font-medium font-mono-code">{timeStr}</span>
      </div>

      {/* Right: Quick Search, Bell, Theme Toggle & User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Rounded Pill Search Bar (WhatsApp Web style) */}
        <div className="relative hidden lg:flex items-center">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#667781]" />
          <input
            type="text"
            placeholder="Search plant line / ID..."
            className="w-52 h-[34px] bg-[#F0F2F5] border-0 rounded-full pl-9 pr-3 text-[13px] text-[#111B21] placeholder-[#667781] focus:bg-white focus:ring-1 focus:ring-[#1e88e5] focus:outline-none transition-all"
          />
        </div>

        {/* Light / Dark Mode Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Notifications Bell with Clean Badge */}
        <button
          onClick={onOpenAnnouncements}
          aria-label="View announcements and alerts"
          className="relative text-[#54656F] hover:text-[#111B21] p-2 rounded-full hover:bg-[#F0F2F5] transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute 1 top-1 right-1 min-w-[15px] h-[15px] px-1 bg-[#25D366] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="text-[#54656F] hover:text-[#111B21] p-2 rounded-full hover:bg-[#F0F2F5] transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar with Profile Tag */}
        <div
          onClick={onOpenSettings}
          className="flex items-center gap-2 pl-2 border-l border-[#E9EDEF] cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#1e88e5] text-white text-[12px] font-semibold flex items-center justify-center shadow-xs">
            RP
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-[13px] font-medium text-[#111B21] group-hover:text-[#1e88e5] transition-colors leading-tight">
              R. Pillai
            </span>
            <span className="text-[11px] text-[#667781] leading-tight">
              Plant Supervisor
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
