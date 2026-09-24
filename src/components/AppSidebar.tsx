import React from 'react';
import { ScreenType } from '../types';
import { MessageSquare, Bell, Users, Settings, LogOut } from 'lucide-react';
import { IfbBrandLogo } from './IfbBrandLogo';

interface AppSidebarProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentScreen, onScreenChange }) => {
  return (
    <aside className="w-[58px] bg-white border-r border-[#E9EDEF] flex flex-col items-center py-2.5 flex-shrink-0 justify-between select-none z-20 transition-colors">
      {/* Upper Navigation Icons (Telegram Desktop style) */}
      <div className="flex flex-col items-center w-full gap-2">
        {/* Top Company Workspace Icon */}
        <div className="relative group w-full flex justify-center pb-1 mb-1 border-b border-[#E9EDEF]/80">
          <button
            onClick={() => onScreenChange('chat')}
            aria-label="IFB Automotive Workspace"
            className="w-[40px] h-[40px] rounded-xl flex items-center justify-center p-1 hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            <IfbBrandLogo variant="mark" height={22} />
          </button>
          <div className="absolute left-[64px] top-2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#111B21] text-white text-[11px] font-semibold px-2 py-1 rounded-md whitespace-nowrap shadow-md">
              IFB Automotive Pvt Ltd
            </div>
          </div>
        </div>

        {/* Chat / Messages */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={() => onScreenChange('chat')}
            aria-label="Chats"
            className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentScreen === 'chat'
                ? 'text-[#1e88e5] bg-[#E7F3FF]'
                : 'text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5]'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          {/* Tooltip */}
          <div className="absolute left-[64px] top-2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#111B21] text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md">
              Chats
            </div>
          </div>
        </div>

        {/* Directory / Personnel */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={() => onScreenChange('admin')}
            aria-label="Directory"
            className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentScreen === 'admin'
                ? 'text-[#1e88e5] bg-[#E7F3FF]'
                : 'text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5]'
            }`}
          >
            <Users className="w-5 h-5" />
          </button>
          <div className="absolute left-[64px] top-2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#111B21] text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md">
              Directory
            </div>
          </div>
        </div>

        {/* Announcements / Bulletins */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={() => onScreenChange('announcements')}
            aria-label="Broadcasts"
            className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentScreen === 'announcements'
                ? 'text-[#1e88e5] bg-[#E7F3FF]'
                : 'text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5]'
            }`}
          >
            <Bell className="w-5 h-5" />
          </button>
          <div className="absolute left-[64px] top-2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#111B21] text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md">
              Broadcasts
            </div>
          </div>
        </div>
      </div>

      {/* Lower Navigation Icons (Settings, Sign Out & subtle MQTT dot) */}
      <div className="flex flex-col items-center w-full gap-2">
        {/* Settings */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={() => onScreenChange('settings')}
            aria-label="Settings"
            className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentScreen === 'settings'
                ? 'text-[#1e88e5] bg-[#E7F3FF]'
                : 'text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5]'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="absolute left-[64px] top-2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#111B21] text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md">
              Settings
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={() => onScreenChange('login')}
            aria-label="Sign Out"
            className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentScreen === 'login'
                ? 'text-[#1e88e5] bg-[#E7F3FF]'
                : 'text-[#54656F] hover:text-[#dc2626] hover:bg-[#F0F2F5]'
            }`}
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="absolute left-[64px] top-2 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#111B21] text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md">
              Sign Out
            </div>
          </div>
        </div>

        {/* Subtle MQTT Connection Status Dot */}
        <div className="relative group w-full flex justify-center pt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] cursor-pointer" />
          <div className="absolute left-[64px] bottom-0 hidden group-hover:flex items-center z-50 pointer-events-none">
            <div className="bg-[#111B21] text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
              <span>MQTT Broker Connected</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
