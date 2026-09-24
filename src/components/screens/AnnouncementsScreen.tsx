import React, { useState } from 'react';
import { Announcement, AnnouncementPriority } from '../../types';
import {
  Plus,
  X,
  AlertOctagon,
  AlertTriangle,
  Info,
  Truck,
  Wrench,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Megaphone
} from 'lucide-react';

interface AnnouncementsScreenProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'timeAgo' | 'timestamp'>) => void;
  onShowToast: (msg: string) => void;
}

export const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({
  announcements,
  onAddAnnouncement,
  onShowToast
}) => {
  // Pinned Safety Alert Dismiss State
  const [isPinnedAlertVisible, setIsPinnedAlertVisible] = useState(true);

  // Priority Filter Tabs
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'URGENT' | 'INFO' | 'SAFETY' | 'SHIFT NOTES'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Acknowledged local tracking
  const [acknowledgedSet, setAcknowledgedSet] = useState<Set<string>>(new Set());

  // Form State
  const [priority, setPriority] = useState<AnnouncementPriority>('URGENT');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [department, setDepartment] = useState('Maintenance & Safety');

  const filteredAnnouncements = announcements.filter((ann) => {
    if (priorityFilter === 'ALL') return true;
    if (priorityFilter === 'URGENT') return ann.priority === 'URGENT' || ann.priority === 'CRITICAL';
    if (priorityFilter === 'INFO') return ann.priority === 'INFO' || ann.priority === 'LOGISTICS';
    if (priorityFilter === 'SAFETY') return ann.priority === 'SAFETY';
    if (priorityFilter === 'SHIFT NOTES') return ann.priority === 'SHIFT NOTES' || ann.priority === 'MAINTENANCE';
    return true;
  });

  const handleAcknowledge = (id: string) => {
    const next = new Set(acknowledgedSet);
    if (!next.has(id)) {
      next.add(id);
      setAcknowledgedSet(next);
      onShowToast('Bulletin sign-off logged to team record.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onAddAnnouncement({
      priority,
      title: title.trim(),
      body: body.trim(),
      author: 'Rajeshwar Pillai',
      authorRole: 'Plant Supervisor',
      authorInitials: 'RP',
      authorAvatarBg: '#1e88e5',
      department,
      acknowledgedCount: 1,
      totalAcknowledgedTarget: 247,
      isUnread: true
    });

    setIsModalOpen(false);
    setTitle('');
    setBody('');
    onShowToast(`New announcement broadcasted.`);
  };

  const renderPriorityBadge = (p: AnnouncementPriority) => {
    switch (p) {
      case 'CRITICAL':
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200">
            <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
            {p}
          </span>
        );
      case 'SAFETY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            SAFETY ALERT
          </span>
        );
      case 'LOGISTICS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            {p}
          </span>
        );
      case 'SHIFT NOTES':
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            {p}
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#1e88e5] bg-[#E7F3FF] border border-blue-200">
            <Info className="w-3.5 h-3.5 text-[#1e88e5]" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#F0F2F5] p-4 overflow-y-auto select-none">
      {/* Pinned Active Safety Alert Banner */}
      {isPinnedAlertVisible && (
        <div className="w-full bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl mb-4 flex items-center justify-between text-[13px] font-medium shadow-2xs flex-shrink-0 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Active Safety Notice · Quality Control Bay 2 — Inspection Hold until 14:00 (Calibration Check)
            </span>
          </div>

          <button
            onClick={() => setIsPinnedAlertVisible(false)}
            className="p-1 rounded-full hover:bg-amber-100 transition-colors cursor-pointer text-amber-700"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Bar: Title + New Announcement */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#111B21]">Team Broadcasts & Bulletins</h2>
            <span className="text-[12px] text-[#1e88e5] bg-[#E7F3FF] border border-blue-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Megaphone className="w-3 h-3 text-[#1e88e5]" />
              Plant Channel
            </span>
          </div>
          <p className="text-[13px] text-[#667781] mt-0.5">
            IFB Automotive Pvt Ltd · Company Updates, Safety Notices & Plant Shift Directives
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="h-[36px] px-4 bg-[#1e88e5] hover:bg-[#1565c0] text-white text-[13px] font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Priority Filter Tabs: Pill shaped */}
      <div className="flex items-center gap-1.5 mb-4 flex-shrink-0 text-[12px] overflow-x-auto no-scrollbar">
        {(['ALL', 'URGENT', 'INFO', 'SAFETY', 'SHIFT NOTES'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPriorityFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              priorityFilter === tab
                ? 'bg-[#E7F3FF] text-[#1e88e5]'
                : 'bg-white text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21] border border-[#E9EDEF]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Announcement Cards List (WhatsApp Channels / Telegram post style) */}
      <div className="flex flex-col gap-3">
        {filteredAnnouncements.map((ann) => {
          const isExpanded = expandedCardId === ann.id;
          const isUrgent = ann.priority === 'URGENT' || ann.priority === 'CRITICAL';
          const isSafety = ann.priority === 'SAFETY';
          const isAck = acknowledgedSet.has(ann.id);
          const currentAckCount = ann.acknowledgedCount + (isAck ? 1 : 0);
          const ackPercent = Math.min(
            100,
            Math.round((currentAckCount / ann.totalAcknowledgedTarget) * 100)
          );

          return (
            <div
              key={ann.id}
              className={`bg-white border border-[#E9EDEF] rounded-xl p-4 flex flex-col gap-2.5 relative transition-all shadow-2xs ${
                isUrgent
                  ? 'border-l-4 border-l-red-500'
                  : isSafety
                  ? 'border-l-4 border-l-amber-500'
                  : 'hover:border-[#cbd5e1]'
              }`}
            >
              {/* Header: Priority + UNREAD Indicator + Timestamp */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderPriorityBadge(ann.priority)}
                  {ann.isUnread && !isAck && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1e88e5] bg-[#E7F3FF] px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1e88e5]"></span>
                      NEW
                    </span>
                  )}
                </div>

                <span className="text-[12px] text-[#667781]">{ann.timeAgo}</span>
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-semibold text-[#111B21] leading-snug flex items-center gap-2">
                {isSafety && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                {ann.title}
              </h3>

              {/* Body */}
              <p
                className={`text-[13px] text-[#54656F] leading-relaxed ${
                  isExpanded ? '' : 'line-clamp-2'
                }`}
              >
                {ann.body}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedCardId(isExpanded ? null : ann.id)}
                  className="text-[#1e88e5] hover:underline text-[12px] font-medium flex items-center gap-0.5 bg-transparent border-none p-0 cursor-pointer"
                >
                  <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Acknowledgement Row */}
              <div className="bg-[#F0F2F5] rounded-xl p-3 flex flex-col gap-2 mt-1 text-[12px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#111B21]">
                    <CheckCircle2 className="w-4 h-4 text-[#00a884]" />
                    <span className="font-medium">
                      Acknowledged by {currentAckCount} / {ann.totalAcknowledgedTarget} members
                    </span>
                    <span className="text-[#00a884] font-semibold">({ackPercent}%)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAcknowledge(ann.id)}
                    disabled={isAck}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      isAck
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#1e88e5] hover:bg-[#1565c0] text-white shadow-2xs'
                    }`}
                  >
                    {isAck ? '✓ Acknowledged' : 'Acknowledge Notice'}
                  </button>
                </div>

                {/* Progress bar in WhatsApp Green */}
                <div className="w-full h-1.5 bg-[#E9EDEF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#25D366] transition-all duration-300"
                    style={{ width: `${ackPercent}%` }}
                  />
                </div>
              </div>

              {/* Footer: Poster Avatar + Name + Timestamp + Dept Tag */}
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#E9EDEF] text-[12px] text-[#667781]">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full text-white text-[10px] font-semibold flex items-center justify-center ${
                      ann.authorAvatarBg ? ann.authorAvatarBg : 'bg-[#1e88e5]'
                    }`}
                  >
                    {ann.authorInitials}
                  </div>
                  <span className="text-[#111B21] font-medium">
                    {ann.author} ({ann.authorRole})
                  </span>
                  <span>•</span>
                  <span>{ann.timestamp}</span>
                </div>

                <span className="bg-[#F0F2F5] text-[#54656F] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                  {ann.department}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Modal (Clean modern modal) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-[480px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[56px] px-6 border-b border-[#E9EDEF] flex items-center justify-between flex-shrink-0">
              <h3 className="text-[16px] font-semibold text-[#111B21]">Post Team Announcement</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#667781] hover:text-[#111B21] p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5 text-[13px]">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Priority Classification</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none cursor-pointer"
                >
                  <option value="CRITICAL">CRITICAL (Emergency / Immediate Hold)</option>
                  <option value="URGENT">URGENT (Action Required Today)</option>
                  <option value="SAFETY">SAFETY (EHS Warning / Lockout Notice)</option>
                  <option value="INFO">INFO (General Plant Notice)</option>
                  <option value="LOGISTICS">LOGISTICS (Dispatch & Staging)</option>
                  <option value="SHIFT NOTES">SHIFT NOTES (Shift Handover)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Headline Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Line 3 Robotic Arm Torque Calibration Alert"
                  required
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] placeholder-[#667781] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Announcement Details</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Instructions for operators and maintenance teams..."
                  rows={4}
                  required
                  className="bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl p-3 text-[#111B21] placeholder-[#667781] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Department Scope</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E9EDEF]">
                <span className="text-[12px] text-[#00a884] font-medium">● Requires team sign-off</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#667781] hover:text-[#111B21] rounded-xl text-[13px] font-medium cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-medium rounded-xl text-[13px] shadow-xs cursor-pointer transition-colors"
                  >
                    Broadcast Bulletin
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
