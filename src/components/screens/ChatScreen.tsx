import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ShiftCode } from '../../types';
import {
  Search,
  Send,
  Paperclip,
  Image,
  Mic,
  Flag,
  Phone,
  Video,
  UserCheck,
  Megaphone,
  Check,
  CheckCheck,
  X,
  Pin
} from 'lucide-react';

interface ChatScreenProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  onShowToast: (msg: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  conversations,
  onSendMessage,
  onShowToast
}) => {
  const [activeId, setActiveId] = useState<string>(
    conversations[0]?.operatorId || 'emp-1'
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<'ALL' | 'ASSEMBLY' | 'QC' | 'LOGISTICS' | 'R&D'>('ALL');
  const [isUrgentPriority, setIsUrgentPriority] = useState(false);
  const [selectedProfileModal, setSelectedProfileModal] = useState<Conversation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find((c) => c.operatorId === activeId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Department chip filter
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.operatorEmpId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dept.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (deptFilter === 'ALL') return true;
    if (deptFilter === 'ASSEMBLY') return c.dept.toLowerCase().includes('assembly');
    if (deptFilter === 'QC') return c.dept.toLowerCase().includes('quality');
    if (deptFilter === 'LOGISTICS') return c.dept.toLowerCase().includes('logistics');
    if (deptFilter === 'R&D') return c.dept.toLowerCase().includes('r&d');
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageToSend = isUrgentPriority ? `[URGENT] ${inputText.trim()}` : inputText.trim();
    onSendMessage(activeId, messageToSend);
    setInputText('');
    if (isUrgentPriority) {
      setIsUrgentPriority(false);
      onShowToast('Urgent priority dispatch sent.');
    }
  };

  const handleReactionAdd = (msgIndex: number, emoji: string) => {
    onShowToast(`Reaction ${emoji} added.`);
  };

  // Avatar pastel backgrounds for WhatsApp style contact list
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-[#00a884] text-white',
      'bg-[#1e88e5] text-white',
      'bg-[#6b52ae] text-white',
      'bg-[#d97706] text-white',
      'bg-[#0284c7] text-white',
      'bg-[#059669] text-white'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex w-full h-full bg-[#F0F2F5] overflow-hidden select-none">
      {/* ========================================================
          LEFT PANEL: WhatsApp Web Contact List (310px)
          ======================================================== */}
      <div className="w-[310px] bg-white border-r border-[#E9EDEF] flex flex-col flex-shrink-0 z-10">
        {/* Header: "Chats" + Online count */}
        <div className="p-3 border-b border-[#E9EDEF] flex flex-col gap-2.5 flex-shrink-0">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[17px] font-semibold text-[#111B21] tracking-tight">
              Chats
            </h2>
            <div className="flex items-center gap-1.5 text-[12px] text-[#667781]">
              <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
              <span>{conversations.filter((c) => c.status === 'Active').length} online</span>
            </div>
          </div>

          {/* Search bar: rounded pill, #F0F2F5 bg, no border */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-[#667781] w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full h-[36px] bg-[#F0F2F5] rounded-full pl-9 pr-3 text-[13px] text-[#111B21] placeholder-[#667781] focus:bg-white focus:ring-1 focus:ring-[#1e88e5] focus:outline-none transition-all"
            />
          </div>

          {/* Department Filter Chips: Pill shape radius 16px */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[12px]">
            {(['ALL', 'ASSEMBLY', 'QC', 'LOGISTICS', 'R&D'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1 rounded-full transition-all whitespace-nowrap cursor-pointer text-[12px] ${
                  deptFilter === dept
                    ? 'bg-[#E7F3FF] text-[#1e88e5] font-semibold'
                    : 'bg-[#F0F2F5] text-[#667781] hover:bg-[#e4e6eb] hover:text-[#111B21]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Contact rows (WhatsApp style, 72px height) */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E9EDEF]/60">
          {/* PINNED ITEM: PLANT BROADCAST */}
          <div
            onClick={() => onShowToast('Connected to Plant Broadcast channel.')}
            className="h-[72px] px-3.5 bg-[#FAFBFD] hover:bg-[#F0F2F5] transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Orange avatar circle */}
              <div className="w-[48px] h-[48px] rounded-full bg-[#f97316] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold text-[#111B21] truncate">
                    Plant Broadcast
                  </span>
                  <Pin className="w-3.5 h-3.5 text-[#667781]" />
                </div>
                <span className="text-[13px] text-[#667781] truncate">
                  All Assembly Bays & Quality Lines
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
          </div>

          {/* Conversations List */}
          {filteredConversations.map((conv) => {
            const isSelected = conv.operatorId === activeId;
            const lastMsg = conv.messages[conv.messages.length - 1];
            return (
              <div
                key={conv.operatorId}
                onClick={() => setActiveId(conv.operatorId)}
                className={`h-[72px] px-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#F0F2F5]' : 'bg-white hover:bg-[#F5F6F8]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar circle (48px) with colorful initials */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-[48px] h-[48px] rounded-full text-[15px] font-semibold flex items-center justify-center shadow-xs ${getAvatarColor(
                        conv.name
                      )}`}
                    >
                      {conv.initials}
                    </div>

                    {conv.status === 'Active' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white" />
                    )}
                  </div>

                  {/* Name + Message preview + Shift tag */}
                  <div className="flex flex-col min-w-0 justify-center">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-medium text-[#111B21] truncate">
                        {conv.name}
                      </span>
                    </div>

                    {/* Preview line: [Shift] + last message */}
                    <div className="flex items-center gap-1.5 text-[13px] text-[#667781] truncate mt-0.5">
                      <span className="text-[11px] font-medium text-[#1e88e5] bg-[#E7F3FF] px-1.5 py-0.2 rounded-md">
                        Shift {conv.shiftCode}
                      </span>
                      <span className="truncate">
                        {lastMsg ? lastMsg.text : conv.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Timestamp & WhatsApp Green Badge */}
                <div className="flex flex-col items-end flex-shrink-0 gap-1 pl-2">
                  <span className="text-[12px] text-[#667781]">
                    {conv.lastMessageTime}
                  </span>
                  {conv.unreadCount && conv.unreadCount > 0 ? (
                    <span className="min-w-[19px] h-[19px] px-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          RIGHT PANEL: WhatsApp / Telegram Chat Area
          ======================================================== */}
      <div className="flex-1 flex flex-col bg-[#F0F2F5] min-w-0">
        {/* Chat Header: 56px height, white bg */}
        <div className="h-[56px] bg-white border-b border-[#E9EDEF] px-4 flex items-center justify-between flex-shrink-0 z-10">
          {/* Active Operator info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div
                className={`w-[40px] h-[40px] rounded-full text-[14px] font-semibold flex items-center justify-center shadow-xs ${getAvatarColor(
                  activeConversation.name
                )}`}
              >
                {activeConversation.initials}
              </div>
              {activeConversation.status === 'Active' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-white" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-[#111B21] leading-tight truncate">
                  {activeConversation.name}
                </span>
                <span className="text-[11px] font-medium text-[#1e88e5] bg-[#E7F3FF] px-2 py-0.5 rounded-full">
                  Shift {activeConversation.shiftCode}
                </span>
              </div>

              {/* Subtitle & Status */}
              <div className="flex items-center gap-2 text-[12px] text-[#667781] leading-tight mt-0.5">
                <span className="text-[#25D366] font-medium">● Online</span>
                <span>·</span>
                <span className="truncate">{activeConversation.location}</span>
                <span>·</span>
                <span>{activeConversation.machineId}</span>
              </div>
            </div>
          </div>

          {/* Right Icon buttons: Call, Video, Profile */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onShowToast(`Calling ${activeConversation.name}...`)}
              className="p-2 rounded-full text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              title="Voice Call"
            >
              <Phone className="w-5 h-5" />
            </button>

            <button
              onClick={() => onShowToast(`Starting video call with ${activeConversation.name}...`)}
              className="p-2 rounded-full text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              title="Video Call"
            >
              <Video className="w-5 h-5" />
            </button>

            <button
              onClick={() => setSelectedProfileModal(activeConversation)}
              className="p-2 rounded-full text-[#54656F] hover:text-[#111B21] hover:bg-[#F0F2F5] transition-colors cursor-pointer"
              title="View Profile Details"
            >
              <UserCheck className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread with WhatsApp Warm Wallpaper Texture */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 whatsapp-wallpaper">
          {activeConversation.messages.map((msg, idx) => {
            // System message banner (centered subtle pill)
            if (msg.isSystemEvent) {
              return (
                <div key={msg.id} className="w-full flex justify-center my-1.5">
                  <div className="bg-[#E9EDEF] text-[#667781] text-[12px] px-3.5 py-1 rounded-full shadow-2xs font-normal">
                    {msg.text} · {msg.time}
                  </div>
                </div>
              );
            }

            const isMine = msg.isSentByMe;
            return (
              <div
                key={msg.id}
                className={`group relative flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Container: Received = White (#FFFFFF), Sent = WhatsApp Green (#D9FDD3) */}
                <div
                  className={`max-w-[72%] sm:max-w-[62%] px-3 py-2 text-[14px] leading-relaxed transition-all relative ${
                    isMine
                      ? 'bg-[#D9FDD3] text-[#111B21] bubble-sent'
                      : 'bg-white text-[#111B21] bubble-received'
                  }`}
                >
                  {/* Sender Name if received */}
                  {!isMine && (
                    <div className="text-[12px] font-semibold text-[#1e88e5] mb-0.5">
                      {msg.senderName}
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  {/* Timestamp & Read Receipts inside bubble bottom-right */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-[#667781]">
                    <span>{msg.time}</span>
                    {isMine && (
                      <span title="Read">
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-4 h-4 text-[#53BDEB]" />
                        ) : (
                          <Check className="w-4 h-4 text-[#667781]" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Emoji Reactions below bubble */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {msg.reactions.map((r, rIdx) => (
                        <span
                          key={rIdx}
                          className="bg-white/90 shadow-2xs px-1.5 py-0.5 rounded-full text-[11px] border border-[#E9EDEF]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hover Emoji Reaction Strip */}
                  <div
                    className={`absolute -top-8 hidden group-hover:flex items-center gap-1 bg-white border border-[#E9EDEF] px-2 py-1 rounded-full shadow-md z-20 ${
                      isMine ? 'right-0' : 'left-0'
                    }`}
                  >
                    {['👍', '✅', '❤️', '⚠️', '🔁'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleReactionAdd(idx, emoji)}
                        className="hover:scale-125 transition-transform text-[14px] p-0.5 cursor-pointer bg-transparent border-none"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar: WhatsApp Web style (#F0F2F5 bg, clean rounded pill input) */}
        <div className="p-2.5 bg-[#F0F2F5] border-t border-[#E9EDEF] flex flex-col gap-1.5">
          {isUrgentPriority && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 px-3 py-1 rounded-lg text-[12px] text-red-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Flag className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                Urgent priority flag active — message will be highlighted
              </span>
              <button
                type="button"
                onClick={() => setIsUrgentPriority(false)}
                className="text-red-700 font-semibold hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            {/* Left Icons: Clip, Image, Mic in #54656F */}
            <div className="flex items-center gap-0.5 text-[#54656F]">
              <button
                type="button"
                onClick={() => onShowToast('File selector opened for CAD / PDF attachment.')}
                className="p-2 hover:text-[#111B21] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                title="Attach Document"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onShowToast('Photo attach triggered.')}
                className="p-2 hover:text-[#111B21] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                title="Attach Photo"
              >
                <Image className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onShowToast('Hold to record voice memo.')}
                className="p-2 hover:text-[#111B21] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                title="Voice Memo"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Pill Text Input (white bg, radius 20px, #111B21 text, placeholder "Message") */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message"
                className="w-full h-[40px] bg-white rounded-full px-4 text-[14px] text-[#111B21] placeholder-[#667781] focus:outline-none shadow-2xs border border-transparent focus:border-[#E9EDEF] transition-all"
              />
            </div>

            {/* Right: Priority Flag + Send Button (only active/send when typing, else mic) */}
            <div className="flex items-center gap-1">
              {/* Priority flag toggle (subtle flag icon that turns red when urgent) */}
              <button
                type="button"
                onClick={() => setIsUrgentPriority(!isUrgentPriority)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isUrgentPriority
                    ? 'text-red-600 bg-red-100 hover:bg-red-200'
                    : 'text-[#54656F] hover:text-[#111B21] hover:bg-black/5'
                }`}
                title={isUrgentPriority ? 'Urgent Priority Active' : 'Mark as Urgent'}
              >
                <Flag className={`w-5 h-5 ${isUrgentPriority ? 'fill-red-600' : ''}`} />
              </button>

              {/* Send Button: Clean circular IFB blue button */}
              <button
                type={inputText.trim() ? 'submit' : 'button'}
                onClick={!inputText.trim() ? () => onShowToast('Voice note started.') : undefined}
                className="w-[40px] h-[40px] rounded-full bg-[#1e88e5] hover:bg-[#1565c0] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {inputText.trim() ? (
                  <Send className="w-4 h-4 ml-0.5" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Operator Profile Modal (Clean WhatsApp/Telegram Contact Info) */}
      {selectedProfileModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedProfileModal(null)}
        >
          <div
            className="w-[380px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="bg-[#1e88e5] p-5 text-white flex flex-col items-center text-center relative">
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-white text-[#1e88e5] text-2xl font-bold flex items-center justify-center shadow-md mb-2">
                {selectedProfileModal.initials}
              </div>
              <h3 className="text-[18px] font-semibold leading-tight">{selectedProfileModal.name}</h3>
              <span className="text-[13px] text-white/80 mt-0.5">{selectedProfileModal.role}</span>
              <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full mt-2 font-medium">
                {selectedProfileModal.operatorEmpId}
              </span>
            </div>

            {/* Profile Fields */}
            <div className="p-4 flex flex-col gap-3 text-[13px]">
              <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]">
                <span className="text-[#667781]">Shift:</span>
                <span className="text-[#111B21] font-medium">Shift {selectedProfileModal.shiftCode}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]">
                <span className="text-[#667781]">Department:</span>
                <span className="text-[#111B21] font-medium">{selectedProfileModal.dept}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]">
                <span className="text-[#667781]">Current Location:</span>
                <span className="text-[#1e88e5] font-medium">{selectedProfileModal.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]">
                <span className="text-[#667781]">Assigned Machine:</span>
                <span className="text-[#111B21] font-mono-code">{selectedProfileModal.machineId}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#667781]">Status:</span>
                <span className="text-[#25D366] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]"></span> Active on Station
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F0F2F5] border-t border-[#E9EDEF] flex justify-end">
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="px-4 py-2 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-medium text-[13px] rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
