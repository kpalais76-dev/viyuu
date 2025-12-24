
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../core/auth';
import { Button, Input, Card } from '../../shared/ui';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = await AuthService.login(username);
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/app/record');
    } else {
      alert('未找到用户。请使用 "admin" 或 "fisher"');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full p-10 border-none shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-xl shadow-blue-200">知</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">知渔 ZhiYu</h1>
          <p className="text-slate-500">记录你垂钓生涯的每一次水花。</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="钓手 ID"
            placeholder="输入 'admin' 或 'fisher'"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <Button 
            type="submit"
            className="w-full py-4 text-base"
            isLoading={loading}
          >
            开启旅程
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center uppercase tracking-widest font-bold">
          知渔项目 • 2025 内部测试版
        </div>
      </Card>
    </div>
  );
};
