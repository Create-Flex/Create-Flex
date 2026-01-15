import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, MoreHorizontal, ChevronDown, Check, Filter, Palette } from 'lucide-react';

// Color Palette Definitions
const EVENT_COLORS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: '파랑' },
  green: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: '초록' },
  red: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: '빨강' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: '노랑' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', label: '보라' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', label: '회색' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: '오렌지' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500', label: '분홍' },
};

interface ScheduleTemplate {
  id: string;
  name: string;
  color: keyof typeof EVENT_COLORS;
}

interface ScheduleEvent {
  id: number;
  templateId: string; // References ScheduleTemplate.id
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
}

// Initial Templates
const INITIAL_TEMPLATES: ScheduleTemplate[] = [
  { id: 'company', name: '회사 일정', color: 'blue' },
  { id: 'personal', name: '개인 일정', color: 'green' },
];

// Mock Data
const INITIAL_EVENTS: ScheduleEvent[] = [
  { id: 1, templateId: 'company', title: '신년 전체 회의', content: '2026년 목표 설정', date: '2026-01-05' },
  { id: 2, templateId: 'personal', title: '건강검진', content: '오전 9시', date: '2026-01-12' },
  { id: 3, templateId: 'company', title: '설날 선물 배포', content: '로비 1층', date: '2026-01-28' },
];

interface ScheduleViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ currentDate, onDateChange }) => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(INITIAL_TEMPLATES);
  const [events, setEvents] = useState<ScheduleEvent[]>(INITIAL_EVENTS);
  
  // Filter State
  const [filter, setFilter] = useState<string>('all'); // 'all' or templateId

  // UI State
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isTemplateCreatorOpen, setIsTemplateCreatorOpen] = useState(false);

  // Template Creator State
  const [newTemplateData, setNewTemplateData] = useState<{name: string, color: keyof typeof EVENT_COLORS}>({
      name: '',
      color: 'gray'
  });

  // Event Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    templateId: string;
    title: string;
    content: string;
    date: string;
  }>({
    templateId: 'company',
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };
  
  const goToToday = () => {
    onDateChange(new Date());
  };

  const openAddModal = (dateStr?: string, templateId?: string) => {
      setNewEvent(prev => ({ 
          ...prev, 
          date: dateStr || prev.date,
          templateId: templateId || prev.templateId 
      }));
      setIsModalOpen(true);
      setIsTemplateMenuOpen(false); 
      setIsOptionsMenuOpen(false);
      setIsTemplateCreatorOpen(false);
  }

  const openTemplateCreator = () => {
      setNewTemplateData({ name: '', color: 'gray' });
      setIsTemplateCreatorOpen(true);
      setIsTemplateMenuOpen(false);
  };

  // Event Handlers
  const handleAddEvent = () => {
    if (!newEvent.title) return alert('일정 제목을 입력해주세요.');
    
    setEvents([
      ...events,
      {
        id: Date.now(),
        ...newEvent
      }
    ]);
    setIsModalOpen(false);
    // Reset but keep date
    setNewEvent(prev => ({
      templateId: templates[0].id,
      title: '',
      content: '',
      date: prev.date
    }));
  };

  const handleDeleteEvent = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('일정을 삭제하시겠습니까?')) {
      setEvents(events.filter(evt => evt.id !== id));
    }
  };

  const handleCreateTemplate = () => {
      if (!newTemplateData.name) return alert('템플릿 이름을 입력해주세요.');
      const newId = Date.now().toString();
      const newTemplate: ScheduleTemplate = {
          id: newId,
          name: newTemplateData.name,
          color: newTemplateData.color
      };
      setTemplates([...templates, newTemplate]);
      setIsTemplateCreatorOpen(false);
      // Optionally open the event modal with this new template immediately
      // openAddModal(undefined, newId);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setIsTemplateCreatorOpen(false);
    }
  };

  // Render Logic
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50/10 border-r border-b border-gray-200"></div>);
  }

  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;
    
    // Filter logic
    const dayEvents = events.filter(e => {
        if (e.date !== dateStr) return false;
        if (filter === 'all') return true;
        return e.templateId === filter;
    });

    days.push(
      <div key={d} className="min-h-[120px] bg-white border-r border-b border-gray-200 p-1 relative group hover:bg-gray-50/50 transition-colors">
        {/* Date Number Header */}
        <div className="flex justify-between items-start mb-1 p-1">
            <span 
                className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-[4px]
                ${isToday ? 'bg-[#EB5757] text-white' : 'text-gray-500'}`}
            >
            {d}
            </span>
            {/* Add Button on Hover */}
            <button 
                onClick={() => openAddModal(dateStr)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity p-0.5"
            >
                <Plus size={14} />
            </button>
        </div>

        {/* Events List */}
        <div className="space-y-1 px-1">
          {dayEvents.map(evt => {
            const template = templates.find(t => t.id === evt.templateId) || templates[0];
            const colors = EVENT_COLORS[template.color];
            return (
                <div 
                key={evt.id} 
                className={`
                    px-2 py-1 rounded-[3px] text-xs flex justify-between items-center group/item cursor-pointer shadow-sm
                    transition-all hover:brightness-95
                    ${colors.bg} ${colors.text}
                `}
                title={evt.content}
                >
                <span className="truncate font-medium">{evt.title}</span>
                <button 
                    onClick={(e) => handleDeleteEvent(e, evt.id)}
                    className="opacity-0 group-hover/item:opacity-100 text-gray-500 hover:text-red-500 ml-1.5"
                >
                    <X size={10} />
                </button>
                </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-hidden bg-white flex flex-col relative" onClick={() => { setIsTemplateMenuOpen(false); setIsOptionsMenuOpen(false); }}>
      {/* Notion-style Header */}
      <div className="px-8 py-4 flex justify-between items-center border-b border-gray-200 shrink-0 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🗓️</span> 나의 일정
          </h1>
          <div className="flex items-center gap-1">
             <button onClick={() => changeMonth(-1)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><ChevronLeft size={18} /></button>
             <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
             </span>
             <button onClick={() => changeMonth(1)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><ChevronRight size={18} /></button>
          </div>
          <button 
            onClick={goToToday}
            className="text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            오늘
          </button>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Filter Status Indicator */}
            {filter !== 'all' && (
                <div className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    <Filter size={12} />
                    <span>{templates.find(t => t.id === filter)?.name || '필터됨'}</span>
                    <button onClick={() => setFilter('all')} className="ml-1 hover:text-gray-900"><X size={12} /></button>
                </div>
            )}

            {/* Options Menu - Changed Icon to Filter */}
            <div className="relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => { setIsOptionsMenuOpen(!isOptionsMenuOpen); setIsTemplateMenuOpen(false); }}
                    className={`text-gray-400 hover:bg-gray-100 p-1.5 rounded transition-colors ${isOptionsMenuOpen ? 'bg-gray-100 text-gray-600' : ''}`}
                    title="보기 옵션"
                >
                    <Filter size={18} />
                </button>
                
                {isOptionsMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">보기 옵션</div>
                        <button 
                            onClick={() => { setFilter('all'); setIsOptionsMenuOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                        >
                            <span>전체 보기</span>
                            {filter === 'all' && <Check size={14} className="text-blue-500" />}
                        </button>
                        <div className="h-px bg-gray-100 my-1"></div>
                        {templates.map(t => (
                            <button 
                                key={t.id}
                                onClick={() => { setFilter(t.id); setIsOptionsMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                            >
                                <span>{t.name}</span>
                                {filter === t.id && <Check size={14} className="text-blue-500" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Split Button for New Event */}
            <div className="relative" onClick={e => e.stopPropagation()}>
                <div className="flex items-center rounded bg-[#2383E2] text-white shadow-sm hover:bg-blue-600 transition-colors">
                    <button 
                        onClick={() => openAddModal()}
                        className="px-3 py-1.5 text-sm font-medium border-r border-blue-400/50 hover:bg-blue-700 rounded-l transition-colors"
                    >
                        새로 만들기
                    </button>
                    <button 
                        onClick={() => { setIsTemplateMenuOpen(!isTemplateMenuOpen); setIsOptionsMenuOpen(false); }}
                        className="px-1.5 py-2 hover:bg-blue-700 rounded-r transition-colors"
                    >
                        <ChevronDown size={14} />
                    </button>
                </div>

                {isTemplateMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">템플릿 선택</div>
                        <div className="max-h-60 overflow-y-auto">
                            {templates.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => openAddModal(undefined, t.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <span className={`w-2 h-2 rounded-full ${EVENT_COLORS[t.color].dot}`}></span>
                                    {t.name}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                            <button 
                                onClick={openTemplateCreator}
                                className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-2 hover:text-gray-900"
                            >
                                <Plus size={14} />
                                새 템플릿 만들기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="flex-1 overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[1600px] mx-auto border-l border-t border-gray-200 bg-white">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                <div key={day} className={`py-2 px-3 text-xs font-medium border-r border-gray-200 ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {day}
                </div>
            ))}
            </div>

            {/* Calendar Grid Body */}
            <div className="grid grid-cols-7 border-b border-gray-200">
             {days}
            </div>
        </div>
      </div>

      {/* Template Creator Modal */}
      {isTemplateCreatorOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
             <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="font-semibold text-sm">새 템플릿 만들기</span>
                <button onClick={() => setIsTemplateCreatorOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
             </div>
             <div className="p-4 space-y-4">
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">템플릿 이름</label>
                   <input 
                      type="text" 
                      placeholder="예: 프로젝트 마감, 운동 등"
                      value={newTemplateData.name}
                      onChange={(e) => setNewTemplateData({...newTemplateData, name: e.target.value})}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
                      autoFocus
                   />
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-2">색상 선택</label>
                   <div className="flex flex-wrap gap-2">
                      {Object.entries(EVENT_COLORS).map(([key, value]) => (
                         <button
                            key={key}
                            type="button"
                            onClick={() => setNewTemplateData({...newTemplateData, color: key as any})}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${value.dot} ${newTemplateData.color === key ? 'border-gray-500 scale-110 shadow-sm' : 'border-transparent'}`}
                            title={value.label}
                         />
                      ))}
                   </div>
                </div>
             </div>
             <div className="px-4 py-3 bg-gray-50 flex justify-end">
                <button 
                   onClick={handleCreateTemplate}
                   className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                   생성하기
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Event Add/Edit Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                 <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">일정 추가</span>
                 {(() => {
                    const t = templates.find(temp => temp.id === newEvent.templateId);
                    if (t) {
                        return <span className={`text-xs px-1.5 py-0.5 rounded ${EVENT_COLORS[t.color].bg} ${EVENT_COLORS[t.color].text}`}>{t.name}</span>
                    }
                    return null;
                 })()}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 p-1">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Title Input */}
              <div>
                <input 
                  type="text"
                  placeholder="제목 없음"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Properties Grid */}
              <div className="space-y-4">
                  {/* Template Property */}
                  <div className="flex items-start">
                      <div className="w-24 flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <span>🏷️</span> 종류
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {templates.map(t => (
                            <button 
                                key={t.id}
                                type="button"
                                onClick={() => setNewEvent({...newEvent, templateId: t.id})}
                                className={`
                                    px-2 py-0.5 text-sm rounded hover:brightness-95 transition-colors border border-transparent
                                    ${newEvent.templateId === t.id 
                                        ? `${EVENT_COLORS[t.color].bg} ${EVENT_COLORS[t.color].text} border-${t.color}-200` 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }
                                `}
                            >
                                {t.name}
                            </button>
                        ))}
                        <button 
                            type="button"
                            onClick={() => { setIsModalOpen(false); setIsTemplateCreatorOpen(true); }}
                            className="px-2 py-0.5 text-sm rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 border border-dashed border-gray-300"
                        >
                            + 추가
                        </button>
                      </div>
                  </div>

                  {/* Date Property */}
                  <div className="flex items-center">
                      <div className="w-24 flex items-center gap-2 text-gray-500 text-sm">
                          <span>📅</span> 날짜
                      </div>
                      <input 
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="text-sm text-gray-700 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none py-0.5"
                      />
                  </div>

                  {/* Content Property */}
                  <div className="flex items-start">
                      <div className="w-24 flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <span>📝</span> 내용
                      </div>
                      <textarea 
                        rows={3}
                        placeholder="설명 추가..."
                        value={newEvent.content}
                        onChange={(e) => setNewEvent({...newEvent, content: e.target.value})}
                        className="flex-1 text-sm text-gray-700 resize-none focus:outline-none placeholder-gray-300 py-1"
                      />
                  </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleAddEvent}
                className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-sm"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};