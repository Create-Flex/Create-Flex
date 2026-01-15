import { User, UserRole, UserProfile } from './types';

export const USERS: Record<string, User> = {
  employee: {
    id: '1',
    username: 'qwer',
    name: '이채연',
    role: UserRole.EMPLOYEE,
    jobTitle: 'Product Owner',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    status: '재직중',
    tags: ['플랫폼팀', '재직중']
  },
  admin: {
    id: '2',
    username: 'admin',
    name: '김유연',
    role: UserRole.ADMIN,
    jobTitle: 'Senior HR Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: '재직중',
    tags: ['인사팀', '관리자']
  }
};

export const EMPLOYEE_PROFILE_DATA: UserProfile = {
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
};

export const ADMIN_PROFILE_DATA: UserProfile = {
  name: '김유연',
  engName: 'Yu Yeon Kim',
  nickname: '제니',
  email: 'jenny@company.com',
  personalEmail: 'jenny@naver.com',
  phone: '010-1234-5678',
  employeeId: 'HR001',
  joinDate: '2019년 03월 15일',
  tenure: '5년 재직',
  groupJoinDate: '2019년 03월 15일',
  org: 'People & Culture',
  job: 'Senior HR Manager',
  rank: '팀장 / Level 5',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
};