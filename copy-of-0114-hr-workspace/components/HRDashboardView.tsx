import React, { useState, useMemo } from 'react';
import { 
  Users, Activity, Plane, Search, Filter, Plus, 
  Download, ChevronDown, CheckCircle2, XCircle,
  AlertCircle, Clock, X, Briefcase, UserCircle, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift, ChevronLeft, FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import { ProfileView } from './ProfileView';

// --- Interfaces ---
interface Employee {
  id: string;
  name: string;
  engName: string;
  dept: string;
  role: string;
  // Status is now derived for UI, but data keeps track of work status
  workStatus: '출근' | '퇴근' | '휴가' | '병가' | '출장'; 
  clockInTime?: string;
  email: string;
  personalEmail?: string;
  phone: string;
  joinDate: string;
  avatarUrl?: string;
}

interface HealthRecord {
  id: number;
  name: string;
  lastCheck: string;
  hospital: string;
  result: string;
  risk: '낮음' | '보통' | '높음' | '-' | '미수검';
  nextCheck: string;
}

interface VacationLog {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: '승인됨' | '대기중' | '사용완료' | '반려됨';
  reason: string;
  // Extended fields
  location?: string;
  emergencyContact?: string;
  symptoms?: string;
  hospital?: string;
  relationship?: string;
  eventType?: string;
}

// --- Initial Mock Data ---
const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'HR001', name: '김유연', engName: 'Jenny Kim', dept: 'People & Culture', role: 'Senior Manager', workStatus: '출근', clockInTime: '08:55', email: 'jenny@company.com', phone: '010-1234-5678', joinDate: '2019-03-15', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: 'LP125', name: '이채연', engName: 'Sophia Lee', dept: 'Platform Squad', role: 'Product Owner', workStatus: '출근', clockInTime: '09:10', email: 'sophia@company.com', phone: '010-9876-5432', joinDate: '2022-01-10', avatarUrl: 'https://picsum.photos/id/64/200/200' },
  { id: 'DV022', name: '박지성', engName: 'Jisung Park', dept: 'Engineering', role: 'Frontend Dev', workStatus: '휴가', email: 'park@company.com', phone: '010-1111-2222', joinDate: '2021-05-20', avatarUrl: 'https://picsum.photos/id/10/200/200' },
  { id: 'DV023', name: '손흥민', engName: 'Sonny', dept: 'Engineering', role: 'Backend Dev', workStatus: '퇴근', email: 'son@company.com', phone: '010-3333-4444', joinDate: '2021-06-01', avatarUrl: 'https://picsum.photos/id/55/200/200' },
  { id: 'MK005', name: '이강인', engName: 'Kangin Lee', dept: 'Marketing', role: 'Marketer', workStatus: '병가', email: 'lee@company.com', phone: '010-5555-6666', joinDate: '2023-01-01', avatarUrl: 'https://picsum.photos/id/33/200/200' },
];

// Updated Health Records with more intuitive labels
const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  { id: 1, name: '김유연', lastCheck: '2023-10-15', hospital: 'KMI 여의도', result: '정상 (양호)', risk: '낮음', nextCheck: '2024-10-15' },
  { id: 2, name: '이채연', lastCheck: '2023-11-20', hospital: '강북삼성병원', result: '정상 (경미)', risk: '보통', nextCheck: '2024-11-20' },
  { id: 3, name: '박지성', lastCheck: '2023-09-10', hospital: '서울대병원', result: '유소견 (주의)', risk: '높음', nextCheck: '2024-03-10' },
  { id: 4, name: '손흥민', lastCheck: '-', hospital: '-', result: '미수검', risk: '-', nextCheck: '2024-02-28' },
  { id: 5, name: '이강인', lastCheck: '-', hospital: '-', result: '미수검', risk: '-', nextCheck: '2024-03-15' },
];

const INITIAL_VACATION_LOGS: VacationLog[] = [
  { id: 1, name: '박지성', type: '연차', startDate: '2024-01-20', endDate: '2024-01-24', days: 5, status: '승인됨', reason: '해외 여행' },
  { id: 2, name: '이강인', type: '병가', startDate: '2024-01-15', endDate: '2024-01-17', days: 3, status: '승인됨', reason: '독감', symptoms: '고열 및 몸살', hospital: '서울내과' },
  { id: 3, name: '김유연', type: '반차', startDate: '2024-01-10', endDate: '2024-01-10', days: 0.5, status: '사용완료', reason: '개인 사정' },
  { id: 4, name: '이채연', type: '연차', startDate: '2024-02-14', endDate: '2024-02-14', days: 1, status: '대기중', reason: '기념일' },
];

export const HRDashboardView = () => {
  // --- State Management ---
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [vacationLogs, setVacationLogs] = useState<VacationLog[]>(INITIAL_VACATION_LOGS);

  const [activeTab, setActiveTab] = useState<'staff' | 'health' | 'vacation'>('staff');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [filterWorkStatus, setFilterWorkStatus] = useState('All');
  const [filterHealthRisk, setFilterHealthRisk] = useState('All');

  // Selected Profile for Detail View
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  // Modal State
  const [modalType, setModalType] = useState<'none' | 'staff' | 'health' | 'vacation' | 'vacation_approval'>('none');
  const [selectedVacationId, setSelectedVacationId] = useState<number | null>(null);
  
  // Form States
  const [newStaff, setNewStaff] = useState({ 
      name: '', engName: '', dept: '', role: '', employeeId: '',
      email: '', personalEmail: '', phone: '', joinDate: '' 
  });
  const [newHealth, setNewHealth] = useState({ name: '', hospital: '', result: '', risk: '낮음', checkDate: '' });
  
  // Advanced Vacation Form State
  const [newVacation, setNewVacation] = useState({
      name: '',
      type: '연차',
      startDate: '',
      endDate: '',
      days: 1,
      reason: '',
      location: '',
      emergencyContact: '',
      workGoals: '',
      handover: '',
      relationship: '',
      eventType: '',
      symptoms: '',
      hospital: ''
  });

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
      const totalStaff = employees.length;
      const activeStaff = employees.filter(e => e.workStatus === '출근').length;
      const vacationStaff = employees.filter(e => e.workStatus === '휴가').length;
      const sickStaff = employees.filter(e => e.workStatus === '병가').length;
      
      const attendanceRate = Math.round((activeStaff / totalStaff) * 100) || 0;
      const checkedCount = healthRecords.filter(h => h.result !== '미수검').length;
      const totalHealthTargets = healthRecords.length;
      const healthRate = Math.round((checkedCount / totalHealthTargets) * 100) || 0;
      const pendingVacations = vacationLogs.filter(v => v.status === '대기중').length;

      return { totalStaff, activeStaff, vacationStaff, sickStaff, attendanceRate, healthRate, checkedCount, totalHealthTargets, pendingVacations };
  }, [employees, healthRecords, vacationLogs]);

  // --- Helper Functions ---
  const getHealthResultStyle = (result: string) => {
      if (result.includes('양호')) return 'bg-green-50 text-green-700 border-green-200';
      if (result.includes('경미')) return 'bg-blue-50 text-blue-700 border-blue-200';
      if (result.includes('주의') || result.includes('유소견')) return 'bg-orange-50 text-orange-700 border-orange-200';
      if (result.includes('미수검')) return 'bg-gray-50 text-gray-500 border-gray-200';
      if (result.includes('질환') || result.includes('의심')) return 'bg-red-50 text-red-700 border-red-200';
      return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // --- Filtering Logic ---
  const filteredEmployees = employees.filter(e => 
    (filterWorkStatus === 'All' || 
     (filterWorkStatus === '부재중' ? ['휴가', '병가', '퇴근'].includes(e.workStatus) : e.workStatus === filterWorkStatus)) &&
    (e.name.includes(searchQuery) || e.dept.includes(searchQuery))
  );

  const filteredHealth = healthRecords.filter(h => 
    (filterHealthRisk === 'All' || 
     (filterHealthRisk === '미수검' ? h.result === '미수검' : h.risk === filterHealthRisk)) &&
    h.name.includes(searchQuery)
  );

  const filteredVacation = vacationLogs.filter(v => 
    v.name.includes(searchQuery)
  );

  // --- Actions ---

  // 1. Staff Actions
  const handleStaffClick = (emp: Employee) => {
      // Convert Employee to UserProfile format for ProfileView
      const profile: UserProfile = {
          name: emp.name,
          engName: emp.engName,
          nickname: emp.name, // Mock
          email: emp.email,
          personalEmail: emp.personalEmail || '',
          phone: emp.phone,
          employeeId: emp.id,
          joinDate: emp.joinDate,
          tenure: '계산 필요',
          groupJoinDate: emp.joinDate,
          org: emp.dept,
          job: emp.role,
          rank: 'Level ??',
          avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${emp.name}&background=random`
      };
      setSelectedProfile(profile);
  };

  const handleAddStaff = () => {
      if (!newStaff.name) return alert('이름을 입력해주세요.');
      const id = newStaff.employeeId || `EMP${Math.floor(Math.random() * 1000)}`;
      const employee: Employee = {
          id,
          name: newStaff.name,
          engName: newStaff.engName,
          dept: newStaff.dept,
          role: newStaff.role,
          workStatus: '퇴근', // Default status
          email: newStaff.email,
          personalEmail: newStaff.personalEmail,
          phone: newStaff.phone || '010-0000-0000',
          joinDate: newStaff.joinDate || new Date().toISOString().split('T')[0]
      };
      setEmployees([...employees, employee]);
      // Add placeholder health record
      setHealthRecords([...healthRecords, {
          id: Date.now(),
          name: newStaff.name,
          lastCheck: '-',
          hospital: '-',
          result: '미수검',
          risk: '-',
          nextCheck: '2024-12-31'
      }]);
      setModalType('none');
      setNewStaff({ name: '', engName: '', dept: '', role: '', employeeId: '', email: '', personalEmail: '', phone: '', joinDate: '' });
  };

  // 2. Health Actions
  const handleAddHealth = () => {
      if (!newHealth.name) return alert('직원 이름을 입력해주세요.');
      const record: HealthRecord = {
          id: Date.now(),
          name: newHealth.name,
          lastCheck: newHealth.checkDate || new Date().toISOString().split('T')[0],
          hospital: newHealth.hospital,
          result: newHealth.result,
          risk: newHealth.risk as any,
          nextCheck: '2025-01-01'
      };
      setHealthRecords([...healthRecords, record]);
      setModalType('none');
      setNewHealth({ name: '', hospital: '', result: '', risk: '낮음', checkDate: '' });
  };

  // 3. Vacation Actions
  const handleAddVacation = () => {
      if (!newVacation.name) return alert('신청자 이름을 입력해주세요.');
      if (!newVacation.startDate || !newVacation.endDate) return alert('기간을 입력해주세요.');

      // Validation logic same as ProfileView
      if (newVacation.type === '워케이션' && !newVacation.location) return alert('워케이션 장소를 입력해주세요.');
      if (newVacation.type === '경조사' && !newVacation.relationship) return alert('대상을 입력해주세요.');
      if (newVacation.type === '병가' && !newVacation.symptoms) return alert('증상을 입력해주세요.');

      let days = (new Date(newVacation.endDate).getTime() - new Date(newVacation.startDate).getTime()) / (1000 * 3600 * 24) + 1;
      
      // Override days for special types
      if (newVacation.type === '반차') days = 0.5;
      // 월차는 연차와 동일하게 1일 단위 계산 (기간에 따름)
      
      const log: VacationLog = {
          id: Date.now(),
          name: newVacation.name,
          type: newVacation.type,
          startDate: newVacation.startDate,
          endDate: newVacation.endDate,
          days: days > 0 ? days : 0, 
          status: '승인됨', // Admin created -> Auto approve
          reason: newVacation.reason,
          location: newVacation.location,
          symptoms: newVacation.symptoms,
          hospital: newVacation.hospital,
          relationship: newVacation.relationship,
          eventType: newVacation.eventType
      };
      setVacationLogs([log, ...vacationLogs]);
      setModalType('none');
      // Reset
      setNewVacation({
          name: '', type: '연차', startDate: '', endDate: '', days: 1, reason: '',
          location: '', emergencyContact: '', workGoals: '', handover: '',
          relationship: '', eventType: '', symptoms: '', hospital: ''
      });
  };

  const openApprovalModal = (log: VacationLog) => {
      if (log.status !== '대기중') return;
      setSelectedVacationId(log.id);
      setModalType('vacation_approval');
  };

  const handleApproval = (approved: boolean) => {
      if (selectedVacationId) {
          setVacationLogs(logs => logs.map(log => 
              log.id === selectedVacationId 
              ? { ...log, status: approved ? '승인됨' : '반려됨' }
              : log
          ));
      }
      setModalType('none');
      setSelectedVacationId(null);
  };

  // --- Render ---

  // If a profile is selected, render ProfileView instead of Dashboard
  if (selectedProfile) {
      return (
          <ProfileView 
              profile={selectedProfile}
              onUpdateProfile={(updated) => setSelectedProfile(updated)} // Simple local update
              readOnly={false} // Admin can edit
              onBack={() => setSelectedProfile(null)}
          />
      );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white p-8 relative">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HR 통합 대시보드</h1>
            <p className="text-gray-500 text-sm">조직 현황, 직원 건강 및 휴가를 통합 관리합니다.</p>
        </div>

        {/* 1. Dashboard Section (Dynamic Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Metric 1: Staff */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">전체 직원</span>
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Users size={16} /></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">{stats.totalStaff}</span>
                    <span className="text-sm text-green-600 font-medium mb-1.5 flex items-center gap-0.5">
                        <Plus size={12} /> {stats.activeStaff}명 (출근)
                    </span>
                </div>
                <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: '100%' }}></div>
                </div>
                <div className="mt-2 text-[11px] text-gray-400 flex justify-between">
                    <span>출근율 {stats.attendanceRate}%</span>
                    <span>부재 {stats.totalStaff - stats.activeStaff}명</span>
                </div>
            </div>

            {/* Metric 2: Attendance (Renamed to Today's Status) */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">금일 부재 현황</span>
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Clock size={16} /></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">{stats.vacationStaff + stats.sickStaff}</span>
                    <span className="text-sm text-gray-400 mb-1.5">명 (휴가/병가)</span>
                </div>
                <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${((stats.vacationStaff + stats.sickStaff) / stats.totalStaff) * 100}%` }}></div>
                </div>
                 {/* Removed name list as requested */}
            </div>

             {/* Metric 3: Health */}
             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">건강검진 수검률</span>
                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Activity size={16} /></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">{stats.healthRate}%</span>
                    <span className="text-sm text-orange-600 font-medium mb-1.5">마감 임박</span>
                </div>
                <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${stats.healthRate}%` }}></div>
                </div>
                <div className="mt-2 text-[11px] text-gray-400 flex justify-between">
                    <span>완료 {stats.checkedCount}명</span>
                    <span>미수검 {stats.totalHealthTargets - stats.checkedCount}명</span>
                </div>
            </div>

            {/* Metric 4: Vacation Approval */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">결재 대기</span>
                    <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><FileText size={16} /></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">{stats.pendingVacations}</span>
                    <span className="text-sm text-gray-500 mb-1.5">건</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                    휴가 승인 대기 문서가 <span className="font-bold text-black">{stats.pendingVacations}건</span> 있습니다.
                </div>
                 <div className="mt-2">
                    <button 
                        onClick={() => setActiveTab('vacation')}
                        className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                    >
                        바로가기
                    </button>
                </div>
            </div>
        </div>

        {/* 2. Notion-style Tabbed Page */}
        <div>
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                <button 
                    onClick={() => setActiveTab('staff')}
                    className={`pb-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'staff' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Users size={16} /> 직원 관리
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 rounded-full">{stats.totalStaff}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('health')}
                    className={`pb-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'health' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Activity size={16} /> 건강 관리
                    <span className="bg-orange-50 text-orange-600 text-[10px] px-1.5 rounded-full">!</span>
                </button>
                <button 
                    onClick={() => setActiveTab('vacation')}
                    className={`pb-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'vacation' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Plane size={16} /> 휴가 관리
                </button>
            </div>

            {/* Controls Row (Search & Filter) */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600" />
                        <input 
                            type="text" 
                            placeholder={`${activeTab === 'staff' ? '이름, 부서 검색' : '이름 검색'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md w-64 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                        />
                    </div>
                    
                    {/* Filters based on Tab */}
                    {activeTab === 'staff' && (
                        <div className="relative">
                            <select 
                                value={filterWorkStatus} 
                                onChange={(e) => setFilterWorkStatus(e.target.value)}
                                className="pl-3 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none cursor-pointer appearance-none"
                            >
                                <option value="All">전체 상태</option>
                                <option value="출근">출근 중</option>
                                <option value="퇴근">퇴근</option>
                                <option value="부재중">부재중 (휴가/병가)</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    )}

                    {activeTab === 'health' && (
                        <div className="relative">
                            <select 
                                value={filterHealthRisk} 
                                onChange={(e) => setFilterHealthRisk(e.target.value)}
                                className="pl-3 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none cursor-pointer appearance-none"
                            >
                                <option value="All">전체 위험도</option>
                                <option value="높음">고위험군</option>
                                <option value="보통">유소견 (보통)</option>
                                <option value="미수검">미수검</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded transition-colors" title="다운로드">
                        <Download size={16} />
                    </button>
                    <button 
                        onClick={() => setModalType(activeTab)}
                        className="bg-black text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1 shadow-sm"
                    >
                        <Plus size={14} /> 
                        {activeTab === 'staff' ? '직원 등록' : activeTab === 'health' ? '기록 추가' : '휴가 등록'}
                    </button>
                </div>
            </div>

            {/* List Content */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm min-h-[400px]">
                {activeTab === 'staff' && (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 w-10"><input type="checkbox" /></th>
                                <th className="px-6 py-3">이름/부서</th>
                                <th className="px-6 py-3">연락처</th>
                                <th className="px-6 py-3">입사일</th>
                                <th className="px-6 py-3">근태 상태</th>
                                <th className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredEmployees.map(emp => (
                                <tr 
                                    key={emp.id} 
                                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                    onClick={() => handleStaffClick(emp)}
                                >
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                                {emp.avatarUrl ? <img src={emp.avatarUrl} alt="" className="w-full h-full object-cover"/> : emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{emp.name} <span className="text-gray-400 font-normal text-xs">({emp.id})</span></div>
                                                <div className="text-xs text-gray-500">{emp.dept} · {emp.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div>{emp.email}</div>
                                        <div className="text-xs text-gray-400">{emp.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{emp.joinDate}</td>
                                    <td className="px-6 py-4">
                                        {/* Status Badge */}
                                        {emp.workStatus === '출근' && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span className="text-green-700 font-medium text-xs">업무중</span>
                                                <span className="text-gray-400 text-[10px] ml-1">{emp.clockInTime} 출근</span>
                                            </div>
                                        )}
                                        {emp.workStatus === '퇴근' && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                <span className="text-gray-500 text-xs">퇴근</span>
                                            </div>
                                        )}
                                        {(emp.workStatus === '휴가' || emp.workStatus === '병가') && (
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${emp.workStatus === '병가' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                                <span className={`${emp.workStatus === '병가' ? 'text-red-700' : 'text-blue-700'} font-medium text-xs`}>{emp.workStatus}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ChevronLeft size={16} className="text-gray-300 rotate-180 inline-block group-hover:text-gray-600 transition-colors" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'health' && (
                    <table className="w-full text-left">
                         <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">이름</th>
                                <th className="px-6 py-3">최근 검진일</th>
                                <th className="px-6 py-3">검진 기관</th>
                                <th className="px-6 py-3">결과 판정</th>
                                <th className="px-6 py-3">건강 위험도</th>
                                <th className="px-6 py-3">다음 검진 예정</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredHealth.map(rec => (
                                <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{rec.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{rec.lastCheck}</td>
                                    <td className="px-6 py-4 text-gray-600">{rec.hospital}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs border ${getHealthResultStyle(rec.result)}`}>
                                            {rec.result}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {rec.risk === '높음' && <span className="flex items-center gap-1 text-red-600 text-xs font-bold"><AlertCircle size={12}/> 높음</span>}
                                        {rec.risk === '보통' && <span className="text-yellow-600 text-xs">보통</span>}
                                        {rec.risk === '낮음' && <span className="text-green-600 text-xs">낮음</span>}
                                        {rec.risk === '-' && <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{rec.nextCheck}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'vacation' && (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">신청자</th>
                                <th className="px-6 py-3">유형</th>
                                <th className="px-6 py-3">기간</th>
                                <th className="px-6 py-3">사용 일수</th>
                                <th className="px-6 py-3">사유</th>
                                <th className="px-6 py-3">상태</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredVacation.map(vac => (
                                <tr 
                                    key={vac.id} 
                                    className={`transition-colors ${vac.status === '대기중' ? 'hover:bg-orange-50 cursor-pointer' : 'hover:bg-gray-50'}`}
                                    onClick={() => openApprovalModal(vac)}
                                >
                                    <td className="px-6 py-4 font-bold text-gray-900">{vac.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-0.5 rounded border 
                                            ${vac.type === '연차' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-700'}
                                        `}>
                                            {vac.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs">{vac.startDate} ~ {vac.endDate}</td>
                                    <td className="px-6 py-4 font-medium">{vac.days}일</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{vac.reason}</td>
                                    <td className="px-6 py-4">
                                        {vac.status === '승인됨' && <span className="text-green-600 text-xs font-medium flex items-center gap-1"><CheckCircle2 size={12}/> 승인됨</span>}
                                        {vac.status === '대기중' && <span className="text-orange-600 text-xs font-bold flex items-center gap-1 bg-orange-100 px-2 py-1 rounded w-fit">⚡ 결재 필요</span>}
                                        {vac.status === '사용완료' && <span className="text-gray-400 text-xs">사용완료</span>}
                                        {vac.status === '반려됨' && <span className="text-red-500 text-xs flex items-center gap-1"><XCircle size={12}/> 반려됨</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      </div>

      {/* --- Modals --- */}
      {modalType !== 'none' && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setModalType('none')}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">
                          {modalType === 'staff' && '신규 직원 등록'}
                          {modalType === 'health' && '건강검진 기록 추가'}
                          {modalType === 'vacation' && '휴가 등록 (관리자)'}
                          {modalType === 'vacation_approval' && '휴가 결재 처리'}
                      </h3>
                      <button onClick={() => setModalType('none')} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </div>
                  
                  <div className="p-6 space-y-5">
                      {/* Staff Form */}
                      {modalType === 'staff' && (
                          <>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                                <h4 className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1"><Briefcase size={12}/> 인사 정보</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">부서</label>
                                        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.dept} onChange={e => setNewStaff({...newStaff, dept: e.target.value})} placeholder="Engineering" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">직책</label>
                                        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} placeholder="Manager" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">사번</label>
                                        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.employeeId} onChange={e => setNewStaff({...newStaff, employeeId: e.target.value})} placeholder="EMP001" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">입사일</label>
                                        <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.joinDate} onChange={e => setNewStaff({...newStaff, joinDate: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><UserCircle size={12}/> 개인 정보</h4>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">이름 (한글)</label>
                                        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="홍길동" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">이름 (영문)</label>
                                        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.engName} onChange={e => setNewStaff({...newStaff, engName: e.target.value})} placeholder="Gildong Hong" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">사내 이메일</label>
                                        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="email@company.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">개인 연락처</label>
                                        <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-black bg-white" 
                                            value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} placeholder="010-0000-0000" />
                                    </div>
                                </div>
                            </div>
                          </>
                      )}

                      {/* Health Form */}
                      {modalType === 'health' && (
                          <>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">대상 직원 이름</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                    value={newHealth.name} onChange={e => setNewHealth({...newHealth, name: e.target.value})} placeholder="홍길동" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">검진일</label>
                                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                        value={newHealth.checkDate} onChange={e => setNewHealth({...newHealth, checkDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">결과 판정</label>
                                    <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                        value={newHealth.result} onChange={e => setNewHealth({...newHealth, result: e.target.value})} placeholder="정상 (양호)" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">병원명</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                    value={newHealth.hospital} onChange={e => setNewHealth({...newHealth, hospital: e.target.value})} placeholder="KMI 한국의학연구소" />
                            </div>
                          </>
                      )}

                      {/* Vacation Registration Form (Same as Profile View) */}
                      {modalType === 'vacation' && (
                          <>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">신청자 이름</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                    value={newVacation.name} onChange={e => setNewVacation({...newVacation, name: e.target.value})} placeholder="홍길동" />
                            </div>
                             <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1.5">휴가 종류</label>
                                  <div className="grid grid-cols-3 gap-2">
                                      {['연차', '월차', '반차', '경조사', '병가', '워케이션'].map(type => (
                                          <button
                                              key={type}
                                              onClick={() => setNewVacation({
                                                  ...newVacation, 
                                                  type,
                                                  location: type === '워케이션' ? newVacation.location : '',
                                                  emergencyContact: type === '워케이션' ? newVacation.emergencyContact : '',
                                                  workGoals: type === '워케이션' ? newVacation.workGoals : '',
                                                  handover: type === '워케이션' ? newVacation.handover : '',
                                                  relationship: type === '경조사' ? newVacation.relationship : '',
                                                  eventType: type === '경조사' ? newVacation.eventType : '',
                                                  symptoms: type === '병가' ? newVacation.symptoms : '',
                                                  hospital: type === '병가' ? newVacation.hospital : ''
                                              })}
                                              className={`
                                                  py-2 rounded-lg text-xs border transition-all
                                                  ${newVacation.type === type 
                                                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium shadow-sm' 
                                                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                                              `}
                                          >
                                              {type}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                            
                            {/* Conditional Inputs */}
                            {newVacation.type === '워케이션' && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded text-xs space-y-2 animate-[fadeIn_0.2s_ease-out]">
                                    <h4 className="font-bold text-blue-700 mb-1">워케이션 상세 정보</h4>
                                    <input className="w-full p-2 rounded border border-blue-200" placeholder="근무 장소" value={newVacation.location} onChange={e => setNewVacation({...newVacation, location: e.target.value})} />
                                    <input className="w-full p-2 rounded border border-blue-200" placeholder="비상 연락망" value={newVacation.emergencyContact} onChange={e => setNewVacation({...newVacation, emergencyContact: e.target.value})} />
                                    <input className="w-full p-2 rounded border border-blue-200" placeholder="업무 계획 및 목표" value={newVacation.workGoals} onChange={e => setNewVacation({...newVacation, workGoals: e.target.value})} />
                                    <input className="w-full p-2 rounded border border-blue-200" placeholder="업무 인계 사항" value={newVacation.handover} onChange={e => setNewVacation({...newVacation, handover: e.target.value})} />
                                </div>
                            )}
                            {newVacation.type === '경조사' && (
                                <div className="p-3 bg-purple-50 border border-purple-100 rounded text-xs space-y-2 animate-[fadeIn_0.2s_ease-out]">
                                    <h4 className="font-bold text-purple-700 mb-1">경조사 상세 정보</h4>
                                    <input className="w-full p-2 rounded border border-purple-200" placeholder="대상 (관계)" value={newVacation.relationship} onChange={e => setNewVacation({...newVacation, relationship: e.target.value})} />
                                    <input className="w-full p-2 rounded border border-purple-200" placeholder="경조 내용" value={newVacation.eventType} onChange={e => setNewVacation({...newVacation, eventType: e.target.value})} />
                                </div>
                            )}
                             {newVacation.type === '병가' && (
                                <div className="p-3 bg-green-50 border border-green-100 rounded text-xs space-y-2 animate-[fadeIn_0.2s_ease-out]">
                                    <h4 className="font-bold text-green-700 mb-1">병가 상세 정보</h4>
                                    <input className="w-full p-2 rounded border border-green-200" placeholder="증상 및 사유" value={newVacation.symptoms} onChange={e => setNewVacation({...newVacation, symptoms: e.target.value})} />
                                    <input className="w-full p-2 rounded border border-green-200" placeholder="병원명" value={newVacation.hospital} onChange={e => setNewVacation({...newVacation, hospital: e.target.value})} />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">시작일</label>
                                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                        value={newVacation.startDate} onChange={e => setNewVacation({...newVacation, startDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">종료일</label>
                                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                        value={newVacation.endDate} onChange={e => setNewVacation({...newVacation, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">사유</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" 
                                    value={newVacation.reason} onChange={e => setNewVacation({...newVacation, reason: e.target.value})} placeholder="개인 사정" />
                            </div>
                          </>
                      )}

                      {/* Vacation Approval Modal */}
                      {modalType === 'vacation_approval' && selectedVacationId && (
                          <div className="text-center py-4">
                              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                                  <AlertCircle size={24} />
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">휴가 신청 승인</h3>
                              <p className="text-gray-500 text-sm mb-6">
                                  {vacationLogs.find(v => v.id === selectedVacationId)?.name}님의 
                                  <span className="font-bold text-gray-700 mx-1">{vacationLogs.find(v => v.id === selectedVacationId)?.type}</span>
                                  신청을 승인하시겠습니까?
                              </p>
                              
                              {/* Detail View */}
                              <div className="bg-gray-50 p-4 rounded-lg text-left text-sm mb-6 space-y-2 border border-gray-200">
                                  <div className="flex justify-between">
                                      <span className="text-gray-500">기간</span>
                                      <span className="font-medium">
                                          {vacationLogs.find(v => v.id === selectedVacationId)?.startDate} ~ {vacationLogs.find(v => v.id === selectedVacationId)?.endDate}
                                          ({vacationLogs.find(v => v.id === selectedVacationId)?.days}일)
                                      </span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-gray-500">사유</span>
                                      <span className="font-medium">{vacationLogs.find(v => v.id === selectedVacationId)?.reason}</span>
                                  </div>
                              </div>

                              <div className="flex gap-2 justify-center">
                                  <button 
                                      onClick={() => handleApproval(false)}
                                      className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                                  >
                                      반려
                                  </button>
                                  <button 
                                      onClick={() => handleApproval(true)}
                                      className="flex-1 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
                                  >
                                      승인
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>

                  {modalType !== 'vacation_approval' && (
                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                          <button onClick={() => setModalType('none')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                          <button 
                            onClick={
                                modalType === 'staff' ? handleAddStaff : 
                                modalType === 'health' ? handleAddHealth : 
                                handleAddVacation
                            } 
                            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                          >
                              등록하기
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};