import React, { useState } from 'react';
import { 
  Users, Search, Plus, MoreHorizontal, Link as LinkIcon, 
  FileText, ExternalLink, Download, Activity, Stethoscope, 
  ClipboardList, X, User
} from 'lucide-react';
import { User as UserType } from '../types';
import { 
    Creator, PlatformType, renderPlatformIcon, 
    HealthRecord, IssueLog 
} from './CreatorShared';

// --- Sub-components for Admin View ---

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Signed':
      return <span className="text-xs font-bold text-[#00C471]">체결완료</span>;
    case 'Drafting':
      return <span className="text-xs font-bold text-gray-500">검토중</span>;
    case 'Expired':
      return <span className="text-xs font-bold text-red-500">만료됨</span>;
    default:
      return <span className="text-xs font-bold text-gray-400">미계약</span>;
  }
};

const SummaryItem = ({ label, count, color }: { label: string, count: number, color?: string }) => (
  <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className={`text-2xl font-bold tracking-tight ${color || 'text-gray-900'}`}>{count}</span>
  </div>
);

const ContractsView = ({ creators }: { creators: Creator[] }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-[fadeIn_0.2s_ease-out]">
      {/* Left Column: Contract List */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <div>
              <h3 className="font-bold text-gray-900 text-lg">계약 문서 현황</h3>
              <p className="text-sm text-gray-500">전속 계약 및 광고 계약 문서를 통합 관리합니다.</p>
          </div>
          <button className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm">
            + 새 계약서 작성
          </button>
        </div>
        
        <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden shadow-sm">
          {creators.map(creator => (
            <div key={creator.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-black group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-1">
                    {creator.name} 표준 전속 계약서
                    <StatusBadge status={creator.contractStatus} />
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="font-medium text-gray-500">2024.01.01 ~ 2025.12.31</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{creator.channelName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg" title="상세보기">
                   <ExternalLink size={18} />
                 </button>
                 <button className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg" title="다운로드">
                   <Download size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Stats (Vertical) */}
      <div className="w-full lg:w-64 flex flex-col gap-4 pt-2 mt-4 lg:mt-0">
         <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 hidden lg:block">계약 요약</div>
         
         <SummaryItem 
            label="체결 완료" 
            count={creators.filter(c => c.contractStatus === 'Signed').length}
            color="text-[#00C471]"
         />
         <SummaryItem 
            label="검토/작성 중" 
            count={creators.filter(c => c.contractStatus === 'Drafting').length}
            color="text-gray-600"
         />
         <SummaryItem 
            label="만료 예정 (30일 내)" 
            count={2}
            color="text-red-600"
         />
         <SummaryItem 
            label="미계약" 
            count={creators.filter(c => c.contractStatus === 'None').length}
            color="text-gray-400"
         />
      </div>
    </div>
  );
};

const CreatorHealthView = ({ creators }: { creators: Creator[] }) => {
    // Initial Mock Data with Scores
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
        { id: '1', name: '슈카월드', lastCheck: '2023-12-10', score: 95, result: '양호', status: '재직중' },
        { id: '2', name: '침착맨', lastCheck: '2023-11-05', score: 65, result: '주의', status: '재직중' },
        { id: '3', name: '요리보고', lastCheck: '2024-01-05', score: 88, result: '양호', status: '대기중' },
        { id: '4', name: '여행가제이', lastCheck: '2023-09-20', score: 92, result: '양호', status: '재직중' },
        { id: '6', name: '치즈냥이', lastCheck: '-', score: 0, result: '미수검', status: '재직중' },
    ]);

    const [issueLogs, setIssueLogs] = useState<IssueLog[]>([
        { id: 1, creator: '침착맨', date: '2024-01-15', category: '부상', description: '손목 통증 호소 (건초염 의심)', status: '진료중' },
        { id: 2, creator: '치즈냥이', date: '2024-01-18', category: '피로', description: '장기 방송으로 인한 수면 부족', status: '휴식권고' },
        { id: 3, creator: '슈카월드', date: '2023-12-20', category: '검진', description: '정기 검진 결과: 콜레스테롤 주의', status: '모니터링' },
    ]);

    // Modal States
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

    // Form States
    const [newCheckup, setNewCheckup] = useState({
        creatorName: '',
        date: new Date().toISOString().split('T')[0],
        score: 80,
        result: '양호'
    });

    const [newIssue, setNewIssue] = useState({
        creatorName: '',
        date: new Date().toISOString().split('T')[0],
        category: '부상',
        description: '',
        status: '모니터링'
    });

    // Helper for Bar Color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-[#00C471]';
        if (score >= 50) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    const handleAddCheckup = () => {
        if (!newCheckup.creatorName) return alert('크리에이터를 선택해주세요.');
        const newRecord: HealthRecord = {
            id: Date.now().toString(),
            name: newCheckup.creatorName,
            lastCheck: newCheckup.date,
            score: newCheckup.score,
            result: newCheckup.result,
            status: '업데이트됨'
        };
        const filtered = healthRecords.filter(r => r.name !== newCheckup.creatorName);
        setHealthRecords([newRecord, ...filtered]);
        setIsCheckModalOpen(false);
    };

    const handleAddIssue = () => {
        if (!newIssue.creatorName || !newIssue.description) return alert('필수 정보를 입력해주세요.');
        const newLog: IssueLog = {
            id: Date.now(),
            creator: newIssue.creatorName,
            date: newIssue.date,
            category: newIssue.category,
            description: newIssue.description,
            status: newIssue.status
        };
        setIssueLogs([newLog, ...issueLogs]);
        setIsIssueModalOpen(false);
    };

    return (
        <div className="animate-[fadeIn_0.2s_ease-out] relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: General Health Checkup */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <Stethoscope size={20} className="text-[#00C471]" />
                                신체 건강 검진 현황
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">정기 건강 검진 및 의료 지원 기록입니다.</p>
                        </div>
                        <button 
                            onClick={() => setIsCheckModalOpen(true)}
                            className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                        >
                            + 검진 기록 추가
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">크리에이터</th>
                                    <th className="px-6 py-3">최근 검진일</th>
                                    <th className="px-6 py-3 w-48">종합 점수</th>
                                    <th className="px-6 py-3">판정</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {healthRecords.map(rec => (
                                    <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{rec.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{rec.lastCheck}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${getScoreColor(rec.score)}`} 
                                                        style={{ width: `${rec.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-700 w-8 text-right">{rec.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold ${
                                                rec.score >= 80 ? 'text-[#00C471]' : 
                                                rec.score >= 50 ? 'text-yellow-600' : 'text-red-500'
                                            }`}>
                                                {rec.result}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Health Issue Log */}
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <ClipboardList size={20} className="text-gray-700" />
                                이슈 로그
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">특이사항 및 지원 내역</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {issueLogs.map(log => (
                            <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-gray-900">{log.creator}</span>
                                    <span className="text-xs text-gray-400">{log.date}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 mr-2">{log.category}</span>
                                    <span className="text-sm text-gray-700">{log.description}</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className={`text-xs font-bold ${
                                        log.status === '진료중' ? 'text-yellow-600' :
                                        log.status === '휴식권고' ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => setIsIssueModalOpen(true)}
                            className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            + 이슈 기록 추가
                        </button>
                    </div>
                </div>
            </div>

            {/* Checkup Modal */}
            {isCheckModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsCheckModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">건강 검진 기록 추가</h3>
                            <button onClick={() => setIsCheckModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">크리에이터</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newCheckup.creatorName}
                                    onChange={e => setNewCheckup({...newCheckup, creatorName: e.target.value})}
                                >
                                    <option value="">선택하세요</option>
                                    {creators.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">검진일</label>
                                <input 
                                    type="date" 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newCheckup.date}
                                    onChange={e => setNewCheckup({...newCheckup, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">종합 점수 (0~100)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="range" min="0" max="100" 
                                        className="flex-1 accent-[#00C471]"
                                        value={newCheckup.score}
                                        onChange={e => {
                                            const score = parseInt(e.target.value);
                                            let result = '양호';
                                            if (score < 50) result = '위험';
                                            else if (score < 80) result = '주의';
                                            setNewCheckup({...newCheckup, score, result});
                                        }}
                                    />
                                    <span className="text-sm font-bold w-8 text-right">{newCheckup.score}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">판정 결과</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newCheckup.result}
                                    onChange={e => setNewCheckup({...newCheckup, result: e.target.value})}
                                >
                                    <option value="양호">양호</option>
                                    <option value="주의">주의</option>
                                    <option value="위험">위험</option>
                                    <option value="재검필요">재검필요</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setIsCheckModalOpen(false)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">취소</button>
                            <button onClick={handleAddCheckup} className="px-3 py-1.5 bg-[#00C471] text-white rounded text-sm hover:bg-[#00b065]">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Issue Modal */}
            {isIssueModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsIssueModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">건강 이슈 기록 추가</h3>
                            <button onClick={() => setIsIssueModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">크리에이터</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.creatorName}
                                    onChange={e => setNewIssue({...newIssue, creatorName: e.target.value})}
                                >
                                    <option value="">선택하세요</option>
                                    {creators.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">발생일</label>
                                <input 
                                    type="date" 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.date}
                                    onChange={e => setNewIssue({...newIssue, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">카테고리</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.category}
                                    onChange={e => setNewIssue({...newIssue, category: e.target.value})}
                                >
                                    <option value="부상">부상</option>
                                    <option value="피로">피로</option>
                                    <option value="질병">질병</option>
                                    <option value="멘탈">멘탈</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">내용</label>
                                <textarea 
                                    rows={3}
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm resize-none"
                                    placeholder="상세 내용을 입력하세요"
                                    value={newIssue.description}
                                    onChange={e => setNewIssue({...newIssue, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">현재 상태</label>
                                <select 
                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                                    value={newIssue.status}
                                    onChange={e => setNewIssue({...newIssue, status: e.target.value})}
                                >
                                    <option value="모니터링">모니터링</option>
                                    <option value="진료중">진료중</option>
                                    <option value="휴식권고">휴식권고</option>
                                    <option value="조치완료">조치완료</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setIsIssueModalOpen(false)} className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">취소</button>
                            <button onClick={handleAddIssue} className="px-3 py-1.5 bg-[#00C471] text-white rounded text-sm hover:bg-[#00b065]">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Helper Component for Modal ---
const PlatformOption = ({ platform, selected, onClick }: { platform: PlatformType, selected: boolean, onClick: () => void }) => (
    <div 
       onClick={onClick}
       className={`
          cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border transition-all
          ${selected ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
       `}
    >
        <div className="mb-2">{renderPlatformIcon(platform, 24)}</div>
        <span className={`text-xs font-medium ${selected ? 'text-black' : 'text-gray-500'}`}>
           {platform === 'Chzzk' ? '치지직' : platform}
        </span>
    </div>
);

// --- Main Admin Component ---
interface AdminCreatorViewProps {
    user: UserType;
    creators: Creator[];
    onUpdateCreators: (creators: Creator[]) => void;
}

export const AdminCreatorView = ({ user, creators, onUpdateCreators }: AdminCreatorViewProps) => {
  const [adminTab, setAdminTab] = useState<'list' | 'contract' | 'health'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCreatorData, setNewCreatorData] = useState<{
      name: string;
      platform: PlatformType;
      subscribers: string;
      category: string;
      status: '활동중' | '휴식중' | '대기중';
      avatarUrl: string;
      contactInfo: string;
  }>({
      name: '',
      platform: 'YouTube',
      subscribers: '',
      category: '',
      status: '대기중',
      avatarUrl: '',
      contactInfo: ''
  });

  const handleAddCreator = () => {
    if (!newCreatorData.name) {
        alert('크리에이터 이름을 입력해주세요.');
        return;
    }

    const newId = (creators.length + 1).toString();
    const newCreator: Creator = {
        id: newId,
        name: newCreatorData.name,
        platform: newCreatorData.platform,
        status: newCreatorData.status,
        subscribers: newCreatorData.subscribers || '0명',
        avatarUrl: newCreatorData.avatarUrl,
        coverUrl: '', 
        tags: [],
        category: newCreatorData.category || '기타',
        manager: user.name, 
        channelName: newCreatorData.name + ' Channel',
        contactInfo: newCreatorData.contactInfo,
        contractStatus: 'Drafting'
    };

    onUpdateCreators([...creators, newCreator]);
    setIsAddModalOpen(false);
    setNewCreatorData({
        name: '',
        platform: 'YouTube',
        subscribers: '',
        category: '',
        status: '대기중',
        avatarUrl: '',
        contactInfo: ''
    });
  };

  return (
      <div className="flex-1 h-screen overflow-y-auto bg-white p-8">
          <div className="max-w-[1600px] mx-auto">
              <div className="text-xs text-gray-500 mb-2">HR 관리 / 크리에이터 관리</div>
              <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                       <Users size={24} className="text-gray-600"/>
                    </div>
                    <div>
                       <h1 className="text-xl font-bold text-gray-900">크리에이터 전체 관리 (Admin)</h1>
                       <p className="text-xs text-gray-500">소속 크리에이터의 계약, 성과 및 담당자를 관리합니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 border-b border-gray-200 mt-6">
                      <button onClick={() => setAdminTab('list')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${adminTab === 'list' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                         <Users size={16} /> 목록 관리
                      </button>
                      <button onClick={() => setAdminTab('contract')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${adminTab === 'contract' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                         <FileText size={16} /> 계약 관리
                      </button>
                      <button onClick={() => setAdminTab('health')} className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${adminTab === 'health' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                         <Activity size={16} /> 건강 관리
                      </button>
                  </div>
              </div>

              {adminTab === 'list' && (
                  <div className="animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                              <div className="relative">
                                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input type="text" placeholder="크리에이터 검색..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md w-64 focus:outline-none focus:border-gray-400 bg-gray-50/50"/>
                              </div>
                              <div className="h-4 w-px bg-gray-300 mx-2"></div>
                              <span className="text-xs text-gray-500 font-medium">총 {creators.length}명</span>
                          </div>
                          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1 bg-[#00C471] hover:bg-[#00b065] text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-colors">
                              <Plus size={16} /> 등록
                          </button>
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <table className="w-full text-left">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                      <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">크리에이터</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">채널 정보</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">연락처</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">담당 매니저</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">상태</th>
                                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">관리</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {creators.map(creator => (
                                      <tr key={creator.id} className="hover:bg-gray-50 transition-colors group">
                                          <td className="px-4 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                          <td className="px-4 py-4">
                                              <div className="flex items-center gap-3">
                                                  {creator.avatarUrl ? <img src={creator.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" /> : <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400"><User size={20} /></div>}
                                                  <div>
                                                      <div className="text-sm font-bold text-gray-900">{creator.name}</div>
                                                      <div className="text-[10px] text-gray-400">ID: {creator.id}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="px-4 py-4">
                                              <div className="flex items-center gap-1.5 mb-0.5">
                                                  {renderPlatformIcon(creator.platform, 12)}
                                                  <span className="text-sm text-gray-700">{creator.channelName}</span>
                                              </div>
                                              <div className="text-[11px] text-gray-400">구독자 {creator.subscribers}</div>
                                          </td>
                                          <td className="px-4 py-4">
                                              {creator.contactInfo ? (
                                                  <span className="text-xs text-gray-600 font-medium">
                                                      {creator.contactInfo}
                                                  </span>
                                              ) : (
                                                  <span className="text-[10px] text-gray-400">-</span>
                                              )}
                                          </td>
                                          <td className="px-4 py-4">
                                              <div className="text-sm text-gray-800">{creator.manager}</div>
                                              {creator.manager && creator.manager !== '담당자 없음' ? (
                                                  <div className="text-[10px] text-[#00C471] flex items-center gap-0.5 mt-0.5">
                                                      <LinkIcon size={8} /> 
                                                      <span>연결됨</span>
                                                      {creator.managementEndDate && (
                                                          <span className="text-gray-400 ml-1">
                                                              (~{creator.managementEndDate.substring(2)})
                                                          </span>
                                                      )}
                                                  </div>
                                              ) : (
                                                  <div className="text-[10px] text-gray-400 mt-0.5">미배정</div>
                                              )}
                                          </td>
                                          <td className="px-4 py-4">
                                              {creator.status === '활동중' && <span className="text-xs font-bold text-[#00C471]">활동중</span>}
                                              {creator.status === '대기중' && <span className="text-xs font-bold text-gray-500">대기중</span>}
                                              {creator.status === '종료' && <span className="text-xs font-bold text-red-500">종료</span>}
                                              {creator.status === '휴식중' && <span className="text-xs font-bold text-yellow-600">휴식중</span>}
                                          </td>
                                          <td className="px-4 py-4 text-center">
                                              <button className="text-gray-400 hover:bg-gray-200 p-1 rounded transition-colors"><MoreHorizontal size={16} /></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
              
              {adminTab === 'contract' && (
                  <ContractsView creators={creators} />
              )}

              {adminTab === 'health' && (
                   <CreatorHealthView creators={creators} />
              )}

              {/* ADMIN ADD MODAL */}
              {isAddModalOpen && (
                  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
                      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">새 크리에이터 등록 (Admin)</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* ... (Modal content same as before) ... */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">이름</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        placeholder="크리에이터 이름 입력"
                                        value={newCreatorData.name}
                                        onChange={e => setNewCreatorData({...newCreatorData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">플랫폼</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <PlatformOption platform="YouTube" selected={newCreatorData.platform === 'YouTube'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'YouTube'})} />
                                        <PlatformOption platform="Twitch" selected={newCreatorData.platform === 'Twitch'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'Twitch'})} />
                                        <PlatformOption platform="Chzzk" selected={newCreatorData.platform === 'Chzzk'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'Chzzk'})} />
                                        <PlatformOption platform="Instagram" selected={newCreatorData.platform === 'Instagram'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'Instagram'})} />
                                        <PlatformOption platform="TikTok" selected={newCreatorData.platform === 'TikTok'} onClick={() => setNewCreatorData({...newCreatorData, platform: 'TikTok'})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">구독자 수</label>
                                        <input 
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                            placeholder="예: 10.5만명"
                                            value={newCreatorData.subscribers}
                                            onChange={e => setNewCreatorData({...newCreatorData, subscribers: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">카테고리</label>
                                        <input 
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                            placeholder="예: 게임, 먹방"
                                            value={newCreatorData.category}
                                            onChange={e => setNewCreatorData({...newCreatorData, category: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">기본 연락망 (전화번호/이메일)</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        placeholder="예: 010-1234-5678"
                                        value={newCreatorData.contactInfo}
                                        onChange={e => setNewCreatorData({...newCreatorData, contactInfo: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">초기 상태</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                                        value={newCreatorData.status}
                                        onChange={e => setNewCreatorData({...newCreatorData, status: e.target.value as any})}
                                    >
                                        <option value="대기중">대기중</option>
                                        <option value="활동중">활동중</option>
                                        <option value="휴식중">휴식중</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                                <button onClick={handleAddCreator} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">추가하기</button>
                            </div>
                      </div>
                  </div>
               )}
          </div>
      </div>
  );
};