export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  jobTitle: string;
  avatarUrl: string;
  status: '재직중' | '휴가중';
  tags: string[];
}

export interface UserProfile {
  name: string;
  engName: string;
  nickname: string;
  email: string;
  personalEmail: string;
  phone: string; // Added phone number
  employeeId: string;
  joinDate: string;
  tenure: string;
  groupJoinDate: string;
  org: string;
  job: string;
  rank: string;
  avatarUrl: string; // Added for synchronization
}

export interface AttendanceStats {
  usedLeave: number;
  totalLeave: number;
  workHoursCurrent: number;
  workHoursTotal: number;
}