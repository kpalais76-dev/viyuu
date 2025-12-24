
import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Share2, 
  Download,
  Image as ImageIcon,
  FolderPlus
} from 'lucide-react';
import { Button } from '../../../../shared/ui';
import { FishRecord } from '../../../../core/types';
import AuthService from '../../../../core/auth';
import { CertificateCard } from './CertificateCard';

interface SBTSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FishRecord | null;
}

export const SBTSuccessModal: React.FC<SBTSuccessModalProps> = ({ isOpen, onClose, record }) => {
  const [copied, setCopied] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowStamp(true), 600);
      return () => {
        clearTimeout(timer);
        setShowStamp(false);
      };
    }
  }, [isOpen]);

  if (!isOpen || !record) return null;

  const handleShare = () => {
    alert('正在生成高分辨率分享图片...');
  };

  const handleLocalSave = () => {
    alert('正在保存图片到本地相册...');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      {/* Scrollable Container for the Card */}
      <div className="relative w-full max-w-sm h-full flex flex-col items-center justify-start pt-6 pb-32 overflow-y-auto no-scrollbar">
        
        {/* Certificate Card (WYSIWYG) */}
        <div className="w-full transform transition-all duration-700 animate-in zoom-in-95 fade-in slide-in-from-bottom-8">
          <CertificateCard 
            record={record} 
            user={user} 
            showStamp={showStamp} 
          />
        </div>

        {/* Explanatory Note */}
        <div className="mt-8 px-4 text-center space-y-2 opacity-50 animate-in fade-in duration-1000 delay-500">
           <p className="text-[10px] text-white font-black uppercase tracking-[0.3em]">
             SBT-Protocol Verification
           </p>
           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
             该渔获记录已通过潮汐、气压及地理坐标交叉存证。<br/>
             知渔协议已将此数据永久哈希映射至您的账户展厅。
           </p>
        </div>
      </div>

      {/* FIXED ACTION BAR (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent z-[110] flex flex-col gap-3 animate-in slide-in-from-bottom-full duration-500 delay-200">
         <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="rounded-2xl py-6 bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-3 font-black"
              onClick={handleShare}
            >
              <Share2 size={20} className="text-blue-400" />
              分享图片
            </Button>
            <Button 
              variant="outline"
              onClick={handleLocalSave} 
              className="rounded-2xl py-6 bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-3 font-black"
            >
              <ImageIcon size={20} className="text-emerald-400" />
              存至本地
            </Button>
         </div>
         <Button 
           onClick={onClose} 
           className="w-full rounded-2xl py-6 bg-white text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.2)] font-black text-lg flex items-center justify-center gap-3 active:scale-95"
         >
           <FolderPlus size={22} />
           放入陈列馆
         </Button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-in {
          0% { transform: scale(3) rotate(-30deg); opacity: 0; filter: blur(4px); }
          50% { transform: scale(0.8) rotate(-10deg); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
        .bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};
