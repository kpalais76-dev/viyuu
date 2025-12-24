
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { PlusCircle, LayoutGrid, User as UserIcon, LogOut } from 'lucide-react';
import AuthService from '../core/auth';
import { cn } from '../shared/utils/styles';

export const MobileLayout: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const navItems = [
    { icon: PlusCircle, label: '记录', path: '/app/record' },
    { icon: LayoutGrid, label: '展厅', path: '/app/museum' },
    { icon: UserIcon, label: '我的', path: '/app/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto border-x border-slate-100 shadow-2xl shadow-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">知</div>
          <span className="font-bold text-slate-900">知渔 ZhiYu</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold leading-tight">{user?.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">钓手 Angler</span>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 bg-white border-t border-slate-100 flex items-center justify-around z-50 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-all flex-1",
              isActive ? "text-blue-600" : "text-slate-400"
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  isActive ? "bg-blue-50" : "bg-transparent"
                )}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
