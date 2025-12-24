
import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Activity, Bell } from 'lucide-react';
import { Card } from '../../shared/ui';
import DB from '../../core/db';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    records: 0,
    alerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const [users, records, messages] = await Promise.all([
        DB.findAll(DB.COLLECTIONS.USERS),
        DB.findAll(DB.COLLECTIONS.RECORDS),
        DB.findAll(DB.COLLECTIONS.MESSAGES)
      ]);
      setStats({
        users: users.length,
        records: records.length,
        alerts: messages.length
      });
      setLoading(false);
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">全站数据概览</h2>
        <p className="text-slate-500 font-medium">实时监控知渔生态系统运行状态。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '注册钓手', value: stats.users.toString(), icon: Users, color: 'blue' },
          { label: '累计鱼获', value: stats.records.toString(), icon: TrendingUp, color: 'emerald' },
          { label: '活跃公告', value: stats.alerts.toString(), icon: Bell, color: 'amber' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
            <div className={`text-3xl font-black text-slate-900 ${loading ? 'animate-pulse bg-slate-100 h-9 w-16 rounded' : ''}`}>
              {!loading && stat.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 border-none shadow-sm flex flex-col justify-center min-h-[300px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Activity size={20} />
            </div>
            <h3 className="font-bold text-slate-900">系统活跃度</h3>
          </div>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 font-bold">
            数据分析图表加载中...
          </div>
        </Card>
        
        <Card className="p-8 border-none shadow-sm flex flex-col justify-center min-h-[300px]">
           <h3 className="font-bold text-slate-900 mb-6">近期系统日志</h3>
           <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">数据库同步成功</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">刚刚</p>
                  </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
