/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenType, Employee, Conversation, Announcement, OperatorStatus, PlantTelemetry } from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_CONVERSATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TELEMETRY
} from './data/initialData';
import { MetaTopBar } from './components/MetaTopBar';
import { AppTopBar } from './components/AppTopBar';
import { AppSidebar } from './components/AppSidebar';
import { BottomStatusBar } from './components/BottomStatusBar';
import { LoginScreen } from './components/screens/LoginScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { AnnouncementsScreen } from './components/screens/AnnouncementsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { Toast } from './components/Toast';

export default function App() {
  // Screen and Layout Frame Mode
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('chat');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);

  // Industrial Theme State: Light (Day Shift) vs Dark (Night Shift)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('ifb-intraconnect-theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
        document.body.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
        document.body.classList.remove('theme-light');
      }
      localStorage.setItem('ifb-intraconnect-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(
        `Switched to ${next === 'light' ? 'Light Mode' : 'Dark Mode'}.`
      );
      return next;
    });
  };

  const handleSetTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
  };

  // Core Data Stores
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [telemetry] = useState<PlantTelemetry>(INITIAL_TELEMETRY);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Login handler
  const handleLoginSuccess = (operatorId: string, shift?: string) => {
    showToast(`Authenticated as ${operatorId}${shift ? ` (${shift.split(' ')[0]})` : ''}.`);
    setCurrentScreen('chat');
  };

  // Chat message sending
  const handleSendMessage = (conversationId: string, text: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.operatorId === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderId: 'me',
            senderName: 'Rajeshwar Pillai',
            text,
            time: timeStr,
            isSentByMe: true,
            status: 'read' as const,
            reactions: []
          };
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: timeStr,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    // Simulated auto-acknowledgement from line operators
    const targetConv = conversations.find((c) => c.operatorId === conversationId);
    if (targetConv) {
      setTimeout(() => {
        const replyTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
        const autoReplies: Record<string, string> = {
          'emp-1': 'Acknowledged Rajeshwar. Station 4 stamping cycle updated in terminal registry.',
          'emp-2': 'Understood supervisor. Defect tolerance certificate will be stamped accordingly.',
          'emp-3': 'Copy that. Calibration pressure logged on hydraulic station console.',
          'emp-7': 'Noted. Updating the shift schedule roster on the plant board.'
        };
        const replyText =
          autoReplies[conversationId] ||
          `Acknowledged Rajeshwar. Transmitted via terminal to ${targetConv.dept}.`;

        setConversations((prev) =>
          prev.map((c) => {
            if (c.operatorId === conversationId) {
              const replyMsg = {
                id: `msg-reply-${Date.now()}`,
                senderId: c.operatorId,
                senderName: c.name,
                text: replyText,
                time: replyTime,
                isSentByMe: false,
                status: 'read' as const,
                reactions: ['👍']
              };
              return {
                ...c,
                lastMessage: replyText,
                lastMessageTime: replyTime,
                messages: [...c.messages, replyMsg]
              };
            }
            return c;
          })
        );
      }, 1200);
    }
  };

  // Employee CRUD
  const handleAddEmployee = (newEmpData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...newEmpData,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [newEmp, ...prev]);

    // Also add to conversations list if not already present
    setConversations((prev) => [
      ...prev,
      {
        operatorId: newEmp.id,
        operatorEmpId: newEmp.empId,
        name: newEmp.name,
        initials: newEmp.initials,
        dept: newEmp.dept,
        role: newEmp.role,
        shift: newEmp.shift,
        shiftCode: newEmp.shiftCode,
        location: newEmp.location,
        machineId: newEmp.machineId,
        status: newEmp.status,
        lastMessage: 'Registered to plant terminal',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg-welcome-${Date.now()}`,
            senderId: newEmp.id,
            senderName: newEmp.name,
            text: `Operator ${newEmp.name} signed into ${newEmp.dept} terminal console.`,
            time: 'Just now',
            isSentByMe: false
          }
        ]
      }
    ]);
  };

  const handleEditEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updated } : emp))
    );
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.operatorId === id) {
          return {
            ...conv,
            name: updated.name || conv.name,
            dept: updated.dept || conv.dept,
            role: updated.role || conv.role,
            shiftCode: updated.shiftCode || conv.shiftCode,
            location: updated.location || conv.location,
            machineId: updated.machineId || conv.machineId,
            status: updated.status || conv.status
          };
        }
        return conv;
      })
    );
  };

  const handleDeleteEmployee = (id: string, permanent: boolean) => {
    if (permanent) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      setConversations((prev) => prev.filter((c) => c.operatorId !== id));
    } else {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, status: 'Inactive' } : emp))
      );
      setConversations((prev) =>
        prev.map((c) => (c.operatorId === id ? { ...c, status: 'Inactive' } : c))
      );
    }
  };

  const handleBatchStatusChange = (ids: string[], newStatus: OperatorStatus) => {
    const idSet = new Set(ids);
    setEmployees((prev) =>
      prev.map((emp) => (idSet.has(emp.id) ? { ...emp, status: newStatus } : emp))
    );
    setConversations((prev) =>
      prev.map((c) => (idSet.has(c.operatorId) ? { ...c, status: newStatus } : c))
    );
  };

  // Add Announcement
  const handleAddAnnouncement = (
    newAnnData: Omit<Announcement, 'id' | 'timeAgo' | 'timestamp'>
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;
    const newAnn: Announcement = {
      ...newAnnData,
      id: `ann-${Date.now()}`,
      timeAgo: 'Just now',
      timestamp: timeStr
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const unreadAlertsCount = announcements.filter((a) => a.isUnread).length;

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'theme-light bg-[#EAEBED] text-[#111B21]' : 'theme-dark bg-[#0b141a] text-[#E9EDEF]'
      } flex flex-col font-sans overflow-x-auto`}
    >
      {/* Top Global Meta Navigation Bar for Previewing All 5 Screens */}
      <MetaTopBar
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        isFrameMode={isFrameMode}
        onToggleFrameMode={() => setIsFrameMode((prev) => !prev)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Frame: Either 1280x800 Desktop Window or Fluid Fullscreen */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto">
        <main
          className={`bg-white border border-[#E9EDEF] rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all duration-150 ${
            isFrameMode
              ? 'w-[1280px] h-[800px] min-w-[1280px] max-w-[1280px] my-auto'
              : 'w-full h-[calc(100vh-60px)] min-h-[680px]'
          }`}
        >
          {/* App Top Bar (42px) with live clock, plant chip, shift code & user profile */}
          <AppTopBar
            onOpenAnnouncements={() => setCurrentScreen('announcements')}
            onOpenSettings={() => setCurrentScreen('settings')}
            unreadCount={unreadAlertsCount || 3}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />

          {/* App Body Frame: Left Sidebar + Active Screen Viewport */}
          <div className="flex-1 flex overflow-hidden bg-[#F0F2F5]">
            <AppSidebar
              currentScreen={currentScreen}
              onScreenChange={setCurrentScreen}
            />

            {/* Dynamic Viewport */}
            <div className="flex-1 h-full overflow-hidden relative bg-[#F0F2F5]">
              {currentScreen === 'login' && (
                <LoginScreen
                  onLoginSuccess={handleLoginSuccess}
                  onShowToast={showToast}
                />
              )}

              {currentScreen === 'chat' && (
                <ChatScreen
                  conversations={conversations}
                  onSendMessage={handleSendMessage}
                  onShowToast={showToast}
                />
              )}

              {currentScreen === 'admin' && (
                <AdminScreen
                  employees={employees}
                  onAddEmployee={handleAddEmployee}
                  onEditEmployee={handleEditEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onBatchStatusChange={handleBatchStatusChange}
                  onShowToast={showToast}
                />
              )}

              {currentScreen === 'announcements' && (
                <AnnouncementsScreen
                  announcements={announcements}
                  onAddAnnouncement={handleAddAnnouncement}
                  onShowToast={showToast}
                />
              )}

              {currentScreen === 'settings' && (
                <SettingsScreen
                  onShowToast={showToast}
                  theme={theme}
                  onSetTheme={handleSetTheme}
                />
              )}
            </div>
          </div>

          {/* Fixed Bottom Status Bar (32px, full width, monospace, real-time telemetry) */}
          <BottomStatusBar />
        </main>
      </div>

      {/* Global Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );

}
