
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import { Button, Input, Card } from '../../../../shared/ui';
import AuthService from '../../../../core/auth';

export const SettingsPage: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await AuthService.updateProfile({ name });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">账号管理</h2>
      </header>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold rounded-2xl animate-in fade-in slide-in-from-top-2">
          个人资料更新成功！
        </div>
      )}

      <Card className="border-none shadow-xl shadow-slate-200/50 p-6 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
               {user?.avatar ? (
                 <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
               ) : (
                 <span className="text-3xl font-black text-slate-300">{user?.name?.[0]}</span>
               )}
            </div>
            <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera size={24} className="text-white" />
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">点击更换头像</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Input 
            label="用户昵称" 
            placeholder="输入你的新昵称" 
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <Input 
            label="账号 ID (不可更改)" 
            value={user?.username || ''}
            disabled
            className="bg-slate-50 text-slate-400"
          />

          <Input 
            label="修改密码" 
            type="password"
            placeholder="如需修改请输入新密码" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-4 rounded-2xl text-lg shadow-blue-200"
              isLoading={loading}
            >
              <Save size={20} className="mr-2" /> 保存更改
            </Button>
          </div>
        </form>
      </Card>

      <div className="p-6 bg-red-50/30 rounded-2xl border border-red-50">
         <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">危险区域</h4>
         <button className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors">
           永久注销账号
         </button>
      </div>
    </div>
  );
};
