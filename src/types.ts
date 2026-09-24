export type ScreenType = 'login' | 'chat' | 'admin' | 'announcements' | 'settings';

export type OperatorStatus = 'Active' | 'Inactive' | 'On Leave';

export type ShiftCode = 'A' | 'B' | 'C';

export interface Employee {
  id: string; // Database key
  empId: string; // e.g. IFB-AL-0104
  name: string;
  initials: string;
  dept: string;
  role: string;
  shift: string;
  shiftCode: ShiftCode;
  location: string;
  machineId: string;
  status: OperatorStatus;
  avatarBg?: string;
  email?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isSentByMe: boolean;
  status?: 'delivered' | 'read';
  reactions?: string[];
  isSystemEvent?: boolean;
  attachment?: {
    name: string;
    type: string;
    size: string;
  };
}

export interface Conversation {
  operatorId: string;
  operatorEmpId: string;
  name: string;
  initials: string;
  dept: string;
  role: string;
  shiftCode: ShiftCode;
  location: string;
  machineId: string;
  status: OperatorStatus;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  messages: ChatMessage[];
}

export type AnnouncementPriority = 'CRITICAL' | 'URGENT' | 'INFO' | 'LOGISTICS' | 'MAINTENANCE' | 'SAFETY' | 'SHIFT NOTES';

export interface Announcement {
  id: string;
  priority: AnnouncementPriority;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  authorInitials: string;
  authorAvatarBg?: string;
  timeAgo: string;
  timestamp: string;
  department: string;
  acknowledgedCount: number;
  totalAcknowledgedTarget: number;
  isUnread?: boolean;
}

export interface PlantTelemetry {
  plcProtocol: string;
  gatewayIp: string;
  latencyMs: number;
  firmware: string;
  busStatus: 'Connected' | 'Degraded' | 'Offline';
  activeNodes: number;
  modbusPolling: boolean;
  profinetMonitoring: boolean;
  autoReconnect: boolean;
  busPollIntervalMs: number;
}

