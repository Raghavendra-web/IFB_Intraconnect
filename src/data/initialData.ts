import { Employee, Conversation, Announcement, PlantTelemetry } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    empId: 'IFB-AL-0104',
    name: 'Nishant Kumar',
    initials: 'NK',
    dept: 'Assembly Line',
    role: 'Senior Welder Lead',
    shift: 'Morning Shift A (06:00 - 14:30)',
    shiftCode: 'A',
    location: 'Assembly Line 3',
    machineId: 'MCH-0042',
    status: 'Active',
    avatarBg: '#1e88e5',
    email: 'nishant.k@ifbautomotive.com',
    unreadCount: 2
  },
  {
    id: 'emp-2',
    empId: 'IFB-QC-0211',
    name: 'Priya Sharma',
    initials: 'PS',
    dept: 'Quality Control',
    role: 'Senior QC Inspector',
    shift: 'Morning Shift A (06:00 - 14:30)',
    shiftCode: 'A',
    location: 'QC Bay 2',
    machineId: 'CMM-0108',
    status: 'Active',
    avatarBg: '#1e88e5',
    email: 'priya.s@ifbautomotive.com'
  },
  {
    id: 'emp-3',
    empId: 'IFB-MT-0089',
    name: 'Ravi Menon',
    initials: 'RM',
    dept: 'Maintenance & Tooling',
    role: 'Hydraulic Technician',
    shift: 'Evening Shift B (14:30 - 23:00)',
    shiftCode: 'B',
    location: 'Tooling Rm 1',
    machineId: 'HYD-044',
    status: 'Inactive',
    avatarBg: '#30363d',
    email: 'ravi.m@ifbautomotive.com',
    unreadCount: 1
  },
  {
    id: 'emp-4',
    empId: 'IFB-LG-0342',
    name: 'Lakshmi Gowda',
    initials: 'LG',
    dept: 'Logistics',
    role: 'Dispatch Coordinator',
    shift: 'Night Shift C (23:00 - 06:00)',
    shiftCode: 'C',
    location: 'Bay 3 Staging',
    machineId: 'DOCK-03',
    status: 'Active',
    avatarBg: '#1e88e5',
    email: 'lakshmi.g@ifbautomotive.com'
  },
  {
    id: 'emp-5',
    empId: 'IFB-RD-0012',
    name: 'Amitabh Kulkarni',
    initials: 'AK',
    dept: 'R&D Engineering',
    role: 'Component Engineer',
    shift: 'Morning Shift A (06:00 - 14:30)',
    shiftCode: 'A',
    location: 'Prototype Bay',
    machineId: 'TEST-RIG-02',
    status: 'Active',
    avatarBg: '#1e88e5',
    email: 'amitabh.k@ifbautomotive.com'
  },
  {
    id: 'emp-6',
    empId: 'IFB-SF-0177',
    name: 'Sunita Krishnan',
    initials: 'SK',
    dept: 'Safety & EHS',
    role: 'Plant Safety Officer',
    shift: 'Morning Shift A (06:00 - 14:30)',
    shiftCode: 'A',
    location: 'EHS Station 1',
    machineId: 'EHS-TERM-01',
    status: 'Active',
    avatarBg: '#1e88e5',
    email: 'sunita.k@ifbautomotive.com'
  },
  {
    id: 'emp-7',
    empId: 'IFB-AL-0238',
    name: 'Ananya Iyer',
    initials: 'AI',
    dept: 'Assembly Line',
    role: 'Shift Operations Roster',
    shift: 'Morning Shift A (06:00 - 14:30)',
    shiftCode: 'A',
    location: 'Terminal 04',
    machineId: 'ROST-001',
    status: 'Active',
    avatarBg: '#30363d',
    email: 'ananya.i@ifbautomotive.com'
  },
  {
    id: 'emp-8',
    empId: 'IFB-LG-0199',
    name: 'Rajesh G.',
    initials: 'RG',
    dept: 'Logistics',
    role: 'Dock Bay 3 Supervisor',
    shift: 'Night Shift C (23:00 - 06:00)',
    shiftCode: 'C',
    location: 'Outbound Bay 4',
    machineId: 'FORK-09',
    status: 'Inactive',
    avatarBg: '#30363d',
    email: 'rajesh.g@ifbautomotive.com'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    operatorId: 'emp-1',
    operatorEmpId: 'IFB-AL-0104',
    name: 'Nishant Kumar',
    initials: 'NK',
    dept: 'Assembly Line',
    role: 'Senior Welder Lead',
    shiftCode: 'A',
    location: 'Assembly Line 3',
    machineId: 'MCH-0042',
    status: 'Active',
    lastMessage: 'Batch #A-42 clearance confirmed',
    lastMessageTime: '14:22',
    unreadCount: 2,
    messages: [
      {
        id: 'sys-1',
        senderId: 'system',
        senderName: 'SYSTEM TELEMETRY',
        text: '⚠ Nishant Kumar clocked into Assembly Line 3 · 06:02 AM · MCH-0042 Sync Nominal',
        time: '06:02',
        isSentByMe: false,
        isSystemEvent: true
      },
      {
        id: 'msg-1',
        senderId: 'emp-1',
        senderName: 'Nishant Kumar',
        text: 'Hello Rajeshwar. Station 4 stamping cycle has concluded for Lot 308. All tolerance specifications are within 0.02mm.',
        time: '14:18',
        isSentByMe: false,
        reactions: ['👍', '✅']
      },
      {
        id: 'msg-2',
        senderId: 'me',
        senderName: 'Rajeshwar Pillai',
        text: 'Understood. Did QA review the surface finish on the seat adjustment mechanisms before conveyor transfer?',
        time: '14:20',
        isSentByMe: true,
        status: 'read'
      },
      {
        id: 'msg-3',
        senderId: 'emp-1',
        senderName: 'Nishant Kumar',
        text: 'Yes, Priya signed off on the barcode audit. Batch #A-42 clearance confirmed. Moving units over to finishing line now.',
        time: '14:22',
        isSentByMe: false,
        reactions: ['✅']
      }
    ]
  },
  {
    operatorId: 'emp-2',
    operatorEmpId: 'IFB-QC-0211',
    name: 'Priya Sharma',
    initials: 'PS',
    dept: 'Quality Control',
    role: 'Senior QC Inspector',
    shiftCode: 'A',
    location: 'QC Bay 2',
    machineId: 'CMM-0108',
    status: 'Active',
    lastMessage: 'QC inspection reports uploaded',
    lastMessageTime: '13:50',
    messages: [
      {
        id: 'sys-2',
        senderId: 'system',
        senderName: 'SYSTEM TELEMETRY',
        text: '⚠ CMM-0108 3D Coordinate Calibration Completed · Error Margin: 0.003mm',
        time: '08:15',
        isSentByMe: false,
        isSystemEvent: true
      },
      {
        id: 'msg-p1',
        senderId: 'emp-2',
        senderName: 'Priya Sharma',
        text: 'Shift A quality inspection report for batch 308 seat mechanisms has been uploaded to the terminal database.',
        time: '13:45',
        isSentByMe: false
      },
      {
        id: 'msg-p2',
        senderId: 'me',
        senderName: 'Rajeshwar Pillai',
        text: 'Thanks Priya, reviewing the torque metrics now for signoff before transfer.',
        time: '13:50',
        isSentByMe: true,
        status: 'read'
      }
    ]
  },
  {
    operatorId: 'emp-3',
    operatorEmpId: 'IFB-MT-0089',
    name: 'Ravi Menon',
    initials: 'RM',
    dept: 'Maintenance & Tooling',
    role: 'Hydraulic Technician',
    shiftCode: 'B',
    location: 'Tooling Rm 1',
    machineId: 'HYD-044',
    status: 'Inactive',
    lastMessage: 'Hydraulic press sensor replaced',
    lastMessageTime: '11:15',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-r1',
        senderId: 'emp-3',
        senderName: 'Ravi Menon',
        text: 'Hydraulic press sensor on Line 2 replaced and calibrated to 140 bar.',
        time: '11:15',
        isSentByMe: false,
        reactions: ['⚠️']
      }
    ]
  },
  {
    operatorId: 'emp-4',
    operatorEmpId: 'IFB-LG-0342',
    name: 'Lakshmi Gowda',
    initials: 'LG',
    dept: 'Logistics',
    role: 'Dispatch Coordinator',
    shiftCode: 'C',
    location: 'Bay 3 Staging',
    machineId: 'DOCK-03',
    status: 'Active',
    lastMessage: 'Dock staging Bay 3 ready for trailer 08',
    lastMessageTime: '10:05',
    messages: [
      {
        id: 'msg-lg1',
        senderId: 'emp-4',
        senderName: 'Lakshmi Gowda',
        text: 'Dock staging Bay 3 ready for trailer 08. Mahindra seat mechanisms packed in certified transit pallets.',
        time: '10:05',
        isSentByMe: false
      }
    ]
  },
  {
    operatorId: 'emp-7',
    operatorEmpId: 'IFB-AL-0238',
    name: 'Ananya Iyer',
    initials: 'AI',
    dept: 'Assembly Line',
    role: 'Shift Operations Roster',
    shiftCode: 'A',
    location: 'Terminal 04',
    machineId: 'ROST-001',
    status: 'Active',
    lastMessage: 'Shift change schedules ready',
    lastMessageTime: '09:40',
    messages: [
      {
        id: 'msg-a1',
        senderId: 'emp-7',
        senderName: 'Ananya Iyer',
        text: 'Shift change schedules for Afternoon Shift B are ready for line lead review.',
        time: '09:40',
        isSentByMe: false
      }
    ]
  },
  {
    operatorId: 'emp-8',
    operatorEmpId: 'IFB-LG-0199',
    name: 'Rajesh G.',
    initials: 'RG',
    dept: 'Logistics',
    role: 'Dock Bay 3 Supervisor',
    shiftCode: 'C',
    location: 'Outbound Bay 4',
    machineId: 'FORK-09',
    status: 'Inactive',
    lastMessage: 'Dock 3 truck arriving 08:00',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'msg-rg1',
        senderId: 'emp-8',
        senderName: 'Rajesh G.',
        text: 'Dock 3 trailer incoming from Pune at 08:00 tomorrow with raw stamping blanks.',
        time: 'Yesterday 17:30',
        isSentByMe: false
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    priority: 'URGENT',
    title: 'Conveyor Line 2 Emergency Calibration & Stoppage Notice',
    body: 'Power fluctuations detected in servo drive inverter on Line 2. All technicians assigned to sub-assembly must switch to auxiliary buffers immediately. Safety lockouts engaged until technician signoff.',
    author: 'Ravi Menon',
    authorRole: 'Chief Maintenance Engineer',
    authorInitials: 'RM',
    authorAvatarBg: '#30363d',
    timeAgo: 'Posted 45 mins ago',
    timestamp: '13:40 IST',
    department: 'Maintenance & Safety',
    acknowledgedCount: 184,
    totalAcknowledgedTarget: 247,
    isUnread: true
  },
  {
    id: 'ann-2',
    priority: 'SAFETY',
    title: 'Hot Work Permit Mandatory: Welding Cell 4 Overhead Extraction Servicing',
    body: 'Overhead fume extraction maintenance scheduled from 15:00 to 17:30. All MIG/TIG welding operations in Cell 4 suspended. EHS spark containment curtains must be deployed around perimeter.',
    author: 'Sunita Krishnan',
    authorRole: 'Plant Safety Officer',
    authorInitials: 'SK',
    authorAvatarBg: '#1e88e5',
    timeAgo: 'Posted 2 hours ago',
    timestamp: '11:45 IST',
    department: 'Safety & EHS',
    acknowledgedCount: 219,
    totalAcknowledgedTarget: 247,
    isUnread: true
  },
  {
    id: 'ann-3',
    priority: 'INFO',
    title: 'Quarterly ISO/TS 16949 Quality Audit Schedule — Manufacturing Unit',
    body: 'External compliance team from TÜV SÜD will conduct plant-floor walkthroughs starting Monday 08:00 hrs. All shift managers must have calibration certificates and defect logging sheets ready for inspection.',
    author: 'Priya Sharma',
    authorRole: 'Quality Head',
    authorInitials: 'PS',
    authorAvatarBg: '#1e88e5',
    timeAgo: 'Posted 3 hours ago',
    timestamp: '10:30 IST',
    department: 'Quality Control',
    acknowledgedCount: 142,
    totalAcknowledgedTarget: 247,
    isUnread: false
  },
  {
    id: 'ann-4',
    priority: 'LOGISTICS',
    title: 'Logistics Dispatch Roster: Tata Motors & Mahindra Seat Frame Shipments',
    body: 'Outbound logistics staging at Bay 3 will operate on an extended night shift to meet monthly OEM targets. Forklift operators please verify hydraulic checks with dispatch desk prior to loading trailers.',
    author: 'Lakshmi Gowda',
    authorRole: 'Dispatch Coordinator',
    authorInitials: 'LG',
    authorAvatarBg: '#30363d',
    timeAgo: 'Yesterday',
    timestamp: 'Yesterday 16:15 IST',
    department: 'Logistics & Dispatch',
    acknowledgedCount: 231,
    totalAcknowledgedTarget: 247,
    isUnread: false
  }
];

export const INITIAL_TELEMETRY: PlantTelemetry = {
  plcProtocol: 'Modbus TCP / PROFINET 2.4',
  gatewayIp: '192.168.1.1',
  latencyMs: 2.4,
  firmware: 'IFB-OS-4.8.2-ARM',
  busStatus: 'Connected',
  activeNodes: 18,
  modbusPolling: true,
  profinetMonitoring: true,
  autoReconnect: true,
  busPollIntervalMs: 250
};

