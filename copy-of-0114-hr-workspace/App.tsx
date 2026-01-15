import React, { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { ProfileView } from './components/ProfileView';
import { ScheduleView } from './components/ScheduleView';
import { OrgChartView } from './components/OrgChartView';
import { CreatorManagerView } from './components/CreatorManagerView';
import { AttendanceView } from './components/AttendanceView';
import { HRDashboardView } from './components/HRDashboardView';
import { TeamView } from './components/TeamView';
import { User, UserProfile, UserRole } from './types';
import { EMPLOYEE_PROFILE_DATA, ADMIN_PROFILE_DATA } from './constants';
import { Creator, INITIAL_CREATORS } from './components/CreatorShared';
import { Bot, X, Maximize2, Minimize2, Send, MessageCircle } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('mypage');
  
  // Lifted state for Profile Data synchronization
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPLOYEE_PROFILE_DATA);
  
  // Lifted state for Calendar synchronization, defaulting to Jan 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

  // Lifted state for Creators synchronization
  const [creators, setCreators] = useState<Creator[]>(INITIAL_CREATORS);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    
    // Switch profile based on role
    if (loggedInUser.role === UserRole.ADMIN) {
        setUserProfile(ADMIN_PROFILE_DATA);
    } else {
        setUserProfile(EMPLOYEE_PROFILE_DATA);
    }

    setCurrentView('mypage'); // Reset to mypage on login
  };

  const handleLogout = () => {
    setUser(null);
    setIsChatOpen(false); // Close chat on logout
  };

  const handleUpdateCreators = (updatedCreators: Creator[]) => {
      setCreators(updatedCreators);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-white relative">
      <Sidebar 
        user={user} 
        userProfile={userProfile}
        onLogout={handleLogout} 
        currentView={currentView}
        onNavigate={setCurrentView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
      
      {currentView === 'mypage' && (
        <ProfileView 
          profile={userProfile}
          onUpdateProfile={setUserProfile}
        />
      )}
      
      {currentView === 'schedule' && (
        <ScheduleView 
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      )}

      {currentView === 'attendance' && (
        <AttendanceView />
      )}

      {currentView === 'hr-dashboard' && (
        <HRDashboardView />
      )}

      {currentView === 'org-chart' && (
        <OrgChartView />
      )}
      
      {currentView === 'team' && (
        <TeamView user={user} />
      )}

      {(currentView === 'creator' || currentView === 'my-creator') && (
        <CreatorManagerView 
            user={user} 
            creators={creators}
            onUpdateCreators={handleUpdateCreators}
        />
      )}

      {/* Placeholder for other views */}
      {currentView !== 'mypage' 
        && currentView !== 'schedule' 
        && currentView !== 'attendance'
        && currentView !== 'hr-dashboard'
        && currentView !== 'org-chart' 
        && currentView !== 'team'
        && currentView !== 'creator'
        && currentView !== 'my-creator' && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          준비 중인 페이지입니다.
        </div>
      )}

      {/* Floating Chat Button / Window */}
      {isChatOpen ? (
        <div 
            className={`
                fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50 transition-all duration-300 ease-in-out
                ${isChatExpanded ? 'w-[360px] h-[calc(100vh-3rem)]' : 'w-80 h-[500px]'}
            `}
        >
            {/* Chat Header */}
            <div className="bg-[#00C471] p-4 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-2 font-bold">
                    <Bot size={20} /> AI Assistant
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsChatExpanded(!isChatExpanded)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title={isChatExpanded ? "축소" : "확대"}
                    >
                        {isChatExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                    <button 
                        onClick={() => setIsChatOpen(false)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="닫기"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Chat Messages Area (Mock) */}
            <div className="flex-1 bg-[#F9F9F9] p-4 overflow-y-auto space-y-4">
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00C471] flex items-center justify-center text-white shrink-0">
                        <Bot size={16} />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 text-sm text-gray-700 shadow-sm max-w-[85%]">
                        안녕하세요! 무엇을 도와드릴까요? HR 규정, 일정 확인, 복리후생 등에 대해 물어보세요.
                    </div>
                </div>
                {/* User Message Mock */}
                {/* <div className="flex gap-2 flex-row-reverse">
                    <div className="bg-blue-600 text-white rounded-lg rounded-tr-none p-3 text-sm shadow-sm max-w-[85%]">
                        연차 신청은 어떻게 하나요?
                    </div>
                </div> */}
            </div>

            {/* Chat Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="메시지를 입력하세요..."
                        className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 transition-all"
                    />
                    <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#00C471] text-white p-1.5 rounded-full hover:bg-[#00b065] transition-colors shadow-sm">
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
      ) : (
        <div className="fixed bottom-8 right-8 z-50 animate-[fadeIn_0.5s_ease-out]">
            <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-[#00C471] text-white p-3.5 rounded-full shadow-lg hover:bg-[#00b065] cursor-pointer transition-all hover:scale-110 active:scale-95 group"
            >
                <Bot size={28} className="group-hover:rotate-12 transition-transform" />
            </button>
        </div>
      )}
    </div>
  );
}

export default App;