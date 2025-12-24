
import React, { useState, useEffect } from 'react';
import { Mail, Bell, CheckCircle2, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { Card } from '../../shared/ui';
import { SystemMessage, AppEvent } from '../../core/types';
import DB from '../../core/db';
import EventBus from '../../core/bus';

const InboxPage: React.FC = () => {
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const loadMessages = async () => {
    const all = await DB.findAll<SystemMessage>(DB.COLLECTIONS.MESSAGES);
    setMessages(all.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadMessages();

    const unsubscribe = EventBus.on(AppEvent.NEW_SYSTEM_MSG, (msg: SystemMessage) => {
      loadMessages();
      setToast(`新系统消息：${msg.title}`);
      setTimeout(() => setToast(null), 4000);
    });

    return unsubscribe;
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 relative">
      {/* Real-time Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-300">
           <div className="bg-blue-500 p-1.5 rounded-lg">
             <Bell size={16} />
           </div>
           <p className="text-xs font-bold flex-1">{toast}</p>
        </div>
      )}

      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">收件箱</h2>
          <p className="text-slate-500 text-sm font-medium">系统通知与公告。</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Mail size={24} />
        </div>
      </header>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Mail size={40} className="text-slate-100 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">暂无消息</p>
          </div>
        ) : (
          messages.map(msg => (
            <Card key={msg.id} className="p-5 border-none shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="flex gap-4 items-start">
                <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all`}>
                  {getTypeIcon(msg.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 text-sm">{msg.title}</h3>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{msg.content}</p>
                </div>
              </div>
              {msg.type === 'success' && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 opacity-10 rounded-full translate-x-1/2 -translate-y-1/2" />
              )}
            </Card>
          ))
        )}
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
         <Sparkles className="mx-auto text-blue-400 mb-2" size={20} />
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">即将上线</p>
         <p className="text-xs text-slate-500 font-medium">私信功能与钓友群聊正在紧锣密鼓开发中。</p>
      </div>
    </div>
  );
};

export default InboxPage;
