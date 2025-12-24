
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, LogOut, ShieldCheck, Bell } from 'lucide-react';
import AuthService from '../core/auth';
import { cn } from '../shared/utils/styles';

export const AdminLayout: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: '控制台', path: '/admin/dashboard' },
    { icon: Users, label: '钓手管理', path: '/admin/users' },
    { icon: MessageSquare, label: '系统通知', path: '/admin/messages' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">知</div>
            <div>
              <h1 className="font-black text-slate-900 leading-tight">知渔管理端</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">系统管理</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm",
                  isActive 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> 系统在线
             </div>
             <p className="text-[10px] text-slate-400">内部版本: 2025.03.01_v1</p>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="text-sm font-bold text-slate-400">
              运行环境: <span className="text-blue-600">生产环境</span>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-100"></div>

              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                    <div className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">系统管理员</div>
                 </div>
                 <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"
                >
                    <LogOut size={18} />
                 </button>
              </div>
           </div>
        </header>

        <main className="p-8 max-w-7xl">
           <Outlet />
        </main>
      </div>
    </div>
  );
};
