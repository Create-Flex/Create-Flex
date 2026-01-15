import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Bot, Pencil, UserCircle, Activity, Calendar, ChevronLeft, X, Mail, Hash, Briefcase, Building, MapPin, Phone, Target, ClipboardList, Stethoscope, Gift } from 'lucide-react';

interface ProfileViewProps {
    profile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
    readOnly?: boolean;
    onBack?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile, readOnly = false, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('정보');
  
  // Vacation Modal State
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [vacationForm, setVacationForm] = useState({
      type: '연차',
      startDate: '',
      endDate: '',
      reason: '',
      // Workation
      location: '', 
      emergencyContact: '', 
      workGoals: '', 
      handover: '',
      // Condolences (경조사)
      relationship: '',
      eventType: '',
      // Sick Leave (병가)
      symptoms: '',
      hospital: ''
  });

  const handleChange = (field: string, value: string) => {
    onUpdateProfile({
      ...profile,
      [field]: value
    });
  };

  const handleVacationSubmit = () => {
      if(!vacationForm.startDate || !vacationForm.endDate) {
          alert('날짜를 선택해주세요.');
          return;
      }

      // Validation per type
      if (vacationForm.type === '워케이션') {
          if (!vacationForm.location) return alert('워케이션 근무 장소를 입력해주세요.');
          if (!vacationForm.emergencyContact) return alert('비상 연락망을 입력해주세요.');
          if (!vacationForm.workGoals) return alert('업무 계획 및 목표를 입력해주세요.');
          if (!vacationForm.handover) return alert('업무 인계 사항을 입력해주세요.');
      } else if (vacationForm.type === '경조사') {
          if (!vacationForm.relationship) return alert('대상(관계)을 입력해주세요. (예: 본인, 부모, 형제 등)');
          if (!vacationForm.eventType) return alert('경조 내용을 입력해주세요. (예: 결혼, 칠순, 장례 등)');
      } else if (vacationForm.type === '병가') {
          if (!vacationForm.symptoms) return alert('증상 및 사유를 입력해주세요.');
          if (!vacationForm.hospital) return alert('진료 병원명을 입력해주세요.');
      }

      let message = `${vacationForm.type} 신청이 완료되었습니다.\n기간: ${vacationForm.startDate} ~ ${vacationForm.endDate}`;
      
      if (vacationForm.type === '워케이션') {
          message += `\n장소: ${vacationForm.location}`;
      } else if (vacationForm.type === '경조사') {
          message += `\n내용: ${vacationForm.relationship} ${vacationForm.eventType}`;
      } else if (vacationForm.type === '병가') {
          message += `\n사유: ${vacationForm.symptoms}`;
      }

      alert(message);
      setIsVacationModalOpen(false);
      
      // Reset Form
      setVacationForm({ 
          type: '연차', 
          startDate: '', 
          endDate: '', 
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
  };

  const tabs = ['정보', '건강'];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white relative animate-[fadeIn_0.3s_ease-out]">
      {onBack && (
        <div className="absolute top-4 left-4 z-20">
            <button 
                onClick={onBack}
                className="bg-white/90 backdrop-blur text-gray-600 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center gap-1 text-xs font-medium transition-colors"
            >
                <ChevronLeft size={14} /> 돌아가기
            </button>
        </div>
      )}
      
      {!readOnly && (
        <div className="absolute top-4 right-4 z-10">
            <button className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 bg-white/80 backdrop-blur-sm">Cover 변경</button>
        </div>
      )}
      
      {/* Cover Image Placeholder */}
      <div className="h-48 bg-gray-50 w-full relative">
         {/* Avatar removed from here */}
      </div>

      <div className="px-12 pb-20 max-w-[1600px] mx-auto">
        
        {/* Avatar - Moved here to be above name */}
        <div className="-mt-12 mb-6 relative z-10">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
        </div>

        {/* Header Info */}
        <div className="mb-8">
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">재직중</span>
           </div>
           <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>{profile.job}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{profile.org}</span>
              {profile.rank.includes('팀장') || profile.rank.includes('조직장') ? (
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">조직장</span>
              ) : null}
           </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
           <div className="flex gap-6">
              {tabs.map((tab) => (
                 <div 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm cursor-pointer transition-colors ${
                        activeTab === tab 
                        ? 'font-bold text-black border-b-2 border-black' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                 >
                    {tab}
                 </div>
              ))}
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* Left Column: Content Area */}
           <div className="flex-1 space-y-10 min-h-[400px]">
              
              {/* === INFORMATION TAB === */}
              {activeTab === '정보' && (
                 <>
                    {/* HR Info - Visible to Everyone */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-400">인사 정보</h3>
                            <span className="text-[10px] text-gray-400">🕒 2023. 12. 12 - 현재</span>
                        </div>
                        
                        <div className="space-y-5">
                            {/* Org */}
                            <div className="flex items-start">
                                <div className="w-6 text-gray-400 mr-4 mt-0.5"><Building size={16} /></div>
                                <div className="w-16 text-sm text-gray-500 font-medium">조직</div>
                                <div className="flex-1 text-sm text-gray-800">
                                    <span className="text-gray-400 mr-2">소속</span> {profile.org}
                                    {profile.rank.includes('팀장') && <span className="bg-gray-100 text-[10px] px-1 rounded ml-2">조직장</span>}
                                </div>
                            </div>
                            
                            {/* Job */}
                            <div className="flex items-start">
                                <div className="w-6 text-gray-400 mr-4 mt-0.5"><Briefcase size={16} /></div> 
                                <div className="w-16 text-sm text-gray-500 font-medium">직무</div>
                                <div className="flex-1 text-sm text-gray-800">
                                    <span className="text-gray-400 mr-2">수행 직무</span> {profile.job}
                                </div>
                            </div>

                            {/* Basic Info (Email, Nickname, ID) - Moved here */}
                            <div className="flex items-start">
                                <div className="w-6 text-gray-400 mr-4 mt-0.5"><UserCircle size={16} /></div> 
                                <div className="w-16 text-sm text-gray-500 font-medium">기본 정보</div>
                                <div className="flex-1 text-sm text-gray-800 space-y-2">
                                    <div className="flex">
                                        <span className="text-gray-400 inline-block w-20 shrink-0">닉네임</span> 
                                        <span>{profile.nickname}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-400 inline-block w-20 shrink-0">사내 메일</span> 
                                        <span>{profile.email}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-400 inline-block w-20 shrink-0">사번</span> 
                                        <span>{profile.employeeId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info - Visible ONLY to Self (!readOnly) */}
                    {!readOnly && (
                        <div>
                            <div className="flex justify-between items-center mb-4 border-t border-gray-100 pt-8">
                                <h3 className="text-xs font-bold text-gray-400">개인정보</h3>
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`flex items-center gap-1 text-xs hover:text-gray-600 transition-colors ${isEditing ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
                                >
                                <Pencil size={12} /> {isEditing ? '저장' : '변경'}
                                </button>
                            </div>
                            
                            <div className="space-y-5">
                                {/* Name */}
                                <div className="flex items-start">
                                    <div className="w-6 text-gray-400 mr-4"><UserCircle size={18} /></div>
                                    <div className="w-16 text-sm text-gray-500 font-medium pt-1">이름</div>
                                    <div className="flex-1 text-sm text-gray-800">
                                        {isEditing ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-blue-100 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">본명</label>
                                                    <input 
                                                        value={profile.name} 
                                                        onChange={(e) => handleChange('name', e.target.value)}
                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">영문 이름</label>
                                                    <input 
                                                        value={profile.engName} 
                                                        onChange={(e) => handleChange('engName', e.target.value)}
                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-1 animate-[fadeIn_0.2s_ease-out]">
                                                <span className="text-gray-400 mr-2">본명</span> {profile.name}
                                                <span className="mx-3 text-gray-400 mr-2">영문 이름</span> {profile.engName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact (Personal Email & Phone) */}
                                <div className="flex items-start">
                                    <div className="w-6 text-gray-400 mr-4 pt-1"><Mail size={16} /></div>
                                    <div className="w-16 text-sm text-gray-500 font-medium pt-1">연락처</div>
                                    <div className="flex-1 text-sm text-gray-800">
                                        {isEditing ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-blue-100 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">개인 이메일</label>
                                                    <input 
                                                        value={profile.personalEmail} 
                                                        onChange={(e) => handleChange('personalEmail', e.target.value)}
                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1.5 font-medium">휴대전화</label>
                                                    <input 
                                                        value={profile.phone} 
                                                        onChange={(e) => handleChange('phone', e.target.value)}
                                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-1 animate-[fadeIn_0.2s_ease-out] space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400 w-20 shrink-0">개인 이메일</span> {profile.personalEmail}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400 w-20 shrink-0">휴대전화</span> {profile.phone}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Join Info (Read-only even in edit mode) */}
                                <div className="flex items-start">
                                    <div className="w-6 text-gray-400 mr-4 pt-1"><Calendar size={16} /></div>
                                    <div className="w-16 text-sm text-gray-500 font-medium pt-1">입사 정보</div>
                                    <div className="flex-1 text-sm text-gray-800">
                                        <div className="flex flex-wrap gap-y-2 py-1 animate-[fadeIn_0.2s_ease-out]">
                                            <span className="text-gray-400 mr-2">입사일</span> {profile.joinDate}
                                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded">{profile.tenure}</span>
                                            <span className="ml-4 text-gray-400 mr-2">입사 유형</span> 경력
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                 </>
              )}

              {/* === HEALTH TAB === */}
              {activeTab === '건강' && (
                 <div className="space-y-6 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                        <Activity className="text-blue-500 mt-1" size={20} />
                        <div>
                            <h3 className="text-sm font-bold text-blue-800 mb-1">정기 건강검진 대상자입니다</h3>
                            <p className="text-xs text-blue-600">2024년도 직장인 일반 건강검진을 12월 31일까지 완료해주세요.</p>
                            <button className="mt-2 text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors">검진 기관 찾기</button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500"/> 검진 이력
                        </h3>
                        <div className="space-y-3">
                            {[
                                { year: '2023', type: '일반 건강검진', date: '2023. 10. 15', hospital: 'KMI 한국의학연구소', result: '정상A' },
                                { year: '2022', type: '채용 건강검진', date: '2022. 01. 05', hospital: '강북삼성병원', result: '정상B (경미한 소견)' },
                            ].map((checkup, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-white">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-gray-900">{checkup.year}년 {checkup.type}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${checkup.result.includes('정상A') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                                                {checkup.result}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {checkup.date} | {checkup.hospital}
                                        </div>
                                    </div>
                                    <button className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-2 py-1 rounded">결과 보기</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}
           </div>

           {/* Right Column: Widgets */}
           <div className="w-full lg:w-[320px] space-y-4 shrink-0">
              {/* Vacation Card */}
              <div className="bg-[#F9F9F9] rounded-xl p-5 border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-800">휴가 사용 현황</h3>
                    <button 
                        onClick={() => setIsVacationModalOpen(true)}
                        className="bg-white border border-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-50 shadow-sm"
                    >
                        휴가 신청
                    </button>
                 </div>
                 <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">12.5</span>
                    <span className="text-sm text-gray-500 ml-1">일 남음</span>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>연차</span>
                          <span>2.5/15</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          {/* Changed from bg-gray-300 to bg-green-500 */}
                          <div className="h-full bg-green-500 w-[16%]"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>월차</span>
                          <span>1/1</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 w-full"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>반차</span>
                          <span>2회</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 w-[40%]"></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Work Time Card */}
              <div className="bg-[#F9F9F9] rounded-xl p-5 border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-800">이번 주 근무 시간</h3>
                 </div>
                 <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">38h 20m</span>
                    <span className="text-sm text-gray-400 ml-1">/ 40h</span>
                 </div>
                 <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>진행률</span>
                    <span>95%</span>
                 </div>
                 <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-blue-500 w-[95%]"></div>
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-400">
                    <span>초과 근무 가능: 12h</span>
                    <span>잔여 정규: 1h 40m</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Vacation Request Modal */}
      {isVacationModalOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]" onClick={() => setIsVacationModalOpen(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 bg-white z-10">
                      <h3 className="font-bold text-gray-900">휴가 신청</h3>
                      <button onClick={() => setIsVacationModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100">
                          <X size={20}/>
                      </button>
                  </div>
                  <div className="p-6 space-y-5">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">휴가 종류</label>
                          <div className="grid grid-cols-3 gap-2">
                              {['연차', '월차', '반차', '경조사', '병가', '워케이션'].map(type => (
                                  <button
                                      key={type}
                                      onClick={() => setVacationForm({
                                          ...vacationForm, 
                                          type, 
                                          // Reset other specific fields when switching
                                          location: type === '워케이션' ? vacationForm.location : '',
                                          emergencyContact: type === '워케이션' ? vacationForm.emergencyContact : '',
                                          workGoals: type === '워케이션' ? vacationForm.workGoals : '',
                                          handover: type === '워케이션' ? vacationForm.handover : '',
                                          relationship: type === '경조사' ? vacationForm.relationship : '',
                                          eventType: type === '경조사' ? vacationForm.eventType : '',
                                          symptoms: type === '병가' ? vacationForm.symptoms : '',
                                          hospital: type === '병가' ? vacationForm.hospital : ''
                                      })}
                                      className={`
                                          py-2 rounded-lg text-sm border transition-all
                                          ${vacationForm.type === type 
                                              ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium shadow-sm' 
                                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                                      `}
                                  >
                                      {type}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Workation Specific Fields */}
                      {vacationForm.type === '워케이션' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
                              <h4 className="text-xs font-bold text-blue-700 mb-2">워케이션 필수 입력 사항</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                          <MapPin size={12} /> 근무 장소
                                      </label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                          placeholder="예: 제주 오피스"
                                          value={vacationForm.location}
                                          onChange={e => setVacationForm({...vacationForm, location: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                          <Phone size={12} /> 비상 연락망
                                      </label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                          placeholder="예: 010-0000-0000"
                                          value={vacationForm.emergencyContact}
                                          onChange={e => setVacationForm({...vacationForm, emergencyContact: e.target.value})}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                      <Target size={12} /> 업무 계획 및 목표
                                  </label>
                                  <textarea 
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none bg-white"
                                      rows={3}
                                      placeholder="워케이션 기간 동안 달성할 주요 업무 목표와 일정을 상세히 기재해주세요."
                                      value={vacationForm.workGoals}
                                      onChange={e => setVacationForm({...vacationForm, workGoals: e.target.value})}
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                      <ClipboardList size={12} /> 업무 인계 사항 (비상 시)
                                  </label>
                                  <textarea 
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none bg-white"
                                      rows={2}
                                      placeholder="부재 중 이슈 발생 시 대응할 담당자 및 인계 사항을 입력해주세요."
                                      value={vacationForm.handover}
                                      onChange={e => setVacationForm({...vacationForm, handover: e.target.value})}
                                  />
                              </div>
                          </div>
                      )}

                      {/* Condolences Specific Fields */}
                      {vacationForm.type === '경조사' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4 p-4 bg-purple-50/30 rounded-lg border border-purple-100">
                              <h4 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">
                                  <Gift size={14} /> 경조사 필수 입력 사항
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">대상 (관계)</label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors bg-white"
                                          placeholder="예: 본인, 부모, 형제 등"
                                          value={vacationForm.relationship}
                                          onChange={e => setVacationForm({...vacationForm, relationship: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">경조 내용</label>
                                      <input 
                                          type="text"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors bg-white"
                                          placeholder="예: 결혼, 칠순, 장례 등"
                                          value={vacationForm.eventType}
                                          onChange={e => setVacationForm({...vacationForm, eventType: e.target.value})}
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Sick Leave Specific Fields */}
                      {vacationForm.type === '병가' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4 p-4 bg-green-50/30 rounded-lg border border-green-100">
                              <h4 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                                  <Stethoscope size={14} /> 병가 필수 입력 사항
                              </h4>
                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5">증상 및 사유</label>
                                  <input 
                                      type="text"
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors bg-white"
                                      placeholder="예: 독감으로 인한 고열, 입원 치료 등"
                                      value={vacationForm.symptoms}
                                      onChange={e => setVacationForm({...vacationForm, symptoms: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1.5">진료/입원 병원명</label>
                                  <input 
                                      type="text"
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors bg-white"
                                      placeholder="예: 강남세브란스병원"
                                      value={vacationForm.hospital}
                                      onChange={e => setVacationForm({...vacationForm, hospital: e.target.value})}
                                  />
                              </div>
                          </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">시작일</label>
                              <input 
                                  type="date"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                  value={vacationForm.startDate}
                                  onChange={e => setVacationForm({...vacationForm, startDate: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">종료일</label>
                              <input 
                                  type="date"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                  value={vacationForm.endDate}
                                  onChange={e => setVacationForm({...vacationForm, endDate: e.target.value})}
                              />
                          </div>
                      </div>
                      
                      {/* Standard Reason Field (Hide if Workation has specific fields, or keep as optional note) */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">
                              {['워케이션', '경조사', '병가'].includes(vacationForm.type) ? '기타 비고 (선택)' : '사유 (선택)'}
                          </label>
                          <textarea 
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                              rows={2}
                              placeholder={['워케이션', '경조사', '병가'].includes(vacationForm.type) ? "추가 요청사항이 있다면 입력해주세요." : "휴가 사유를 입력하세요 (선택)"}
                              value={vacationForm.reason}
                              onChange={e => setVacationForm({...vacationForm, reason: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0">
                      <button onClick={() => setIsVacationModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">취소</button>
                      <button onClick={handleVacationSubmit} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm">
                          신청하기
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};