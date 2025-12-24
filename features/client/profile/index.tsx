
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Crown,
  Backpack,
  MapPinned
} from 'lucide-react';
import AuthService from '../../../core/auth';
import { Card, Button } from '../../../shared/ui';
import { cn } from '../../../shared/utils/styles';

export const ProfilePage: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      icon: PieChart, 
      label: '我的生涯', 
      path: '/app/analysis', 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-50' 
    },
    { 
      icon: Backpack, 
      label: '装备库', 
      path: '/app/profile/gear', 
      color: 'text-amber-500', 
      bgColor: 'bg-amber-50' 
    },
    { 
      icon: MapPinned, 
      label: '常用钓点', 
      path: '/app/profile/spots', 
      color: 'text-emerald-500', 
      bgColor: 'bg-emerald-50' 
    },
    { 
      icon: Bell, 
      label: '消息中心', 
      path: '/app/inbox', 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-50' 
    },
    { 
      icon: Settings, 
      label: '账号管理', 
      path: '/app/profile/settings', 
      color: 'text-slate-500', 
      bgColor: 'bg-slate-100' 
    },
  ];

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header Profile Info */}
      <header className="flex items-center gap-4 pt-4">
        <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-2xl overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
          ) : (
            user?.name?.[0]
          )}
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded shadow-sm">ID: {user?.username}</span>
            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
              <ShieldCheck size={12} />
              认证钓手
            </div>
          </div>
        </div>
      </header>

      {/* VIP Banner */}
      <Card 
        padding="none" 
        className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 border-none shadow-xl shadow-amber-100 overflow-hidden group"
      >
        <div className="p-6 flex items-center justify-between relative">
          <div className="space-y-1 relative z-10">
            <h3 className="text-amber-900 font-black flex items-center gap-2">
              <Crown size={18} className="text-amber-700" />
              开通 VIP 会员
            </h3>
            <p className="text-amber-800/70 text-xs font-bold leading-tight">
              解锁专属传说鱼种与高级数据分析
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/90 backdrop-blur-sm text-amber-700 hover:bg-white rounded-xl font-black border-none relative z-10"
            onClick={() => alert('VIP功能开发中')}
          >
            立即开通
          </Button>
          <Crown size={80} className="absolute -right-4 -bottom-4 text-amber-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>
      </Card>

      {/* Menu List */}
      <section className="space-y-3">
        {menuItems.map((item) => (
          <div 
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl transition-colors", item.bgColor, item.color)}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
          </div>
        ))}
      </section>

      {/* Logout */}
      <section className="pt-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white border border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 active:scale-[0.98] transition-all"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </section>

      {/* App Version */}
      <div className="text-center pt-4">
         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
           知渔 ZhiYu • v2.1.0-beta
         </p>
      </div>
    </div>
  );
};
