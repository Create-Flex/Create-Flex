import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for employee
    if (id === 'qwer' && password === '1234') {
      onLogin(USERS.employee);
      return;
    }

    // Check for admin
    if (id === 'admin' && password === '1234') {
      onLogin(USERS.admin);
      return;
    }

    setError('아이디 또는 비밀번호를 확인해주세요.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F7F5]">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-black text-white text-2xl font-bold flex items-center justify-center rounded mb-4">
            N
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">HR Workspace</h1>
          <p className="text-gray-500 text-sm">Notion 스타일의 인사 관리 시스템</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">아이디</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요 (qwer / admin)"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요 (1234)"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors mt-2"
          >
            로그인
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
          <p>직원용: qwer / 1234</p>
          <p>관리자용: admin / 1234</p>
        </div>
      </div>
    </div>
  );
};