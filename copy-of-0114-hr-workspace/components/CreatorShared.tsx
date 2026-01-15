import React from 'react';
import { 
  Youtube, Twitch, Instagram, Smartphone, Monitor, ChevronLeft, ChevronRight, Plus 
} from 'lucide-react';

// --- Types ---
export type PlatformType = 'YouTube' | 'Instagram' | 'TikTok' | 'Twitch' | 'Chzzk';

export interface Creator {
  id: string;
  name: string;
  platform: PlatformType;
  status: '활동중' | '휴식중' | '계약만료' | '대기중' | '종료';
  subscribers: string;
  avatarUrl: string;
  coverUrl: string;
  tags: string[];
  category?: string;
  manager?: string;
  managementStartDate?: string; // 담당 시작일
  managementEndDate?: string;   // 담당 종료일
  channelName?: string;
  contactInfo?: string;
  contractStatus: 'Signed' | 'Drafting' | 'Expired' | 'None';
}

export interface Task {
  id: string;
  title: string;
  status: '진행중' | '완료됨' | '대기중';
  assignee: string;
  creatorId?: string;
}

export interface CreatorEvent {
    id: string;
    creatorId: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'live' | 'content' | 'meeting' | 'other' | 'joint';
    content?: string;
    partnerCreators?: string[]; // List of Creator IDs for joint broadcasts
}

export interface AdProposal {
  id: string;
  creatorId: string;
  brandName: string;
  campaignTitle: string;
  budget: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
  description: string;
}

export interface HealthRecord {
    id: string;
    name: string;
    lastCheck: string;
    score: number; // 0-100
    result: string;
    status: string;
}

export interface IssueLog {
    id: number;
    creator: string;
    date: string;
    category: string;
    description: string;
    status: string;
}

// --- Mock Data ---
export const INITIAL_CREATORS: Creator[] = [
  {
    id: '1',
    name: '슈카월드',
    platform: 'YouTube',
    status: '활동중',
    subscribers: '300.0만명',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k2A0y_2y0aFhVj7V9VjB0jVjVjVjVjVjVjVjVj=s176-c-k-c0x00ffffff-no-rj',
    coverUrl: 'https://picsum.photos/id/1/1200/300',
    tags: ['경제', '토크', '지식'],
    category: '경제/시사',
    manager: '김유연',
    managementStartDate: '2023-01-01',
    managementEndDate: '2025-12-31',
    channelName: '슈카월드',
    contactInfo: '010-1234-5678',
    contractStatus: 'Signed'
  },
  {
    id: '2',
    name: '침착맨',
    platform: 'Twitch',
    status: '활동중',
    subscribers: '250.0만명',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    coverUrl: 'https://picsum.photos/id/64/1200/300',
    tags: ['토크', '게임'],
    category: '토크/게임',
    manager: '이팀장',
    managementStartDate: '2023-03-15',
    managementEndDate: '2024-03-14',
    channelName: '침착맨',
    contactInfo: '010-9876-5432',
    contractStatus: 'Signed'
  },
  {
    id: '3',
    name: '요리보고',
    platform: 'YouTube',
    status: '대기중',
    subscribers: '85.0만명',
    avatarUrl: 'https://picsum.photos/id/2/200/200',
    coverUrl: 'https://picsum.photos/id/2/1200/300',
    tags: ['요리', '레시피', '일상'],
    category: '요리',
    manager: '김유연',
    managementStartDate: '2024-01-01',
    managementEndDate: '2024-12-31',
    channelName: 'CookWithMe',
    contactInfo: 'cooking@email.com',
    contractStatus: 'Drafting'
  },
  {
    id: '4',
    name: '여행가제이',
    platform: 'Instagram',
    status: '활동중',
    subscribers: '45.0만명',
    avatarUrl: 'https://picsum.photos/id/3/200/200',
    coverUrl: 'https://picsum.photos/id/3/1200/300',
    tags: ['여행', '브이로그'],
    category: '여행',
    manager: '김유연',
    managementStartDate: '2023-06-01',
    managementEndDate: '2025-05-31',
    channelName: 'JayTrip',
    contactInfo: '010-5555-4444',
    contractStatus: 'Signed'
  },
  {
    id: '5',
    name: '겜돌이',
    platform: 'Twitch',
    status: '종료',
    subscribers: '12.0만명',
    avatarUrl: 'https://picsum.photos/id/4/200/200',
    coverUrl: 'https://picsum.photos/id/4/1200/300',
    tags: ['게임'],
    category: '게임',
    manager: '담당자 없음',
    channelName: 'GameZone',
    contactInfo: 'game@email.com',
    contractStatus: 'Expired'
  },
  {
    id: '6',
    name: '치즈냥이',
    platform: 'Chzzk',
    status: '활동중',
    subscribers: '5.5만명',
    avatarUrl: 'https://picsum.photos/id/40/200/200',
    coverUrl: 'https://picsum.photos/id/40/1200/300',
    tags: ['게임', '소통'],
    category: '게임',
    manager: '김유연',
    managementStartDate: '2024-01-15',
    managementEndDate: '2024-07-15',
    channelName: 'CheeseCat',
    contactInfo: 'cat@email.com',
    contractStatus: 'None'
  },
  // 더미 크리에이터 추가
  {
    id: '7',
    name: '철수',
    platform: 'YouTube',
    status: '활동중',
    subscribers: '50.0만명',
    avatarUrl: 'https://picsum.photos/id/100/200/200',
    coverUrl: 'https://picsum.photos/id/100/1200/300',
    tags: ['일상', '브이로그'],
    category: '일상',
    manager: '김유연',
    managementStartDate: '2024-01-01',
    managementEndDate: '2024-12-31',
    channelName: 'CheolsuVlog',
    contactInfo: 'cheolsu@email.com',
    contractStatus: 'Signed'
  }
];

export const INITIAL_TASKS: Record<string, Task[]> = {
  '1': [
    { id: 't1', title: '다음 주 콘텐츠 기획안 피드백', status: '진행중', assignee: '김유연' },
    { id: 't2', title: '유튜브 채널 아트 리뉴얼 시안 확인', status: '진행중', assignee: '김유연' },
    { id: 't3', title: '6월 정산서 발송', status: '진행중', assignee: '김유연' },
    { id: 't4', title: '구독자 이벤트 당첨자 취합', status: '완료됨', assignee: '박지성' },
    { id: 't5', title: '신규 굿즈 샘플 확인', status: '완료됨', assignee: '김유연' },
  ],
  '2': [
    { id: 't6', title: '밀키트 콜라보 미팅', status: '대기중', assignee: '최현석' },
  ]
};

export const INITIAL_EVENTS: CreatorEvent[] = [
    { id: 'e1', creatorId: '1', title: '라이브 방송', date: '2026-01-10', type: 'live', content: '저녁 8시 정규 라이브 방송입니다. 주제: 경제 뉴스 정리' },
    { id: 'e2', creatorId: '1', title: '유튜브 업로드', date: '2026-01-12', type: 'content', content: '편집본 업로드 예정. 썸네일 컨펌 필요.' },
    { id: 'e3', creatorId: '3', title: '광고 미팅', date: '2026-01-15', type: 'meeting', content: '주방용품 브랜드 A사 미팅 (강남역 2시)' },
    { id: 'e4', creatorId: '4', title: '출국 (일본)', date: '2026-01-20', type: 'other', content: '3박 4일 도쿄 브이로그 촬영 일정' },
    { id: 'e5', creatorId: '6', title: '정기 방송', date: '2026-01-05', type: 'live', content: '치지직 이적 후 첫 정기 방송' },
    { id: 'e6', creatorId: '1', title: '브랜드 미팅', date: '2026-01-22', type: 'meeting', content: '금융 앱 B사 연간 계약 논의' },
];

export const INITIAL_AD_PROPOSALS: AdProposal[] = [
    {
        id: 'ad-dummy-1',
        creatorId: '7', // 철수
        brandName: '테크월드',
        campaignTitle: '게이밍 마우스 G-100 리뷰',
        budget: '300만원',
        status: 'pending',
        requestDate: '2024-01-25',
        description: '신제품 게이밍 마우스 상세 리뷰 및 게임 플레이 시연 영상 1편.'
    },
    {
        id: 'ad-1',
        creatorId: '1', // 슈카월드
        brandName: '삼성전자',
        campaignTitle: '갤럭시 S24 울트라 기능 리뷰 및 시연',
        budget: '2,500만원',
        status: 'pending',
        requestDate: '2024-01-20',
        description: '신제품 출시 기념 메인 기능(AI) 집중 리뷰 영상 제작 요청드립니다. 엠바고 준수 필수.'
    },
    {
        id: 'ad-2',
        creatorId: '1',
        brandName: '미래에셋증권',
        campaignTitle: '2024년 하반기 경제 전망 세미나',
        budget: '1,000만원',
        status: 'accepted',
        requestDate: '2024-01-15',
        description: '오프라인 세미나 연사 초청 및 유튜브 라이브 송출 건입니다.'
    },
    {
        id: 'ad-3',
        creatorId: '2', // 침착맨
        brandName: '넥슨',
        campaignTitle: '신작 게임 찍먹 플레이',
        budget: '1,500만원',
        status: 'pending',
        requestDate: '2024-01-21',
        description: '캐주얼하게 게임을 즐기는 모습을 담은 라이브 방송 2시간 진행 요청.'
    },
    {
        id: 'ad-4',
        creatorId: '4', // 여행가제이
        brandName: '대한항공',
        campaignTitle: '취항지 홍보 브이로그 (유럽)',
        budget: '800만원 + 항공권',
        status: 'rejected',
        requestDate: '2024-01-10',
        description: '신규 취항지 홍보를 위한 여행 브이로그 2편 제작.'
    }
];

// --- Helper Functions ---
export const renderPlatformIcon = (platform: PlatformType, size: number = 16) => {
    switch (platform) {
        case 'YouTube': return <Youtube size={size} className="text-black" />;
        case 'Twitch': return <Twitch size={size} className="text-black" />;
        case 'Instagram': return <Instagram size={size} className="text-black" />;
        case 'TikTok': return <Smartphone size={size} className="text-black" />;
        case 'Chzzk': return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 11.5L15.5 2.5L13.5 10.5H21.5L11.5 21.5L13.5 11.5H5.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        );
        default: return <Monitor size={size} className="text-gray-500" />;
    }
};

export const PALETTE = [
    { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-200', dot: 'bg-gray-600' },
    { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-[#00C471]' },
    { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', dot: 'bg-blue-600' },
    { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-200', dot: 'bg-purple-600' },
];

export const getCreatorColorStyles = (id: string) => {
    const idx = parseInt(id) || 0;
    return PALETTE[idx % PALETTE.length];
};

// --- Shared Components ---
interface CalendarProps {
    events: CreatorEvent[];
    creatorsMap: Record<string, Creator>;
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onAddEvent: (date?: string) => void;
    onEventClick: (event: CreatorEvent) => void; 
}

export const CreatorCalendar: React.FC<CalendarProps> = ({ events, creatorsMap, currentDate, onDateChange, onAddEvent, onEventClick }) => {
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };
    
    const goToToday = () => {
        onDateChange(new Date());
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-white border-r border-b border-gray-200"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = new Date().toISOString().split('T')[0] === dateStr;
        const dayEvents = events.filter(e => e.date === dateStr);

        days.push(
            <div key={d} className="min-h-[120px] bg-white border-r border-b border-gray-200 p-1 relative group hover:bg-gray-50 transition-colors">
                 {/* Date Header */}
                <div className="flex justify-between items-start mb-1 p-1">
                     <span 
                        className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-[4px]
                        ${isToday ? 'bg-[#00C471] text-white' : 'text-gray-500'}`}
                     >
                        {d}
                     </span>
                     <button 
                         onClick={() => onAddEvent(dateStr)}
                         className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black transition-opacity p-0.5"
                     >
                         <Plus size={14} />
                     </button>
                </div>
                
                {/* Events */}
                <div className="space-y-1 px-1">
                    {dayEvents.map(evt => {
                        const creator = creatorsMap[evt.creatorId];
                        const styles = creator ? getCreatorColorStyles(creator.id) : PALETTE[0];
                        
                        return (
                            <div 
                                key={evt.id} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick(evt);
                                }}
                                className={`
                                    px-2 py-1 rounded-[3px] text-xs flex justify-between items-center group/item cursor-pointer shadow-sm
                                    transition-all hover:brightness-95 border
                                    ${styles.bg} ${styles.text} ${styles.border}
                                `}
                            >
                                <div className="truncate font-medium flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`}></div>
                                    <span className="truncate">{creator?.name} - {evt.title}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button onClick={() => changeMonth(-1)} className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"><ChevronLeft size={18} /></button>
                        <span className="text-lg font-bold text-gray-800 min-w-[120px] text-center">
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"><ChevronRight size={18} /></button>
                    </div>
                    <button 
                        onClick={goToToday}
                        className="text-xs text-gray-500 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                    >
                        오늘
                    </button>
                </div>
                
                {/* Creator Legend */}
                <div className="flex gap-3 text-xs overflow-x-auto max-w-[500px] py-1 scrollbar-hide">
                     {Object.values(creatorsMap).map((c: Creator) => {
                         const style = getCreatorColorStyles(c.id);
                         return (
                             <div key={c.id} className="flex items-center gap-1 text-gray-600 shrink-0">
                                 <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                                 {c.name}
                             </div>
                         )
                     })}
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <div key={day} className={`py-2 text-center text-xs font-medium ${i === 0 ? 'text-[#00C471]' : 'text-gray-500'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7">
                {days}
            </div>
        </div>
    );
};