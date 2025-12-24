
import React, { useState } from 'react';
import { Send, History, Megaphone, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, Button, Input } from '../../shared/ui';
import DB from '../../core/db';
import EventBus from '../../core/bus';
import { AppEvent, SystemMessage } from '../../core/types';

const MessagesPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    const newMessage: SystemMessage = {
      id: `m_${Date.now()}`,
      title,
      content,
      type,
      createdAt: Date.now(),
      isRead: false
    };

    try {
      await DB.create(DB.COLLECTIONS.MESSAGES, newMessage);
      EventBus.emit(AppEvent.NEW_SYSTEM_MSG, newMessage);
      
      // Reset form
      setTitle('');
      setContent('');
      alert('全服广播发送成功！');
    } catch (error) {
      console.error('Failed to broadcast message:', error);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    info: '常规信息',
    warning: '紧急警报',
    success: '成功通知',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">全服广播</h2>
        <p className="text-slate-500 font-medium">向所有在线钓手发送实时系统公告。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Megaphone size={20} />
               </div>
               <h3 className="text-lg font-bold text-slate-900">撰写新广播</h3>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="公告标题" 
                  placeholder="例如：系统维护公告" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">消息类型</label>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                     {(['info', 'warning', 'success'] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {t === 'info' && <Info size={14} />}
                          {t === 'warning' && <AlertTriangle size={14} />}
                          {t === 'success' && <CheckCircle size={14} />}
                          <span className="capitalize">{labels[t]}</span>
                        </button>
                     ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">内容详情</label>
                <textarea 
                  className="w-full h-40 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-slate-400 text-sm"
                  placeholder="在此输入详细的公告内容..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  className="px-10 h-12 text-base shadow-blue-200"
                  isLoading={loading}
                >
                  <Send size={18} className="mr-2" /> 立即发布
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm p-6 bg-slate-900 text-white">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <History size={14} /> 发布历史
              </h4>
              <div className="space-y-4">
                 {[1, 2].map(i => (
                   <div key={i} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-blue-400">#广播_293</span>
                        <span className="text-[10px] font-black text-slate-500">2小时前</span>
                      </div>
                      <p className="text-sm font-bold truncate">全站服务器扩容成功</p>
                      <p className="text-[10px] text-slate-400 mt-1">状态：已推送到 2,400+ 位钓手</p>
                   </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 rounded-xl">
                 全量审计日志
              </Button>
           </Card>

           <Card className="p-6 border-none shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <AlertTriangle size={18} />
                 </div>
                 <h4 className="font-bold text-slate-900">发布守则</h4>
              </div>
              <ul className="text-xs text-slate-500 space-y-3 list-disc pl-4 leading-relaxed">
                <li>广播消息一经发布无法撤回，请反复检查。</li>
                <li>内容请尽量保持简洁，适配移动端屏幕展示。</li>
                <li>仅在系统重大更新或停机时使用“紧急警报”类型。</li>
              </ul>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
