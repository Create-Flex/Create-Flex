import React from 'react';
import { User, UserRole } from '../types';
import { AdminCreatorView } from './AdminCreatorView';
import { EmployeeCreatorView } from './EmployeeCreatorView';
import { Creator } from './CreatorShared';

interface CreatorManagerViewProps {
    user: User;
    creators: Creator[];
    onUpdateCreators: (creators: Creator[]) => void;
}

export const CreatorManagerView = ({ user, creators, onUpdateCreators }: CreatorManagerViewProps) => {
  return user.role === UserRole.ADMIN 
    ? <AdminCreatorView user={user} creators={creators} onUpdateCreators={onUpdateCreators} />
    : <EmployeeCreatorView user={user} creators={creators} onUpdateCreators={onUpdateCreators} />;
};