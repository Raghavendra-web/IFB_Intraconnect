import React from 'react';
import { ScreenType } from '../types';
import { LogIn, MessageSquare, Users, Bell, Settings, Monitor, Maximize2, Sun, Moon } from 'lucide-react';
import { IfbBrandLogo } from './IfbBrandLogo';

interface MetaTopBarProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const MetaTopBar: React.FC<MetaTopBarProps> = ({
  currentScreen,
  onScreenChange,
  isFrameMode,
  onToggleFrameMode,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="bg-white border-b border-[#E9EDEF] px-4 py-2 flex items-center justify-between select-none text-[13px] flex-shrink-0 z-40 transition-colors">
      {/* Left branding */}
      <div className="flex items-center gap-2.5">
        <IfbBrandLogo variant="badge" theme={theme} className="w-7 h-7 rounded-md p-1" />
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[#111B21] tracking-tight text-[13px]">
            Intraconnect
          </span>
          <span className="text-[10px] text-[#667781] bg-[#F0F2F5] px-1.5 py-0.5 rounded font-medium">
            IFB Automotive
          </span>
        </div>
      </div>

      {/* Screen Switcher Pills (WhatsApp / Slack workspace tabs style) */}
      <div className="flex items-center gap-1 bg-[#F0F2F5] p-1 rounded-full border border-[#E9EDEF]" role="tablist">
        <button
          role="tab"
          aria-selected={currentScreen === 'login'}
          onClick={() => onScreenChange('login')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
            currentScreen === 'login'
              ? 'bg-[#1e88e5] text-white shadow-xs'
              : 'text-[#667781] hover:text-[#111B21] hover:bg-white/60'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Login</span>
        </button>

        <button
          role="tab"
          aria-selected={currentScreen === 'chat'}
          onClick={() => onScreenChange('chat')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
            currentScreen === 'chat'
              ? 'bg-[#1e88e5] text-white shadow-xs'
              : 'text-[#667781] hover:text-[#111B21] hover:bg-white/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chats</span>
        </button>

        <button
          role="tab"
          aria-selected={currentScreen === 'admin'}
          onClick={() => onScreenChange('admin')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
            currentScreen === 'admin'
              ? 'bg-[#1e88e5] text-white shadow-xs'
              : 'text-[#667781] hover:text-[#111B21] hover:bg-white/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Directory</span>
        </button>

        <button
          role="tab"
          aria-selected={currentScreen === 'announcements'}
          onClick={() => onScreenChange('announcements')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
            currentScreen === 'announcements'
              ? 'bg-[#1e88e5] text-white shadow-xs'
              : 'text-[#667781] hover:text-[#111B21] hover:bg-white/60'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Broadcasts</span>
        </button>

        <button
          role="tab"
          aria-selected={currentScreen === 'settings'}
          onClick={() => onScreenChange('settings')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
            currentScreen === 'settings'
              ? 'bg-[#1e88e5] text-white shadow-xs'
              : 'text-[#667781] hover:text-[#111B21] hover:bg-white/60'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Right Controls: Theme Toggle + Canvas Frame Mode + Status */}
      <div className="flex items-center gap-2">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-full border transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-[#202c33] text-white border-[#222e35]'
              : 'bg-[#F0F2F5] text-[#54656F] border-[#E9EDEF] hover:text-[#111B21]'
          }`}
        >
          {theme === 'dark' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </>
          )}
        </button>

        <button
          onClick={onToggleFrameMode}
          title={isFrameMode ? 'Switch to Fluid Full Width' : 'Switch to 1280×800 Window'}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[12px] text-[#54656F] hover:text-[#111B21] bg-[#F0F2F5] border border-[#E9EDEF] rounded-full hover:border-[#cbd5e1] transition-colors cursor-pointer"
        >
          {isFrameMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#1e88e5]" />
              <span>1280×800 Desktop</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[#1e88e5]" />
              <span>Fluid Mode</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5 text-[12px] text-[#667781] px-2.5 py-1">
          <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
          <span>Online</span>
        </div>
      </div>
    </header>
  );
};
