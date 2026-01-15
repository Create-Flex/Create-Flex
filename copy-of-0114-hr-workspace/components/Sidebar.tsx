import React, { useState } from 'react';
import { User, UserRole, UserProfile } from '../types';
import { 
  Settings, PanelLeftClose, PanelLeftOpen, LayoutGrid, Calendar, 
  Clock, Users, UserCircle, Briefcase, 
  Plane, Network, Star, LogOut
} from 'lucide-react';

interface SidebarProps {
  user: User;
  userProfile: UserProfile;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

interface CalendarWidgetProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ currentDate, onDateChange }) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  // Empty slots
  for (let i = 0; i < firstDay; i++) {
     days.push(<span key={`empty-${i}`}></span>);
  }
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
     const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
     days.push(
        <span 
          key={d} 
          className={`
            ${isToday ? 'bg-[#EB5757] text-white' : 'text-gray-500 hover:bg-gray-100'}
            rounded-[4px] w-6 h-6 flex items-center justify-center mx-auto text-[11px] transition-colors
          `}
        >
            {d}
        </span>
     );
  }

  return (
    <div className="cursor-pointer">
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-xs font-semibold text-gray-700">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </span>
        <div className="flex gap-2">
           <span onClick={handlePrevMonth} className="text-xs text-gray-400 cursor-pointer hover:text-black p-1">&lt;</span>
           <span onClick={handleNextMonth} className="text-xs text-gray-400 cursor-pointer hover:text-black p-1">&gt;</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] text-gray-400 mb-2">
        <span className="text-red-400">일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {days}
      </div>
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({ user, userProfile, onLogout, currentView, onNavigate, currentDate, onDateChange }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItemClass = (viewName: string) => {
    return `flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors ${
      currentView === viewName 
        ? 'bg-gray-200 text-gray-900' 
        : 'text-gray-600 hover:bg-gray-100'
    } ${isCollapsed ? 'justify-center' : ''}`;
  };

  const handleSettings = () => {
    alert("설정 페이지는 준비 중입니다.");
  };

  return (
    <div className={`${isCollapsed ? 'w-[80px]' : 'w-[280px]'} h-screen bg-[#F7F7F5] border-r border-gray-200 flex flex-col p-4 sidebar-scroll overflow-y-auto shrink-0 transition-all duration-300 ease-in-out`}>
      {/* Top Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4 mb-8' : 'justify-between mb-6'} px-1`}>
        {!isCollapsed && (
            <div className="flex items-center gap-3 text-gray-400">
               <div className="cursor-pointer hover:text-gray-600" onClick={onLogout} title="로그아웃">
                   <LogOut size={16} />
               </div>
               <div className="cursor-pointer hover:text-gray-600" onClick={handleSettings} title="설정">
                   <Settings size={16} />
               </div>
            </div>
        )}
        <div className="text-gray-400">
            {isCollapsed ? (
                <div className="cursor-pointer hover:text-gray-600" onClick={() => setIsCollapsed(false)} title="사이드바 펼치기">
                    <PanelLeftOpen size={16} />
                </div>
            ) : (
                <div className="cursor-pointer hover:text-gray-600" onClick={() => setIsCollapsed(true)} title="사이드바 접기">
                    <PanelLeftClose size={16} />
                </div>
            )}
        </div>
        {isCollapsed && (
             <div className="flex flex-col gap-4 text-gray-400">
                <div className="cursor-pointer hover:text-gray-600" onClick={handleSettings} title="설정">
                    <Settings size={16} />
                </div>
                <div className="cursor-pointer hover:text-gray-600" onClick={onLogout} title="로그아웃">
                    <LogOut size={16} />
                </div>
             </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="mb-6">
        {!isCollapsed ? (
            <>
                <h2 className="text-xs font-bold text-gray-800 mb-3">내 정보 (Profile)</h2>
                {/* Profile Clickable Area */}
                <div 
                    onClick={() => onNavigate('mypage')}
                    className="flex items-center gap-3 mb-4 cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-200 transition-colors group"
                >
                  <img src={userProfile.avatarUrl} alt="profile" className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:border-gray-300" />
                  <div>
                    <div className="font-bold text-sm text-gray-800 group-hover:text-black">{userProfile.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{userProfile.job}</div>
                    <div className="flex gap-1">
                      {user.tags.map((tag, i) => (
                        <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${tag === '재직중' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <button 
                    onClick={() => setIsClockedIn(!isClockedIn)}
                    className={`flex-1 py-1.5 border rounded text-xs font-medium shadow-sm transition-colors ${
                        isClockedIn 
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                        : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {isClockedIn ? '퇴근하기' : '출근하기'}
                  </button>
                  <button onClick={onLogout} className="flex-1 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                    로그아웃
                  </button>
                </div>

                {/* Remaining Time Stats (Replaced Leave Stats) */}
                <div className="mb-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-gray-700">퇴근까지 남은 시간</span>
                    <span className="text-[10px] text-gray-400">18:00 기준</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                     <span className="text-2xl font-bold text-blue-600">03:24</span>
                     <span className="text-xs text-gray-400"></span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                     <div className="h-full bg-blue-500 w-[62%]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                     <span>출근: 08:55</span>
                     <span>62% 지남</span>
                  </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center gap-2 mb-4">
                <div 
                    onClick={() => onNavigate('mypage')}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <img src={userProfile.avatarUrl} alt="profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" title={userProfile.name} />
                </div>
                <div 
                    onClick={() => setIsClockedIn(!isClockedIn)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${isClockedIn ? 'bg-green-500' : 'bg-gray-300'}`}
                    title={isClockedIn ? '근무 중 (클릭하여 퇴근)' : '근무 전 (클릭하여 출근)'}
                ></div>
            </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1">
        
        {isAdmin ? (
          /* ============ ADMIN LAYOUT ============ */
          <>
            {/* 1. Personal Section */}
            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-4 px-2">개인 업무</div>}
            {isCollapsed && <div className="h-4"></div>}
            
            <nav className="space-y-0.5">
              <div 
                onClick={() => onNavigate('mypage')}
                className={getMenuItemClass('mypage')}
                title="마이페이지"
              >
                <LayoutGrid size={16} />
                {!isCollapsed && <span className="text-sm">마이페이지</span>}
              </div>
              <div 
                onClick={() => onNavigate('schedule')}
                className={getMenuItemClass('schedule')}
                title="나의 일정"
              >
                <Calendar size={16} />
                {!isCollapsed && <span className="text-sm">나의 일정</span>}
              </div>
              <div 
                onClick={() => onNavigate('attendance')}
                className={getMenuItemClass('attendance')}
                title="나의 근태"
              >
                <Clock size={16} />
                {!isCollapsed && <span className="text-sm">나의 근태</span>}
              </div>
            </nav>

            {/* 2. HR Management Section (Consolidated) */}
            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-6 px-2">인사/운영</div>}
            {isCollapsed && <div className="h-4"></div>}

            <nav className="space-y-0.5">
               <div 
                  onClick={() => onNavigate('hr-dashboard')}
                  className={getMenuItemClass('hr-dashboard')}
                  title="HR 통합 대시보드"
               >
                  <Briefcase size={16} />
                  {!isCollapsed && <span className="text-sm">HR 통합 대시보드</span>}
               </div>
               
               <div 
                  onClick={() => onNavigate('org-chart')}
                  className={getMenuItemClass('org-chart')}
                  title="회사 조직도"
               >
                  <Network size={16} />
                  {!isCollapsed && <span className="text-sm">회사 조직도</span>}
               </div>
               <div 
                  onClick={() => onNavigate('creator')}
                  className={getMenuItemClass('creator')}
                  title="크리에이터 관리"
               >
                  <UserCircle size={16} />
                  {!isCollapsed && <span className="text-sm">크리에이터 관리</span>}
               </div>
            </nav>
            
            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-6 px-2">즐겨찾기</div>}
            {isCollapsed && <div className="h-4"></div>}
            <nav className="space-y-0.5">
               <div className={`flex items-center gap-2 py-1.5 px-2 text-yellow-600 hover:bg-gray-200 rounded cursor-pointer ${isCollapsed ? 'justify-center' : ''}`} title="특정인원 프로필">
                  <Star size={16} className="fill-current"/>
                  {!isCollapsed && <span className="text-sm">특정인원 프로필</span>}
               </div>
            </nav>
          </>
        ) : (
          /* ============ EMPLOYEE LAYOUT ============ */
          <>
            {!isCollapsed && <div className="text-[11px] font-bold text-gray-500 mb-2 mt-4 px-2">업무 관리</div>}
            {isCollapsed && <div className="h-4"></div>}
            
            <nav className="space-y-0.5">
              <div 
                onClick={() => onNavigate('mypage')}
                className={getMenuItemClass('mypage')}
                title="마이페이지"
              >
                 <LayoutGrid size={16} />
                 {!isCollapsed && <span className="text-sm">마이페이지</span>}
              </div>
              <div 
                onClick={() => onNavigate('schedule')}
                className={getMenuItemClass('schedule')}
                title="나의 일정"
              >
                <Calendar size={16} />
                {!isCollapsed && <span className="text-sm">나의 일정</span>}
              </div>
              <div 
                onClick={() => onNavigate('attendance')}
                className={getMenuItemClass('attendance')}
                title="나의 근태"
              >
                <Clock size={16} />
                {!isCollapsed && <span className="text-sm">나의 근태</span>}
              </div>
              
              {/* Employee specific items - Divider Removed */}
              
              <div 
                onClick={() => onNavigate('team')}
                className={getMenuItemClass('team')}
                title="팀 현황"
              >
                <Users size={16} />
                {!isCollapsed && <span className="text-sm">팀 현황</span>}
              </div>
              <div 
                onClick={() => onNavigate('my-creator')}
                className={getMenuItemClass('my-creator')}
                title="나의 크리에이터"
              >
                <UserCircle size={16} />
                {!isCollapsed && <span className="text-sm">나의 크리에이터</span>}
              </div>
            </nav>
          </>
        )}

        {/* Calendar Widget (Common) */}
        {!isCollapsed && (
            <div 
              className="mt-6 pb-8" 
              onClick={() => onNavigate('schedule')}
            >
               <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                  <CalendarWidget currentDate={currentDate} onDateChange={onDateChange} />
               </div>
            </div>
        )}
      </div>
    </div>
  );
};