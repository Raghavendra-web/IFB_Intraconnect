import React, { useState, useMemo } from 'react';
import { Employee, OperatorStatus, ShiftCode } from '../../types';
import {
  Download,
  Plus,
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Send,
  Activity,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminScreenProps {
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onEditEmployee: (id: string, updated: Partial<Employee>) => void;
  onDeleteEmployee: (id: string, permanent: boolean) => void;
  onBatchStatusChange: (ids: string[], newStatus: OperatorStatus) => void;
  onShowToast: (msg: string) => void;
}

type SortField = 'empId' | 'name' | 'dept' | 'role' | 'location' | 'shiftCode';

export const AdminScreen: React.FC<AdminScreenProps> = ({
  employees,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onBatchStatusChange,
  onShowToast
}) => {
  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('empId');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['emp-1', 'emp-2']));

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [deletingEmp, setDeletingEmp] = useState<Employee | null>(null);
  const [deleteActionType, setDeleteActionType] = useState<'deactivate' | 'purge'>('deactivate');
  const [isBulkDeactivateModalOpen, setIsBulkDeactivateModalOpen] = useState(false);

  // Form fields for Add Employee
  const [addName, setAddName] = useState('');
  const [addEmpId, setAddEmpId] = useState(`IFB-EMP-${employees.length + 242}`);
  const [addDept, setAddDept] = useState('Assembly Line');
  const [addRole, setAddRole] = useState('');
  const [addShiftCode, setAddShiftCode] = useState<ShiftCode>('A');
  const [addLocation, setAddLocation] = useState('Assembly Line 3');
  const [addMachineId, setAddMachineId] = useState('MCH-0050');
  const [addStatus, setAddStatus] = useState<OperatorStatus>('Active');

  // Form fields for Edit Employee
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('Assembly Line');
  const [editRole, setEditRole] = useState('');
  const [editShiftCode, setEditShiftCode] = useState<ShiftCode>('A');
  const [editLocation, setEditLocation] = useState('');
  const [editMachineId, setEditMachineId] = useState('');
  const [editStatus, setEditStatus] = useState<OperatorStatus>('Active');

  // Filtered & Sorted Employees
  const processedEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept =
          deptFilter === 'all' ||
          emp.dept.toLowerCase() === deptFilter.toLowerCase();

        const matchesStatus =
          statusFilter === 'all' ||
          emp.status.toLowerCase() === statusFilter.toLowerCase();

        const matchesShift =
          shiftFilter === 'all' || emp.shiftCode === shiftFilter;

        return matchesSearch && matchesDept && matchesStatus && matchesShift;
      })
      .sort((a, b) => {
        const valA = (a[sortField] || '').toLowerCase();
        const valB = (b[sortField] || '').toLowerCase();
        const res = valA.localeCompare(valB, undefined, { numeric: true });
        return sortAsc ? res : -res;
      });
  }, [employees, searchQuery, deptFilter, statusFilter, shiftFilter, sortField, sortAsc]);

  // Paginated list
  const totalItems = processedEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedEmployees.slice(start, start + pageSize);
  }, [processedEmployees, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleToggleSelectAllVisible = (checked: boolean) => {
    const next = new Set(selectedIds);
    paginatedEmployees.forEach((e) => {
      if (checked) next.add(e.id);
      else next.delete(e.id);
    });
    setSelectedIds(next);
  };

  const handleSelectAllTotal = () => {
    const next = new Set(employees.map((e) => e.id));
    setSelectedIds(next);
    onShowToast(`Selected all ${employees.length} operators.`);
  };

  const handleClearSelections = () => {
    setSelectedIds(new Set());
  };

  const handleApplyBulkStatus = (status: OperatorStatus) => {
    if (selectedIds.size === 0) return;
    onBatchStatusChange(Array.from(selectedIds), status);
    onShowToast(`Updated status to "${status}" for ${selectedIds.size} operators.`);
  };

  const handleExportSelectedCSV = () => {
    const listToExport =
      selectedIds.size > 0
        ? employees.filter((e) => selectedIds.has(e.id))
        : employees;

    let csvContent = 'ID,Name,Department,Role,ShiftCode,Location,MachineID,Status,Email\n';
    listToExport.forEach((e) => {
      csvContent += `"${e.empId}","${e.name}","${e.dept}","${e.role}","Shift ${e.shiftCode}","${e.location}","${e.machineId}","${e.status}","${e.email || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IFB_Operators_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Exported ${listToExport.length} operators to CSV.`);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmp(emp);
    setEditName(emp.name);
    setEditDept(emp.dept);
    setEditRole(emp.role);
    setEditShiftCode(emp.shiftCode || 'A');
    setEditLocation(emp.location);
    setEditMachineId(emp.machineId);
    setEditStatus(emp.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp || !editName.trim() || !editRole.trim()) return;

    onEditEmployee(editingEmp.id, {
      name: editName.trim(),
      dept: editDept,
      role: editRole.trim(),
      shiftCode: editShiftCode,
      shift: `Shift ${editShiftCode}`,
      location: editLocation.trim(),
      machineId: editMachineId.trim(),
      status: editStatus
    });

    setEditingEmp(null);
    onShowToast(`Operator ${editingEmp.empId} updated in plant directory.`);
  };

  const handleConfirmDelete = () => {
    if (!deletingEmp) return;
    const isPermanent = deleteActionType === 'purge';
    onDeleteEmployee(deletingEmp.id, isPermanent);
    setDeletingEmp(null);
    onShowToast(
      isPermanent
        ? `Operator ${deletingEmp.empId} removed.`
        : `Operator ${deletingEmp.empId} deactivated.`
    );
  };

  const handleConfirmBulkDeactivate = () => {
    if (selectedIds.size === 0) return;
    onBatchStatusChange(Array.from(selectedIds), 'Inactive');
    setIsBulkDeactivateModalOpen(false);
    onShowToast(`Deactivated ${selectedIds.size} operators.`);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addRole.trim() || !addEmpId.trim()) return;

    const initials = addName
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    onAddEmployee({
      empId: addEmpId.trim(),
      name: addName.trim(),
      initials,
      dept: addDept,
      role: addRole.trim(),
      shift: `Shift ${addShiftCode}`,
      shiftCode: addShiftCode,
      location: addLocation.trim() || 'Assembly Bay',
      machineId: addMachineId.trim() || 'MCH-0099',
      status: addStatus,
      avatarBg: '#1e88e5',
      email: `${addName.toLowerCase().replace(/\s+/g, '.')}@ifbautomotive.com`
    });

    setIsAddModalOpen(false);
    setAddName('');
    setAddRole('');
    setAddEmpId(`IFB-EMP-${employees.length + 243}`);
    onShowToast(`New operator enrolled to personnel register.`);
  };

  const renderStatusBadge = (status: OperatorStatus) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Active
        </span>
      );
    } else if (status === 'On Leave') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium text-amber-700 bg-amber-50 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          On Leave
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium text-gray-600 bg-gray-100 border border-gray-200">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          Inactive
        </span>
      );
    }
  };

  const getShiftBadge = (code: ShiftCode) => {
    switch (code) {
      case 'A':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'B':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const isAllVisibleSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((e) => selectedIds.has(e.id));

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#F0F2F5] p-4 overflow-y-auto select-none">
      {/* Content Area Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-semibold text-[#111B21]">Team Directory & Operations</h2>
            <span className="text-[12px] text-[#25D366] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
              Live Sync
            </span>
          </div>
          <p className="text-[13px] text-[#667781] mt-0.5">
            IFB Automotive Pvt Ltd · Personnel, Workstations & Operational Status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSelectedCSV}
            className="px-3.5 h-[34px] bg-white border border-[#E9EDEF] text-[#111B21] hover:bg-[#FAFBFD] text-[13px] font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#1e88e5]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metric Cards (Clean modern cards with IFB blue sparklines) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4 flex-shrink-0">
        {/* Total Employees */}
        <div className="bg-white border border-[#E9EDEF] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <span className="text-[12px] text-[#667781] font-medium block">
              Total Personnel
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[22px] font-bold font-mono-code text-[#111B21]">
                {employees.length + 239}
              </span>
              <span className="text-[11px] text-[#00a884] font-medium">▲ 4 this week</span>
            </div>
          </div>
          <svg className="w-full h-[26px] mt-2 text-[#1e88e5]" viewBox="0 0 100 25">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              points="0,20 15,18 30,15 45,16 60,11 75,13 100,5"
            />
          </svg>
        </div>

        {/* Active Now */}
        <div className="bg-white border border-[#E9EDEF] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <span className="text-[12px] text-[#667781] font-medium block">
              Active on Shift
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[22px] font-bold font-mono-code text-[#1e88e5]">
                {employees.filter((e) => e.status === 'Active').length + 177}
              </span>
              <span className="text-[11px] text-[#00a884] font-medium">74% online</span>
            </div>
          </div>
          <svg className="w-full h-[26px] mt-2 text-[#00a884]" viewBox="0 0 100 25">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              points="0,15 20,12 40,16 60,8 80,10 100,4"
            />
          </svg>
        </div>

        {/* Departments */}
        <div className="bg-white border border-[#E9EDEF] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <span className="text-[12px] text-[#667781] font-medium block">
              Departments
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[22px] font-bold font-mono-code text-[#111B21]">8</span>
              <span className="text-[11px] text-[#667781]">All active</span>
            </div>
          </div>
          <svg className="w-full h-[26px] mt-2 text-[#1e88e5]" viewBox="0 0 100 25">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              points="0,12 25,12 50,12 75,12 100,12"
            />
          </svg>
        </div>

        {/* Messages Today */}
        <div className="bg-white border border-[#E9EDEF] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <span className="text-[12px] text-[#667781] font-medium block">
              Messages Today
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[22px] font-bold font-mono-code text-[#111B21]">1,429</span>
              <span className="text-[11px] text-[#00a884] font-medium">▲ 12 vs yest</span>
            </div>
          </div>
          <svg className="w-full h-[26px] mt-2 text-[#1e88e5]" viewBox="0 0 100 25">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              points="0,22 20,18 40,21 60,14 80,9 100,3"
            />
          </svg>
        </div>

        {/* Alerts Today */}
        <div className="bg-white border border-[#E9EDEF] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <span className="text-[12px] text-[#667781] font-medium block">
              Safety Alerts
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[22px] font-bold font-mono-code text-[#dc2626] flex items-center gap-1">
                3
              </span>
              <span className="text-[11px] text-[#dc2626]">Bay 2 Hold</span>
            </div>
          </div>
          <svg className="w-full h-[26px] mt-2 text-[#dc2626]" viewBox="0 0 100 25">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              points="0,5 25,20 50,8 75,22 100,7"
            />
          </svg>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white border border-[#E9EDEF] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div>
            <span className="text-[12px] text-[#667781] font-medium block">
              Avg Response
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[22px] font-bold font-mono-code text-[#111B21]">4.2 m</span>
              <span className="text-[11px] text-[#00a884] font-medium">Optimal</span>
            </div>
          </div>
          <svg className="w-full h-[26px] mt-2 text-[#f59e0b]" viewBox="0 0 100 25">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              points="0,8 30,12 60,15 80,18 100,22"
            />
          </svg>
        </div>
      </div>

      {/* Table Controls (Search, Filters, + Add Employee) */}
      <div className="flex flex-wrap items-center justify-between mb-3 flex-shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#667781]">
            Showing {processedEmployees.length} of {employees.length + 239} Personnel
          </span>
          <span className="text-[11px] text-[#1e88e5] px-2.5 py-0.5 rounded-full bg-[#E7F3FF] font-medium inline-flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#1e88e5]" />
            <span>
              {sortField.toUpperCase()} ({sortAsc ? 'Asc' : 'Desc'})
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-[#667781] w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, name, bay..."
              className="h-[36px] w-56 bg-white border border-[#E9EDEF] rounded-full pl-9 pr-3 text-[13px] text-[#111B21] placeholder-[#667781] focus:ring-1 focus:ring-[#1e88e5] focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Department Filter */}
          <div className="relative flex items-center">
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[36px] bg-white border border-[#E9EDEF] rounded-lg pl-3 pr-7 text-[13px] text-[#111B21] cursor-pointer focus:ring-1 focus:ring-[#1e88e5] focus:outline-none appearance-none shadow-2xs"
            >
              <option value="all">All Departments</option>
              <option value="Assembly Line">Assembly Line</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Maintenance & Tooling">Maintenance & Tooling</option>
              <option value="Logistics">Logistics</option>
              <option value="R&D Engineering">R&D Engineering</option>
              <option value="Safety & EHS">Safety & EHS</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 w-4 h-4 text-[#667781]" />
          </div>

          {/* Status Filter */}
          <div className="relative flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[36px] bg-white border border-[#E9EDEF] rounded-lg pl-3 pr-7 text-[13px] text-[#111B21] cursor-pointer focus:ring-1 focus:ring-[#1e88e5] focus:outline-none appearance-none shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 w-4 h-4 text-[#667781]" />
          </div>

          {/* Add Employee Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-[36px] px-3.5 bg-[#1e88e5] hover:bg-[#1565c0] text-white text-[13px] font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Person
          </button>
        </div>
      </div>

      {/* Batch Actions Bar (when >=1 selected) */}
      {selectedIds.size > 0 && (
        <div className="w-full mb-3 bg-white border border-[#1e88e5] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-[13px] flex-shrink-0 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#E7F3FF] px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#1e88e5]"></span>
              <span className="text-[12px] font-semibold text-[#1e88e5]">
                {selectedIds.size} selected
              </span>
            </div>

            <button
              onClick={handleSelectAllTotal}
              className="text-[13px] text-[#1e88e5] hover:underline font-medium cursor-pointer bg-transparent border-none p-0"
            >
              Select all {employees.length + 239}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onShowToast(`Broadcast prepared for ${selectedIds.size} operators.`)}
              className="h-[30px] px-3 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#111B21] text-[12px] font-medium rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#1e88e5]" />
              Broadcast
            </button>

            <button
              onClick={handleExportSelectedCSV}
              className="h-[30px] px-3 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#111B21] text-[12px] font-medium rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#00a884]" />
              Export
            </button>

            <button
              onClick={() => setIsBulkDeactivateModalOpen(true)}
              className="h-[30px] px-3 bg-red-50 hover:bg-red-100 text-red-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Deactivate
            </button>

            <button
              onClick={handleClearSelections}
              className="h-[30px] w-[30px] bg-transparent hover:bg-[#F0F2F5] text-[#667781] hover:text-[#111B21] rounded-lg flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modern Table Card with Clean Rows */}
      <div className="w-full border border-[#E9EDEF] rounded-xl overflow-hidden flex flex-col flex-1 bg-white shadow-2xs">
        {/* Table Header Row */}
        <div className="h-[42px] bg-[#F0F2F5] border-b border-[#E9EDEF] grid grid-cols-12 px-4 items-center text-[11px] font-semibold uppercase text-[#54656F] tracking-wide select-none">
          <div className="col-span-2 flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={isAllVisibleSelected}
              onChange={(e) => handleToggleSelectAllVisible(e.target.checked)}
              className="rounded border-[#cbd5e1] text-[#1e88e5] focus:ring-0 w-4 h-4 cursor-pointer accent-[#1e88e5]"
            />
            <button
              onClick={() => handleSort('empId')}
              className="flex items-center gap-1 text-[#54656F] hover:text-[#111B21] font-semibold bg-transparent border-none p-0 cursor-pointer"
            >
              <span>OPERATOR ID</span>
              {sortField === 'empId' ? (
                sortAsc ? <ArrowUp className="w-3 h-3 text-[#1e88e5]" /> : <ArrowDown className="w-3 h-3 text-[#1e88e5]" />
              ) : (
                <ArrowUpDown className="w-3 h-3 opacity-40" />
              )}
            </button>
          </div>

          <div className="col-span-3">
            <button
              onClick={() => handleSort('name')}
              className="flex items-center gap-1 text-[#54656F] hover:text-[#111B21] font-semibold bg-transparent border-none p-0 cursor-pointer"
            >
              <span>NAME & DEPT</span>
              {sortField === 'name' ? (
                sortAsc ? <ArrowUp className="w-3 h-3 text-[#1e88e5]" /> : <ArrowDown className="w-3 h-3 text-[#1e88e5]" />
              ) : (
                <ArrowUpDown className="w-3 h-3 opacity-40" />
              )}
            </button>
          </div>

          <div className="col-span-2">
            <button
              onClick={() => handleSort('location')}
              className="flex items-center gap-1 text-[#54656F] hover:text-[#111B21] font-semibold bg-transparent border-none p-0 cursor-pointer"
            >
              <span>LOCATION</span>
              {sortField === 'location' ? (
                sortAsc ? <ArrowUp className="w-3 h-3 text-[#1e88e5]" /> : <ArrowDown className="w-3 h-3 text-[#1e88e5]" />
              ) : (
                <ArrowUpDown className="w-3 h-3 opacity-40" />
              )}
            </button>
          </div>

          <div className="col-span-2">
            <button
              onClick={() => handleSort('shiftCode')}
              className="flex items-center gap-1 text-[#54656F] hover:text-[#111B21] font-semibold bg-transparent border-none p-0 cursor-pointer"
            >
              <span>SHIFT & MACHINE</span>
              {sortField === 'shiftCode' ? (
                sortAsc ? <ArrowUp className="w-3 h-3 text-[#1e88e5]" /> : <ArrowDown className="w-3 h-3 text-[#1e88e5]" />
              ) : (
                <ArrowUpDown className="w-3 h-3 opacity-40" />
              )}
            </button>
          </div>

          <div className="col-span-1">STATUS</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#E9EDEF]/60 text-[13px] flex-1 overflow-y-auto">
          {paginatedEmployees.length === 0 ? (
            <div className="p-8 text-center text-[#667781] text-[13px]">
              No factory personnel match current filter query.
            </div>
          ) : (
            paginatedEmployees.map((emp, index) => {
              const isSelected = selectedIds.has(emp.id);
              const rowBg = isSelected
                ? 'bg-[#E7F3FF]'
                : index % 2 === 0
                ? 'bg-white'
                : 'bg-[#FAFBFD]';

              return (
                <div
                  key={emp.id}
                  className={`h-[48px] ${rowBg} grid grid-cols-12 px-4 items-center hover:bg-[#F0F2F5] transition-colors group`}
                >
                  {/* Operator ID + Checkbox */}
                  <div className="col-span-2 flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectRow(emp.id)}
                      className="rounded border-[#cbd5e1] text-[#1e88e5] focus:ring-0 w-4 h-4 cursor-pointer accent-[#1e88e5]"
                    />
                    <span className="font-mono-code font-semibold text-[#111B21] text-[12px]">
                      {emp.empId}
                    </span>
                  </div>

                  {/* Name + Dept */}
                  <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#1e88e5] text-white text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
                      {emp.initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-[#111B21] truncate leading-tight">
                        {emp.name}
                      </span>
                      <span className="text-[11px] text-[#667781] truncate leading-tight">
                        {emp.dept} · {emp.role}
                      </span>
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="col-span-2 text-[12px] text-[#54656F] truncate">
                    {emp.location}
                  </div>

                  {/* Shift & Machine */}
                  <div className="col-span-2 flex items-center gap-2 text-[12px]">
                    <span className={`px-2 py-0.5 rounded-full font-medium border text-[11px] ${getShiftBadge(emp.shiftCode)}`}>
                      Shift {emp.shiftCode}
                    </span>
                    <span className="text-[#667781] font-mono-code flex items-center gap-1 text-[11px]">
                      <Cpu className="w-3 h-3 text-[#d97706]" />
                      {emp.machineId}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-1">{renderStatusBadge(emp.status)}</div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1 text-[#667781]">
                    <button
                      onClick={() => handleOpenEditModal(emp)}
                      className="hover:text-[#1e88e5] p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                      title="Edit Person"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingEmp(emp);
                        setDeleteActionType('deactivate');
                      }}
                      className="hover:text-red-600 p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                      title="Deactivate or Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Table Footer: Pagination & Counter */}
        <div className="h-[40px] bg-[#FAFBFD] border-t border-[#E9EDEF] px-4 flex items-center justify-between text-[12px] text-[#667781]">
          <div>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} personnel
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md hover:bg-[#E9EDEF] text-[#111B21] disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#111B21] font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md hover:bg-[#E9EDEF] text-[#111B21] disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Plant Telemetry Strip (Restyled Clean & Subtle) */}
      <div className="mt-3 w-full bg-white border border-[#E9EDEF] rounded-xl p-3 flex items-center justify-between text-[12px] text-[#667781] flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[#111B21] font-medium">
          <Activity className="w-4 h-4 text-[#1e88e5]" />
          <span>Industrial Telemetry Bus:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>Modbus TCP:</span>
            <span className="text-[#00a884] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
              Connected
            </span>
          </div>

          <span className="text-[#D1D7DB]">|</span>

          <div className="flex items-center gap-1.5">
            <span>PROFINET:</span>
            <span className="text-[#00a884] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
              Active
            </span>
          </div>

          <span className="text-[#D1D7DB]">|</span>

          <div className="flex items-center gap-1.5">
            <span>Gateway IP:</span>
            <span className="font-mono-code text-[#111B21]">192.168.1.1</span>
          </div>

          <span className="text-[#D1D7DB]">|</span>

          <div className="flex items-center gap-1.5">
            <span>Bus Latency:</span>
            <span className="text-[#00a884] font-mono-code font-semibold">2.4 ms (Nominal)</span>
          </div>
        </div>
      </div>

      {/* Add Employee Modal (Clean WhatsApp/Slack style) */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-[480px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[56px] px-6 border-b border-[#E9EDEF] flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#111B21]">
                Enroll New Personnel
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#667781] hover:text-[#111B21] p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-6 flex flex-col gap-3.5 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Operator Name</label>
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    required
                    placeholder="e.g. Ramesh V."
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Employee ID</label>
                  <input
                    type="text"
                    value={addEmpId}
                    onChange={(e) => setAddEmpId(e.target.value)}
                    required
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] font-mono-code font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Department</label>
                  <select
                    value={addDept}
                    onChange={(e) => setAddDept(e.target.value)}
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none cursor-pointer"
                  >
                    <option value="Assembly Line">Assembly Line</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Maintenance & Tooling">Maintenance & Tooling</option>
                    <option value="Logistics">Logistics</option>
                    <option value="R&D Engineering">R&D Engineering</option>
                    <option value="Safety & EHS">Safety & EHS</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Role / Position</label>
                  <input
                    type="text"
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    placeholder="e.g. Robotic Welder Specialist"
                    required
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Location / Bay</label>
                  <input
                    type="text"
                    value={addLocation}
                    onChange={(e) => setAddLocation(e.target.value)}
                    placeholder="e.g. Assembly Line 3"
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Machine Hardware ID</label>
                  <input
                    type="text"
                    value={addMachineId}
                    onChange={(e) => setAddMachineId(e.target.value)}
                    placeholder="e.g. MCH-0042"
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] font-mono-code focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E9EDEF]">
                <span className="text-[12px] text-[#00a884] font-medium">● Syncs with SAP & Messenger</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#667781] hover:text-[#111B21] rounded-xl font-medium cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1e88e5] hover:bg-[#1565c0] text-white rounded-xl font-medium cursor-pointer transition-colors shadow-xs"
                  >
                    Enroll Person
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmp && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setEditingEmp(null)}
        >
          <div
            className="w-[480px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[56px] px-6 border-b border-[#E9EDEF] flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#111B21]">
                Edit Personnel — {editingEmp.empId}
              </h3>
              <button
                onClick={() => setEditingEmp(null)}
                className="text-[#667781] hover:text-[#111B21] p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-3.5 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Operator Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Role / Position</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Location / Bay</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[#667781] font-medium">Machine Hardware ID</label>
                  <input
                    type="text"
                    value={editMachineId}
                    onChange={(e) => setEditMachineId(e.target.value)}
                    className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] font-mono-code focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E9EDEF]">
                <span className="text-[12px] text-[#00a884] font-medium">● Updated across messenger</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEmp(null)}
                    className="px-4 py-2 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#667781] hover:text-[#111B21] rounded-xl font-medium cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1e88e5] hover:bg-[#1565c0] text-white rounded-xl font-medium cursor-pointer transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Deactivate Modal */}
      {isBulkDeactivateModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsBulkDeactivateModalOpen(false)}
        >
          <div
            className="w-[440px] bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-[16px] font-semibold">Confirm Deactivation</h3>
            </div>
            <p className="text-[13px] text-[#54656F] leading-relaxed">
              Are you sure you want to deactivate {selectedIds.size} team members? They will be marked as inactive in directory and chats.
            </p>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setIsBulkDeactivateModalOpen(false)}
                className="px-4 py-2 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#667781] hover:text-[#111B21] rounded-xl text-[13px] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkDeactivate}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[13px] font-medium cursor-pointer shadow-xs"
              >
                Deactivate {selectedIds.size} Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
