import React, { useState } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle2, MoreHorizontal, ChevronLeft, ChevronRight, BarChart3, Plane, Briefcase } from 'lucide-react';

export const AttendanceView = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [activeTab, setActiveTab] = useState<'work' | 'vacation'>('work');

  // Stats Data
  const stats = {
    totalHours: 148.5,
    targetHours: 160,
    lateCount: 1,
    leaveUsed: 2.5,
    leaveTotal: 15,
    overtime: 12.5
  };

  const weeklyData = [
      { day: '월', hours: 9, type: 'normal' },
      { day: '화', hours: 9.5, type: 'normal' },
      { day: '수', hours: 9, type: 'normal' },
      { day: '목', hours: 10, type: 'overtime' },
      { day: '금', hours: 9, type: 'normal' },
  ];

  const logs = [
    { date: '2024. 01. 19 (금)', in: '08:55', out: '18:10', hours: '9h 15m', status: 'normal', type: 'office' },
    { date: '2024. 01. 18 (목)', in: '09:02', out: '18:05', hours: '9h 03m', status: 'late', type: 'office' },
    { date: '2024. 01. 17 (수)', in: '08:50', out: '17:55', hours: '9h 05m', status: 'normal', type: 'wfh' },
    { date: '2024. 01. 16 (화)', in: '08:45', out: '18:20', hours: '9h 35m', status: 'normal', type: 'office' },
    { date: '2024. 01. 15 (월)', in: '-', out: '-', hours: '-', status: 'vacation', note: '연차', type: 'vacation' },
    { date: '2024. 01. 12 (금)', in: '08:58', out: '18:02', hours: '9h 04m', status: 'normal', type: 'office' },
    { date: '2024. 01. 11 (목)', in: '08:55', out: '19:00', hours: '10h 05m', status: 'overtime', type: 'office' },
  ];

  const vacationLogs = [
      { date: '2024. 01. 15', type: '연차', amount: 1.0, reason: '개인 사정', status: '승인됨' },
      { date: '2023. 12. 22', type: '반차', amount: 0.5, reason: '병원 방문', status: '승인됨' },
      { date: '2023. 12. 01', type: '연차', amount: 1.0, reason: '리프레시', status: '승인됨' },
  ];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const getStatusBadge = (status: string, note?: string) => {
    switch(status) {
        case 'normal': 
            return <span className="text-[#00C471] text-xs font-bold">정상 근무</span>;
        case 'late':
            return <span className="text-orange-600 text-xs font-bold">지각</span>;
        case 'vacation':
            return <span className="text-blue-600 text-xs font-bold">{note || '휴가'}</span>;
        case 'overtime':
            return <span className="text-purple-600 text-xs font-bold">초과 근무</span>;
        default:
            return <span className="text-gray-400 text-xs font-medium">-</span>;
    }
  };

  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'wfh': return <span className="text-xs text-gray-500 flex items-center gap-1"><Briefcase size={12}/> 재택</span>;
          case 'office': return <span className="text-xs text-gray-500 flex items-center gap-1"><Briefcase size={12}/> 출근</span>;
          case 'vacation': return <span className="text-xs text-blue-500 flex items-center gap-1"><Plane size={12}/> 휴가</span>;
          default: return null;
      }
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white p-8 animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="text-gray-800" size={32} /> 나의 근태
            </h1>
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-500"><ChevronLeft size={18} /></button>
                <span className="text-sm font-bold text-gray-800 px-4">
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </span>
                <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-500"><ChevronRight size={18} /></button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Monthly Progress */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">이번 달 근무 시간</span>
                    <Clock size={16} className="text-blue-500" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{Math.floor(stats.totalHours)}h {Math.round((stats.totalHours % 1) * 60)}m</span>
                    <span className="text-sm text-gray-500">/ {stats.targetHours}h</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-blue-500 w-[92%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                   <span>진행률 92%</span>
                   <span>잔여 {stats.targetHours - stats.totalHours}h</span>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">이번 주 근무 현황</span>
                    <BarChart3 size={16} className="text-purple-500" />
                </div>
                <div className="flex items-end justify-between h-20 gap-2 mt-2">
                    {weeklyData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                            <div className="w-full bg-gray-100 rounded-t-sm relative h-full flex items-end overflow-hidden group">
                                <div 
                                    className={`w-full transition-all duration-500 ${d.type === 'overtime' ? 'bg-purple-500' : 'bg-blue-500'}`} 
                                    style={{ height: `${(d.hours / 12) * 100}%` }}
                                ></div>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {d.hours}h
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vacation Stats */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">잔여 연차</span>
                    <Plane size={16} className="text-green-500" />
                </div>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">{stats.leaveTotal - stats.leaveUsed}</span>
                    <span className="text-sm text-gray-500 mb-1.5">일</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">사용 연차</span>
                        <span className="font-medium text-gray-900">{stats.leaveUsed}일</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">총 연차</span>
                        <span className="font-medium text-gray-900">{stats.leaveTotal}일</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${(stats.leaveUsed / stats.leaveTotal) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 flex gap-6">
            <button 
                onClick={() => setActiveTab('work')}
                className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'work' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Clock size={16} /> 일별 근무 기록
            </button>
            <button 
                onClick={() => setActiveTab('vacation')}
                className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'vacation' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Plane size={16} /> 휴가 사용 내역
            </button>
        </div>

        {/* List Content */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {activeTab === 'work' ? (
                <>
                     <div className="px-6 py-3 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">총 {logs.length}건의 기록</div>
                        <button className="text-gray-400 hover:text-gray-600">
                           <MoreHorizontal size={16} />
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-xs w-1/4">날짜</th>
                                <th className="px-6 py-3 font-medium text-xs">근무 유형</th>
                                <th className="px-6 py-3 font-medium text-xs">출근</th>
                                <th className="px-6 py-3 font-medium text-xs">퇴근</th>
                                <th className="px-6 py-3 font-medium text-xs">총 근무</th>
                                <th className="px-6 py-3 font-medium text-xs text-right">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((log, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.date}</td>
                                    <td className="px-6 py-4">{getTypeIcon(log.type)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.in}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.out}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-bold">{log.hours}</td>
                                    <td className="px-6 py-4 text-right">
                                        {getStatusBadge(log.status, log.note)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <div className="px-6 py-3 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">총 {vacationLogs.length}건의 사용 내역</div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-xs">신청일 / 사용일</th>
                                <th className="px-6 py-3 font-medium text-xs">유형</th>
                                <th className="px-6 py-3 font-medium text-xs">사용 일수</th>
                                <th className="px-6 py-3 font-medium text-xs">사유</th>
                                <th className="px-6 py-3 font-medium text-xs text-right">승인 상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vacationLogs.map((log, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-0.5 rounded border ${log.type === '반차' ? 'bg-purple-50 border-purple-100 text-purple-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-bold">{log.amount}일</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{log.reason}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-green-600 text-xs font-medium flex items-center justify-end gap-1">
                                            <CheckCircle2 size={12}/> {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
      </div>
    </div>
  );
};