import React, { useState } from 'react';
import { User, UserProfile } from '../types';
import { ProfileView } from './ProfileView';
import { LayoutGrid, List, Search, Users, Mail, Phone, Calendar, MoreHorizontal, Hash } from 'lucide-react';

// Mock Data for Team Members
// In a real app, this would be fetched based on the user's organization ID
const TEAM_MEMBERS: UserProfile[] = [
  {
    name: '이채연',
    engName: 'Chae Yeon Lee',
    nickname: '소피아',
    email: 'sophia@company.com',
    personalEmail: 'sophia@gmail.com',
    phone: '010-9876-5432',
    employeeId: 'LP12577',
    joinDate: '2022년 01월 10일',
    tenure: '2년 1개월 재직',
    groupJoinDate: '2022년 01월 10일',
    org: 'Platform Squad',
    job: 'Product Owner',
    rank: '매니저 / Level 3',
    avatarUrl: 'https://picsum.photos/id/64/400/400'
  },
  {
    name: '김철수',
    engName: 'Cheol Soo Kim',
    nickname: '찰리',
    email: 'charlie@company.com',
    personalEmail: 'charlie@gmail.com',
    phone: '010-2222-3333',
    employeeId: 'LP12578',
    joinDate: '2021년 05월 12일',
    tenure: '2년 9개월 재직',
    groupJoinDate: '2021년 05월 12일',
    org: 'Platform Squad',
    job: 'Frontend Developer',
    rank: '매니저 / Level 3',
    avatarUrl: 'https://picsum.photos/id/10/400/400'
  },
  {
    name: '이영희',
    engName: 'Young Hee Lee',
    nickname: '루시',
    email: 'lucy@company.com',
    personalEmail: 'lucy@naver.com',
    phone: '010-4444-5555',
    employeeId: 'LP12580',
    joinDate: '2023년 11월 01일',
    tenure: '3개월 재직',
    groupJoinDate: '2023년 11월 01일',
    org: 'Platform Squad',
    job: 'Product Designer',
    rank: '사원 / Level 2',
    avatarUrl: 'https://picsum.photos/id/22/400/400'
  },
  {
    name: '박민수',
    engName: 'Min Soo Park',
    nickname: '마이크',
    email: 'mike@company.com',
    personalEmail: 'mike@gmail.com',
    phone: '010-6666-7777',
    employeeId: 'LP12550',
    joinDate: '2020년 03월 02일',
    tenure: '3년 11개월 재직',
    groupJoinDate: '2020년 03월 02일',
    org: 'Platform Squad',
    job: 'Backend Developer',
    rank: '시니어 / Level 4',
    avatarUrl: 'https://picsum.photos/id/55/400/400'
  },
  {
    name: '최지우',
    engName: 'Ji Woo Choi',
    nickname: '조이',
    email: 'joy@company.com',
    personalEmail: 'joy@daum.net',
    phone: '010-8888-9999',
    employeeId: 'LP12599',
    joinDate: '2024년 01월 02일',
    tenure: '1개월 재직',
    groupJoinDate: '2024년 01월 02일',
    org: 'Platform Squad',
    job: 'Intern',
    rank: '인턴 / Level 1',
    avatarUrl: 'https://picsum.photos/id/65/400/400'
  }
];

interface TeamViewProps {
  user: User;
}

export const TeamView: React.FC<TeamViewProps> = ({ user }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // If a member is selected, show their profile in read-only mode
  if (selectedMember) {
    return (
      <ProfileView 
        profile={selectedMember} 
        onUpdateProfile={() => {}} // Dummy function since it's read-only
        readOnly={true}
        onBack={() => setSelectedMember(null)}
      />
    );
  }

  const filteredMembers = TEAM_MEMBERS.filter(member => 
    member.name.includes(searchQuery) || 
    member.job.includes(searchQuery) ||
    member.nickname.includes(searchQuery)
  );

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Users className="text-gray-800" size={32} /> 팀 현황
            </h1>
            <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">Platform Squad</span> 소속 구성원입니다.
            </p>
          </div>

          <div className="flex items-center gap-4">
             {/* Search */}
             <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600" />
                <input 
                    type="text" 
                    placeholder="이름, 직무 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="카드 보기"
                >
                    <LayoutGrid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="리스트 보기"
                >
                    <List size={18} />
                </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-[fadeIn_0.2s_ease-out]">
                {filteredMembers.map((member, idx) => (
                    <div 
                        key={idx}
                        onClick={() => setSelectedMember(member)}
                        className="group border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white"
                    >
                        {/* Avatar & Cover Simulation */}
                        <div className="h-24 bg-gray-50 relative">
                             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-gray-100"></div>
                        </div>
                        <div className="px-5 pb-5 relative">
                             <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm overflow-hidden absolute -top-8 left-1/2 -translate-x-1/2 bg-white">
                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                             </div>
                             <div className="mt-10 text-center">
                                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                <p className="text-xs text-gray-500 mb-1">{member.job}</p>
                                <div className="flex justify-center items-center gap-2 mb-4 mt-2">
                                    <span className="bg-gray-100 text-gray-800 text-sm px-2 py-0.5 rounded border border-gray-200 font-medium">{member.nickname}</span>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100">재직중</span>
                                </div>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm animate-[fadeIn_0.2s_ease-out]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">프로필</th>
                            <th className="px-6 py-3">직무/직급</th>
                            <th className="px-6 py-3">연락처</th>
                            <th className="px-6 py-3">상태</th>
                            <th className="px-6 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredMembers.map((member, idx) => (
                            <tr 
                                key={idx} 
                                onClick={() => setSelectedMember(member)}
                                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                                        <div>
                                            <div className="font-bold text-gray-900 flex items-center gap-2">
                                                {member.name} 
                                                <span className="text-gray-500 font-normal text-sm">({member.nickname})</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{member.engName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-900">{member.job}</div>
                                    <div className="text-xs text-gray-400">{member.rank}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <Mail size={12} className="text-gray-400" /> {member.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Phone size={12} /> {member.phone}
                                        <span className="mx-1">|</span>
                                        <Hash size={12} /> {member.employeeId}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded border border-blue-100 font-medium">재직중</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};