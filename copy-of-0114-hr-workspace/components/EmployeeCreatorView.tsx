import React, { useState, useEffect } from 'react';
import { 
  User, CalendarIcon, Users, Plus, User as UserIcon, X, Search, CheckCircle2, ChevronDown, Hash, FileText, ImageIcon, Monitor, Smartphone, ChevronLeft, CheckSquare, Megaphone, DollarSign, Ban, AlertCircle, Link as LinkIcon, Trash2
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { 
    Creator, Task, CreatorEvent, AdProposal, INITIAL_TASKS, INITIAL_EVENTS, INITIAL_AD_PROPOSALS,
    renderPlatformIcon, CreatorCalendar 
} from './CreatorShared';

// --- Sub-component: Creator Detail View ---
const CreatorDetailView = ({ 
    creator, 
    tasks, 
    events, 
    onBack, 
    onAddEvent,
    onEventClick,
    onAddTask,
    onDisconnect
}: { 
    creator: Creator, 
    tasks: Task[], 
    events: CreatorEvent[], 
    onBack: () => void,
    onAddEvent: (date: string) => void,
    onEventClick: (event: CreatorEvent) => void,
    onAddTask: (title: string) => void,
    onDisconnect: () => void
}) => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    
    // Create a mini map for the single creator
    const singleMap = { [creator.id]: creator };

    const handleTaskSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            onAddTask(newTaskTitle.trim());
            setNewTaskTitle('');
        }
    };

    return (
        <div className="bg-white relative animate-[fadeIn_0.2s_ease-out]">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-gray-600">목록으로 돌아가기</span>
                </div>
                
                <button 
                    onClick={() => {
                        if(window.confirm(`${creator.name} 크리에이터와의 담당 연결을 취소하시겠습니까?`)) {
                            onDisconnect();
                        }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                >
                    <Trash2 size={14} /> 담당 연결 취소
                </button>
            </div>

            {/* Cover Image */}
            <div className="h-48 w-full bg-gray-100 relative group flex items-center justify-center rounded-xl overflow-hidden mb-12">
                {creator.coverUrl ? (
                    <img src={creator.coverUrl} alt="cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                        <ImageIcon size={32} />
                        <span className="text-xs mt-2">커버 이미지 없음</span>
                    </div>
                )}
                <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-xs px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">커버 변경</button>
                
                 {/* Avatar */}
                <div className="absolute -bottom-10 left-8">
                     <div className="w-24 h-24 rounded-lg border-4 border-white shadow-sm overflow-hidden bg-white">
                        {creator.avatarUrl ? (
                            <img src={creator.avatarUrl} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <UserIcon size={40} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

             {/* Header Info */}
             <div className="pl-36 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{creator.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Monitor size={14}/> {creator.platform}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1"><Users size={14}/> {creator.subscribers}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className={`text-xs font-bold ${creator.status === '활동중' ? 'text-[#00C471]' : 'text-gray-500'}`}>
                        {creator.status}
                    </span>
                    {creator.contactInfo && (
                        <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-gray-500 flex items-center gap-1"><Smartphone size={12}/> {creator.contactInfo}</span>
                        </>
                    )}
                </div>
                {creator.managementStartDate && creator.managementEndDate && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                        <LinkIcon size={12} className="text-[#00C471]" /> 
                        <span className="font-medium text-gray-700">담당 기간:</span> 
                        {creator.managementStartDate} ~ {creator.managementEndDate}
                    </div>
                )}
             </div>

             <div className="h-px bg-gray-200 w-full mb-8"></div>

             {/* Tasks Section */}
             <div className="animate-[fadeIn_0.2s_ease-out]">
                {/* ... Task rendering code (same as before) ... */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <CheckSquare size={20} className="text-gray-700"/>
                        업무 현황
                        <span className="text-sm font-normal text-gray-500 ml-1">({tasks.length})</span>
                    </h3>
                    <div className="flex gap-4 text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#00C471]"></div>
                            진행중 <span className="font-bold text-gray-900 ml-1">{tasks.filter(t => t.status === '진행중').length}</span>
                        </span>
                        <span className="text-gray-600 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            완료됨 <span className="font-bold text-gray-900 ml-1">{tasks.filter(t => t.status === '완료됨').length}</span>
                        </span>
                    </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                   <div className="flex items-center bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-500">
                      <div className="flex-1">이름</div>
                      <div className="w-24">상태</div>
                      <div className="w-24">담당자</div>
                   </div>
                   <div className="divide-y divide-gray-100">
                      {tasks.map(task => (
                         <div key={task.id} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer text-sm">
                            <div className="flex-1 text-gray-800 flex items-center gap-2">
                               <button className="text-gray-300 hover:text-gray-500"><CheckSquare size={16} /></button>
                               {task.title}
                            </div>
                            <div className="w-24">
                               <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                                   task.status === '진행중' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                   task.status === '완료됨' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                   'bg-blue-50 text-blue-700 border-blue-200'
                               }`}>
                                  {task.status}
                               </span>
                            </div>
                            <div className="w-24 flex items-center gap-1.5">
                               <div className="w-4 h-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-[9px] font-bold">
                                  {task.assignee.charAt(0)}
                               </div>
                               <span className="text-gray-600 text-xs">{task.assignee}</span>
                            </div>
                         </div>
                      ))}
                      
                      {/* Notion Style Add Task Row */}
                      {!isAddingTask ? (
                           <div 
                                onClick={() => setIsAddingTask(true)}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-gray-400 text-sm group"
                           >
                              <Plus size={14} className="mr-2 group-hover:text-gray-600" /> 
                              <span className="group-hover:text-gray-600">새로 만들기...</span>
                           </div>
                      ) : (
                           <div className="flex items-center px-4 py-3 bg-gray-50/50">
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="text-gray-400"><CheckSquare size={16} /></div>
                                    <input 
                                        autoFocus
                                        className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="업무 내용을 입력하고 Enter를 누르세요"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={handleTaskSubmit}
                                        onBlur={() => {
                                            if (!newTaskTitle.trim()) setIsAddingTask(false);
                                        }}
                                    />
                                </div>
                           </div>
                      )}
                   </div>
                </div>
             </div>
        </div>
    );
}

// --- Main Employee Component ---
interface EmployeeCreatorViewProps {
    user: UserType;
    creators: Creator[];
    onUpdateCreators: (creators: Creator[]) => void;
}

export const EmployeeCreatorView = ({ user, creators, onUpdateCreators }: EmployeeCreatorViewProps) => {
  const [events, setEvents] = useState<CreatorEvent[]>(INITIAL_EVENTS);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'calendar' | 'list' | 'ads'>('calendar'); 
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [adProposals, setAdProposals] = useState<AdProposal[]>(INITIAL_AD_PROPOSALS);
  const [adFilter, setAdFilter] = useState<'all' | 'pending' | 'history'>('pending');

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
      const flatList: Task[] = [];
      Object.entries(INITIAL_TASKS).forEach(([cId, tasks]) => {
          tasks.forEach(t => flatList.push({ ...t, creatorId: cId }));
      });
      return flatList;
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false); // Ad Campaign Modal
  
  const [selectedEvent, setSelectedEvent] = useState<CreatorEvent | null>(null);
  const [selectedCreatorToAssign, setSelectedCreatorToAssign] = useState<string>('');
  const [managementPeriod, setManagementPeriod] = useState<{start: string, end: string}>({
      start: new Date().toISOString().split('T')[0],
      end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Partner Search Query for Joint Broadcast
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  const [newEventData, setNewEventData] = useState<{
      creatorId: string;
      title: string;
      date: string;
      type: 'live' | 'content' | 'meeting' | 'other' | 'joint';
      content: string;
      partnerCreators: string[];
  }>({
      creatorId: '',
      title: '',
      date: '',
      type: 'content',
      content: '',
      partnerCreators: []
  });

  // New Ad Campaign Data
  const [newAdData, setNewAdData] = useState<{
      brandName: string;
      campaignTitle: string;
      budget: string;
      creatorId: string;
      description: string;
  }>({
      brandName: '',
      campaignTitle: '',
      budget: '',
      creatorId: '',
      description: ''
  });

  const selectedCreator = creators.find(c => c.id === selectedCreatorId);
  const creatorEvents = selectedCreatorId ? events.filter(e => e.creatorId === selectedCreatorId) : [];

  const myCreators = creators.filter(c => c.manager === user.name || user.role === UserRole.ADMIN);
  const myCreatorsMap = myCreators.reduce((acc, c) => ({...acc, [c.id]: c}), {} as Record<string, Creator>);
  const allMyEvents = events.filter(e => myCreatorsMap[e.creatorId]);

  const availableCreators = creators.filter(c => c.manager !== user.name);
  const filteredAvailableCreators = availableCreators.filter(c => c.name.includes(searchQuery));

  // Filter for potential joint partners (all creators except current one)
  const potentialPartners = creators.filter(c => c.id !== newEventData.creatorId && c.name.includes(partnerSearchQuery));

  const handleBack = () => setSelectedCreatorId(null);
  const handleEventClick = (event: CreatorEvent) => setSelectedEvent(event);

  const handleAddTask = (title: string) => {
      if (!selectedCreatorId) return;
      const newTask: Task = {
          id: Date.now().toString(),
          title,
          status: '진행중',
          assignee: user.name,
          creatorId: selectedCreatorId
      };
      setAllTasks([...allTasks, newTask]);
  };

  const handleAddCreator = () => {
    if (!selectedCreatorToAssign) {
        alert('등록할 크리에이터를 선택해주세요.');
        return;
    }
    if (!managementPeriod.start || !managementPeriod.end) {
        alert('담당 기간을 모두 입력해주세요.');
        return;
    }

    const updatedCreators = creators.map(c => 
        c.id === selectedCreatorToAssign 
        ? { 
            ...c, 
            manager: user.name,
            managementStartDate: managementPeriod.start,
            managementEndDate: managementPeriod.end
          } 
        : c
    );
    onUpdateCreators(updatedCreators);
    
    setIsAddModalOpen(false);
    setSelectedCreatorToAssign('');
    setSearchQuery('');
    showToastMessage('담당 크리에이터가 등록되었습니다.');
  };

  const handleDisconnectCreator = (targetCreatorId: string) => {
      const updatedCreators = creators.map(c => 
          c.id === targetCreatorId 
          ? { 
              ...c, 
              manager: '담당자 없음',
              managementStartDate: undefined,
              managementEndDate: undefined
            } 
          : c
      );
      onUpdateCreators(updatedCreators);
      setSelectedCreatorId(null); // Go back to list
      showToastMessage('담당 연결이 취소되었습니다.', 'error');
  };

  const handleOpenEventModal = (date?: string) => {
      if (myCreators.length === 0) return;
      setNewEventData({
          creatorId: selectedCreatorId || (myCreators[0] ? myCreators[0].id : ''),
          title: '',
          date: date || new Date().toISOString().split('T')[0],
          type: 'content',
          content: '',
          partnerCreators: []
      });
      setPartnerSearchQuery('');
      setIsEventModalOpen(true);
  };

  const handleSaveEvent = () => {
      if (!newEventData.title || !newEventData.creatorId) {
          alert('제목과 크리에이터를 모두 입력해주세요.');
          return;
      }
      
      if (newEventData.type === 'joint' && newEventData.partnerCreators.length === 0) {
          alert('합방할 크리에이터를 최소 1명 이상 선택해주세요.');
          return;
      }

      const newEvent: CreatorEvent = {
          id: Date.now().toString(),
          creatorId: newEventData.creatorId,
          title: newEventData.title,
          date: newEventData.date,
          type: newEventData.type,
          content: newEventData.content,
          partnerCreators: newEventData.type === 'joint' ? newEventData.partnerCreators : []
      };
      setEvents([...events, newEvent]);
      setIsEventModalOpen(false);
  };

  const togglePartner = (partnerId: string) => {
      setNewEventData(prev => {
          const exists = prev.partnerCreators.includes(partnerId);
          return {
              ...prev,
              partnerCreators: exists 
                  ? prev.partnerCreators.filter(id => id !== partnerId)
                  : [...prev.partnerCreators, partnerId]
          };
      });
  };

  // --- Ad Management Logic ---
  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ show: true, message, type });
      setTimeout(() => {
          setToast(prev => ({ ...prev, show: false }));
      }, 3000);
  };

  const handleAdDecision = (id: string, decision: 'accepted' | 'rejected') => {
      setAdProposals(prev => prev.map(p => p.id === id ? { ...p, status: decision } : p));
      
      if (decision === 'accepted') {
          showToastMessage('제안이 수락되었습니다. 처리 내역 탭으로 이동되었습니다.');
      } else {
          showToastMessage('제안이 거절되었습니다. 처리 내역 탭으로 이동되었습니다.', 'error');
      }
  };

  const handleAddAd = () => {
      if (!newAdData.brandName || !newAdData.campaignTitle || !newAdData.budget || !newAdData.creatorId) {
          alert('필수 정보를 모두 입력해주세요.');
          return;
      }

      const newAd: AdProposal = {
          id: Date.now().toString(),
          creatorId: newAdData.creatorId,
          brandName: newAdData.brandName,
          campaignTitle: newAdData.campaignTitle,
          budget: newAdData.budget,
          status: 'pending',
          requestDate: new Date().toISOString().split('T')[0],
          description: newAdData.description || '내용 없음'
      };

      setAdProposals([newAd, ...adProposals]);
      setIsAdModalOpen(false);
      setNewAdData({ brandName: '', campaignTitle: '', budget: '', creatorId: '', description: '' });
      showToastMessage('새로운 캠페인이 등록되었습니다.');
  };

  // Filter ads for my creators
  const myCreatorIds = myCreators.map(c => c.id);
  const myAdProposals = adProposals.filter(ad => myCreatorIds.includes(ad.creatorId));
  const filteredAds = myAdProposals.filter(ad => {
      if (adFilter === 'all') return true;
      if (adFilter === 'pending') return ad.status === 'pending';
      if (adFilter === 'history') return ad.status !== 'pending';
      return true;
  });

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col bg-white relative">
        {/* Header & Main Tabs */}
        <div className="px-8 pt-8 pb-0 shrink-0 border-b border-gray-100">
             <div className="max-w-[1600px] mx-auto">
                 <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <User className="text-gray-800" size={32} /> 나의 크리에이터
                 </h1>
                 <div className="flex items-center gap-6">
                    <button 
                        onClick={() => { setActiveMainTab('calendar'); setSelectedCreatorId(null); }}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative ${activeMainTab === 'calendar' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <CalendarIcon size={16} /> 일정 캘린더
                        {activeMainTab === 'calendar' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveMainTab('list')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative ${activeMainTab === 'list' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Users size={16} /> 내 담당 크리에이터
                        {activeMainTab === 'list' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveMainTab('ads')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 transition-all relative ${activeMainTab === 'ads' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Megaphone size={16} /> 광고 캠페인 관리
                        {activeMainTab === 'ads' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                    </button>
                 </div>
             </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
            <div className="max-w-[1600px] mx-auto min-h-full">
                {activeMainTab === 'calendar' && (
                    <div className="animate-[fadeIn_0.2s_ease-out] relative">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">전체 일정</h2>
                                <p className="text-sm text-gray-500">담당하는 모든 크리에이터의 일정을 한눈에 확인하세요.</p>
                            </div>
                            <button 
                                onClick={() => handleOpenEventModal()} 
                                className={`flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors ${myCreators.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={myCreators.length === 0}
                            >
                                <Plus size={16} /> 일정 추가
                            </button>
                        </div>
                        
                        <div className="relative">
                            <div className={myCreators.length === 0 ? "blur-sm pointer-events-none select-none opacity-50 transition-all duration-500" : ""}>
                                <CreatorCalendar 
                                    events={allMyEvents} 
                                    creatorsMap={myCreatorsMap}
                                    currentDate={currentDate}
                                    onDateChange={setCurrentDate}
                                    onAddEvent={handleOpenEventModal}
                                    onEventClick={handleEventClick}
                                />
                            </div>
                            
                            {myCreators.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <div className="bg-white/90 backdrop-blur p-8 rounded-2xl border border-gray-200 shadow-xl text-center max-w-sm">
                                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <User size={28} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">담당 중인 크리에이터가 없습니다</h3>
                                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                            아직 담당 크리에이터가 배정되지 않았거나<br/>
                                            등록된 크리에이터가 없습니다.<br/>
                                            먼저 크리에이터를 등록해주세요.
                                        </p>
                                        <button 
                                            onClick={() => setIsAddModalOpen(true)} 
                                            className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
                                        >
                                            새 크리에이터 등록하기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeMainTab === 'list' && (
                     <>
                        {selectedCreator ? (
                            <CreatorDetailView 
                                creator={selectedCreator}
                                tasks={allTasks.filter(t => t.creatorId === selectedCreator.id)}
                                events={creatorEvents}
                                onBack={handleBack}
                                onAddEvent={handleOpenEventModal}
                                onEventClick={handleEventClick}
                                onAddTask={handleAddTask}
                                onDisconnect={() => handleDisconnectCreator(selectedCreator.id)}
                            />
                        ) : (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                     {myCreators.map(creator => (
                                       <div 
                                         key={creator.id}
                                         onClick={() => setSelectedCreatorId(creator.id)}
                                         className="group border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white relative"
                                       >
                                         <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                                            {creator.coverUrl ? (
                                                <img src={creator.coverUrl} alt="cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-300">
                                                   <ImageIcon size={32} />
                                                </div>
                                            )}
                                            <div className="absolute top-0 left-0 w-full h-full bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                         </div>
                                         <div className="p-5 relative">
                                            <div className="w-16 h-16 rounded-lg border-4 border-white shadow-sm overflow-hidden absolute -top-10 left-5 bg-white">
                                               {creator.avatarUrl ? (
                                                   <img src={creator.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                               ) : (
                                                   <div className="w-full h-full bg-gray-5 flex items-center justify-center text-gray-400">
                                                       <User size={32} />
                                                   </div>
                                               )}
                                            </div>
                                            <div className="mt-6">
                                               <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                                  {creator.name}
                                                  {renderPlatformIcon(creator.platform, 16)}
                                               </h3>
                                               <p className="text-sm text-gray-500 mb-3">{creator.subscribers}</p>
                                               <div className="flex gap-2">
                                                  <span className={`text-[10px] font-bold ${creator.status === '활동중' ? 'text-[#00C471]' : 'text-gray-500'}`}>
                                                     {creator.status}
                                                  </span>
                                               </div>
                                            </div>
                                         </div>
                                       </div>
                                     ))}
                                     
                                     {/* Add New Card */}
                                     <div 
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-400 hover:text-gray-600"
                                     >
                                        <Plus size={32} className="mb-2" />
                                        <span className="text-sm font-medium">새 크리에이터 추가</span>
                                     </div>
                                </div>
                            </div>
                        )}
                     </>
                )}

                {/* Ads Tab Content ... (No changes needed here) */}
                {activeMainTab === 'ads' && (
                    <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">광고 캠페인 제안</h2>
                                <p className="text-sm text-gray-500">담당 크리에이터에게 들어온 광고 제안을 검토하고 연결해주세요.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setAdFilter('pending')} 
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'pending' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        대기중인 제안 ({myAdProposals.filter(a => a.status === 'pending').length})
                                    </button>
                                    <button 
                                        onClick={() => setAdFilter('history')} 
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'history' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        처리 내역
                                    </button>
                                    <button 
                                        onClick={() => setAdFilter('all')} 
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${adFilter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        전체 보기
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setIsAdModalOpen(true)}
                                    className="ml-2 flex items-center gap-1 bg-[#00C471] hover:bg-[#00b065] text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors"
                                >
                                    <Plus size={14} /> 캠페인 등록
                                </button>
                            </div>
                        </div>

                        {filteredAds.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAds.map(ad => {
                                    const creator = creators.find(c => c.id === ad.creatorId);
                                    return (
                                        <div key={ad.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="text-xs font-bold text-gray-500">{ad.brandName}</div>
                                                <div className="text-[10px] text-gray-400">{ad.requestDate}</div>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">{ad.campaignTitle}</h3>
                                            
                                            <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {creator?.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-full h-full object-cover"/> : <UserIcon className="p-1 text-gray-400"/>}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-xs font-bold text-gray-800 truncate">{creator?.name || '알 수 없음'}</div>
                                                    <div className="text-[10px] text-gray-500 truncate">구독자 {creator?.subscribers}</div>
                                                </div>
                                            </div>

                                            <div className="mb-4 flex-1">
                                                <div className="text-xs text-gray-500 mb-1">제안 금액</div>
                                                <div className="text-xl font-bold text-[#00C471] flex items-center gap-1">
                                                    <DollarSign size={18} /> {ad.budget}
                                                </div>
                                                <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3">
                                                    {ad.description}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 mt-auto">
                                                {ad.status === 'pending' ? (
                                                    <div className="space-y-3">
                                                        <div className="text-center">
                                                            <span className="text-sm font-bold text-orange-600">제안 검토중</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => handleAdDecision(ad.id, 'rejected')}
                                                                className="flex-1 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                                                            >
                                                                <Ban size={14} /> 거절
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAdDecision(ad.id, 'accepted')}
                                                                className="flex-1 py-2 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                                                            >
                                                                <CheckCircle2 size={14} /> 수락
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`text-center py-2 text-xs font-bold rounded-lg ${
                                                        ad.status === 'accepted' 
                                                            ? 'text-green-600' 
                                                            : 'text-red-600'
                                                    }`}>
                                                        {ad.status === 'accepted' ? '수락됨' : '거절됨'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                                <Megaphone size={48} className="mb-4 opacity-50" />
                                <div className="text-lg font-medium text-gray-500">해당하는 광고 제안이 없습니다.</div>
                                <p className="text-sm mt-1">새로운 제안이 들어오면 이곳에 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Ad Campaign Registration Modal ... (No changes needed) */}
        {isAdModalOpen && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAdModalOpen(false)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">광고 캠페인 등록</h3>
                        <button onClick={() => setIsAdModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">광고주 (브랜드명)</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                placeholder="예: 삼성전자"
                                value={newAdData.brandName}
                                onChange={e => setNewAdData({...newAdData, brandName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">제품 / 캠페인명</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                placeholder="예: 신제품 런칭 리뷰"
                                value={newAdData.campaignTitle}
                                onChange={e => setNewAdData({...newAdData, campaignTitle: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">제안 단가</label>
                            <div className="relative">
                                <input 
                                    className="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    placeholder="예: 300만원"
                                    value={newAdData.budget}
                                    onChange={e => setNewAdData({...newAdData, budget: e.target.value})}
                                />
                                <DollarSign size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">담당 크리에이터</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-white cursor-pointer"
                                value={newAdData.creatorId}
                                onChange={e => setNewAdData({...newAdData, creatorId: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                {myCreators.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">상세 내용 (선택)</label>
                            <textarea 
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                                placeholder="캠페인 주요 내용 및 요청사항"
                                value={newAdData.description}
                                onChange={e => setNewAdData({...newAdData, description: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                        <button onClick={() => setIsAdModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                        <button onClick={handleAddAd} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">등록하기</button>
                    </div>
                </div>
            </div>
        )}

        {/* View Event Detail Modal ... (No changes needed) */}
        {selectedEvent && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900">일정 상세 정보</h3>
                        <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">제목</div>
                            <div className="text-lg font-bold text-gray-900">{selectedEvent.title}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1">날짜</div>
                                <div className="text-sm text-gray-800">{selectedEvent.date}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1">유형</div>
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200">
                                    {selectedEvent.type === 'live' && '라이브'}
                                    {selectedEvent.type === 'content' && '업로드'}
                                    {selectedEvent.type === 'meeting' && '미팅'}
                                    {selectedEvent.type === 'other' && '기타'}
                                    {selectedEvent.type === 'joint' && '합방'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">크리에이터</div>
                            <div className="text-sm text-gray-800 font-medium">
                                {creators.find(c => c.id === selectedEvent.creatorId)?.name || '알 수 없음'}
                            </div>
                        </div>
                        
                        {/* Partner Creators List */}
                        {selectedEvent.type === 'joint' && selectedEvent.partnerCreators && selectedEvent.partnerCreators.length > 0 && (
                            <div>
                                <div className="text-xs text-gray-500 font-bold mb-1">함께하는 크리에이터</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEvent.partnerCreators.map(partnerId => {
                                        const partner = creators.find(c => c.id === partnerId);
                                        return partner ? (
                                            <div key={partnerId} className="flex items-center gap-1.5 bg-gray-50 pl-1.5 pr-2.5 py-1 rounded-full border border-gray-200">
                                                <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                                                    {partner.avatarUrl && <img src={partner.avatarUrl} alt="" className="w-full h-full object-cover"/>}
                                                </div>
                                                <span className="text-xs text-gray-700">{partner.name}</span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedEvent.content && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 font-bold mb-1">상세 내용</div>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEvent.content}</div>
                            </div>
                        )}
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                        <button onClick={() => setSelectedEvent(null)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 shadow-sm">닫기</button>
                    </div>
                </div>
            </div>
        )}

        {/* EMPLOYEE ADD MODAL */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">담당 크리에이터 배정</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                    </div>
                    
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="크리에이터 이름 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-2 border-b border-gray-100">
                        {filteredAvailableCreators.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {filteredAvailableCreators.map(creator => {
                                    const isSelected = selectedCreatorToAssign === creator.id;
                                    const hasManager = creator.manager && creator.manager !== '담당자 없음';
                                    
                                    return (
                                        <div 
                                            key={creator.id}
                                            onClick={() => setSelectedCreatorToAssign(creator.id)}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all
                                                ${isSelected 
                                                    ? 'bg-[#E5F9F0] border-[#00C471] ring-1 ring-[#00C471]' 
                                                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                                {creator.avatarUrl ? (
                                                    <img src={creator.avatarUrl} alt="" className="w-full h-full object-cover"/>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={18}/></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-bold text-sm text-gray-900 truncate">{creator.name}</span>
                                                    {renderPlatformIcon(creator.platform, 12)}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{creator.category}</span>
                                                    <span className="w-0.5 h-2 bg-gray-300"></span>
                                                    <span>구독자 {creator.subscribers}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {hasManager ? (
                                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                        현 담당: {creator.manager}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-[#00C471] bg-[#E5F9F0] px-1.5 py-0.5 rounded border border-[#C2F0E0] font-medium">
                                                        배정 가능
                                                    </span>
                                                )}
                                            </div>
                                            {isSelected && <div className="text-[#00C471]"><CheckCircle2 size={18} fill="currentColor" className="text-white"/></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400 text-sm">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-50/50">
                        <h4 className="text-xs font-bold text-gray-500 mb-3">담당 기간 설정</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">시작일</label>
                                <input 
                                    type="date" 
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black bg-white"
                                    value={managementPeriod.start}
                                    onChange={(e) => setManagementPeriod({...managementPeriod, start: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">종료일</label>
                                <input 
                                    type="date" 
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black bg-white"
                                    value={managementPeriod.end}
                                    onChange={(e) => setManagementPeriod({...managementPeriod, end: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-2">
                        <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                        <button 
                            onClick={handleAddCreator} 
                            disabled={!selectedCreatorToAssign}
                            className={`px-4 py-2 text-sm text-white rounded-lg transition-colors font-medium ${!selectedCreatorToAssign ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                        >
                            등록하기
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* ... (Event Modal & Toast same as before) ... */}
        {/* Add Event Modal */}
        {isEventModalOpen && (
            <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]" onClick={() => setIsEventModalOpen(false)}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-bold">일정 추가</span>
                            <span className="text-xs">크리에이터 일정</span>
                        </div>
                        <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 p-1">
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <input 
                                type="text"
                                placeholder="일정 제목"
                                value={newEventData.title}
                                onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                                className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
                                autoFocus
                            />
                        </div>

                        {/* Properties */}
                        <div className="space-y-4">
                            {/* Creator Selection */}
                            <div className="flex items-center">
                                <div className="w-24 flex items-center gap-2 text-gray-500 text-sm">
                                    <UserIcon size={14}/> 담당자
                                </div>
                                <div className="flex-1 relative">
                                    <select
                                        value={newEventData.creatorId}
                                        onChange={(e) => {
                                            setNewEventData({
                                                ...newEventData, 
                                                creatorId: e.target.value,
                                                partnerCreators: [] // Reset partners when main creator changes
                                            });
                                        }}
                                        className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded px-2 py-1.5 hover:border-gray-300 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                                    >
                                        {myCreators.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center">
                                <div className="w-24 flex items-center gap-2 text-gray-500 text-sm">
                                    <CalendarIcon size={14}/> 날짜
                                </div>
                                <input 
                                    type="date"
                                    value={newEventData.date}
                                    onChange={(e) => setNewEventData({...newEventData, date: e.target.value})}
                                    className="text-sm text-gray-700 border border-gray-200 rounded px-2 py-1.5 hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Type */}
                             <div className="flex items-start">
                                <div className="w-24 flex items-center gap-2 text-gray-500 text-sm mt-1">
                                    <Hash size={14}/> 유형
                                </div>
                                <div className="flex-1 flex flex-wrap gap-2">
                                    {['content', 'live', 'meeting', 'joint', 'other'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setNewEventData({...newEventData, type: type as any})}
                                            className={`
                                                px-2 py-1 rounded text-xs border transition-colors
                                                ${newEventData.type === type 
                                                    ? 'bg-black text-white border-black' 
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}
                                            `}
                                        >
                                            {type === 'content' && '업로드'}
                                            {type === 'live' && '라이브'}
                                            {type === 'meeting' && '미팅'}
                                            {type === 'joint' && '합방'}
                                            {type === 'other' && '기타'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Joint Broadcast Partner Selection - Only visible when type is 'joint' */}
                            {newEventData.type === 'joint' && (
                                <div className="animate-[fadeIn_0.2s_ease-out] bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                                        <Users size={12} /> 함께할 크리에이터 선택
                                    </div>
                                    
                                    {/* Partner Search Input */}
                                    <div className="relative mb-2">
                                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text"
                                            placeholder="크리에이터 검색..."
                                            value={partnerSearchQuery}
                                            onChange={(e) => setPartnerSearchQuery(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:border-black"
                                        />
                                    </div>

                                    {/* Partner List */}
                                    <div className="max-h-[150px] overflow-y-auto space-y-1 pr-1">
                                        {potentialPartners.length > 0 ? (
                                            potentialPartners.map(partner => {
                                                const isSelected = newEventData.partnerCreators.includes(partner.id);
                                                return (
                                                    <div 
                                                        key={partner.id}
                                                        onClick={() => togglePartner(partner.id)}
                                                        className={`
                                                            flex items-center gap-2 p-2 rounded cursor-pointer border transition-all
                                                            ${isSelected 
                                                                ? 'bg-[#E5F9F0] border-[#00C471] ring-1 ring-[#00C471]' 
                                                                : 'bg-white border-gray-100 hover:border-gray-300'
                                                            }
                                                        `}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                                            {partner.avatarUrl ? <img src={partner.avatarUrl} alt="" className="w-full h-full object-cover"/> : null}
                                                        </div>
                                                        <span className="text-sm text-gray-800 flex-1 truncate">{partner.name}</span>
                                                        {isSelected && <CheckCircle2 size={14} className="text-[#00C471] flex-shrink-0"/>}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-4 text-xs text-gray-400">검색 결과가 없습니다.</div>
                                        )}
                                    </div>
                                    <div className="mt-2 text-[10px] text-gray-400 text-right">
                                        선택됨: {newEventData.partnerCreators.length}명
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex items-start">
                                <div className="w-24 flex items-center gap-2 text-gray-500 text-sm mt-1">
                                    <FileText size={14}/> 내용
                                </div>
                                <textarea 
                                    rows={3}
                                    placeholder="상세 내용을 입력하세요..."
                                    value={newEventData.content}
                                    onChange={(e) => setNewEventData({...newEventData, content: e.target.value})}
                                    className="flex-1 text-sm text-gray-700 border border-gray-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:border-blue-500 hover:border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                        <button 
                            onClick={handleSaveEvent}
                            className="px-4 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors shadow-sm font-medium"
                        >
                            일정 등록 완료
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-[fadeIn_0.2s_ease-out]">
                {toast.type === 'success' ? (
                    <CheckCircle2 size={20} className="text-[#00C471]" />
                ) : (
                    <AlertCircle size={20} className="text-red-400" />
                )}
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
        )}
    </div>
  );
};