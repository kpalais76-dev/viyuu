
import React from 'react';
import { BarChart3, TrendingUp, Zap, Target, Waves, Wind } from 'lucide-react';
import { Card } from '../../shared/ui';

const AnalysisPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">潮汐洞察</h2>
          <p className="text-slate-500 text-sm font-medium">基于你的垂钓历史生成的 AI 分析报告。</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <BarChart3 size={24} />
        </div>
      </header>

      {/* Hero Insight */}
      <Card className="bg-blue-600 text-white border-none shadow-2xl shadow-blue-200 p-8 relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <Zap size={18} className="text-yellow-400 fill-yellow-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">检测到黄金捕获规律</span>
            </div>
            <h3 className="text-xl font-bold leading-tight mb-2">
               当气压超过 1010hPa 时，你的渔获量提升了 42%。
            </h3>
            <p className="text-blue-100 text-xs font-medium">
               根据你最近 12 次出勤记录，高气压的稳定性与上层水域掠食性鱼类的活跃度高度相关。
            </p>
         </div>
         <BarChart3 size={120} className="absolute -bottom-4 -right-4 text-blue-500/30 rotate-12" />
      </Card>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
         <Card className="p-5 border-none shadow-sm flex flex-col gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl w-fit">
               <TrendingUp size={18} />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">平均效率</div>
               <div className="text-lg font-black text-slate-900">8.4 <span className="text-xs text-slate-400">尾/时</span></div>
            </div>
         </Card>
         <Card className="p-5 border-none shadow-sm flex flex-col gap-3">
            <div className="p-2 bg-purple-50 text-purple-500 rounded-xl w-fit">
               <Target size={18} />
            </div>
            <div>
               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">目标匹配度</div>
               <div className="text-lg font-black text-slate-900">极高</div>
            </div>
         </Card>
      </div>

      {/* Storytelling Cards */}
      <section className="space-y-4">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">行为模式分析</h4>
         
         <div className="space-y-3">
            {[
               { icon: Waves, color: 'blue', text: "涨潮时段捕获的鱼类重量平均是退潮时段的 3.2 倍。" },
               { icon: Wind, color: 'amber', text: "在水质清晰度较高时，你的“软虫”饵料拥有 68% 的高咬钩率。" },
            ].map((item, i) => (
               <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm items-center">
                  <div className={`p-3 rounded-2xl bg-${item.color}-50 text-${item.color}-500`}>
                     <item.icon size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">{item.text}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Pro Tip Footer */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white text-center">
         <h5 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">钓手秘籍</h5>
         <p className="text-sm font-medium leading-relaxed italic">
           “最好的钓鱼时机，就是你正好在水边的时候。”
         </p>
      </div>
    </div>
  );
};

export default AnalysisPage;
