
import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Search, Filter } from 'lucide-react';
import { Card, Button } from '../../shared/ui';
import DB from '../../core/db';
import { User as UserType } from '../../core/types';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const allUsers = await DB.findAll<UserType>(DB.COLLECTIONS.USERS);
    setUsers(allUsers);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user: UserType) => {
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    await DB.update<UserType>(DB.COLLECTIONS.USERS, user.id, { status: newStatus });
    loadUsers();
  };

  const getRoleText = (role: string) => {
    return role === 'admin' ? '管理员' : '普通钓手';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? '账号正常' : '已封禁';
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">钓手名录</h2>
          <p className="text-slate-500 font-medium">管理全站用户权限与账号状态。</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="rounded-xl">
             <Filter size={16} className="mr-2" /> 筛选
           </Button>
           <Button variant="outline" size="sm" className="rounded-xl">
             <Search size={16} className="mr-2" /> 搜索
           </Button>
        </div>
      </header>

      <Card padding="none" className="overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">钓手信息</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">权限</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">加入时间</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">账号状态</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                       <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-400">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'}`}>
                         {getRoleText(user.role)}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'active' ? 'text-emerald-500' : 'text-red-400'}`}>
                         {user.status === 'active' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                         <span>{getStatusText(user.status)}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant={user.status === 'active' ? 'danger' : 'secondary'} 
                        size="sm" 
                        className="rounded-lg font-bold"
                        onClick={() => toggleStatus(user)}
                      >
                        {user.status === 'active' ? '封禁账号' : '恢复账号'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;
