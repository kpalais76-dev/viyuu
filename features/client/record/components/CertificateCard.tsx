
import React from 'react';
import { 
  Ruler, 
  Scale, 
  MapPin, 
  Cloud, 
  Backpack, 
  Navigation,
  Wind,
  Anchor,
  Zap,
  Box,
  CircleDot
} from 'lucide-react';
import { FishRecord, User } from '../../../../core/types';
import { cn } from '../../../../shared/utils/styles';

interface CertificateCardProps {
  record: FishRecord;
  user: User | null;
  className?: string;
  showStamp?: boolean;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ record, user, className, showStamp = true }) => {
  const mockHash = `SBT-${record.id.toUpperCase()}-${record.timestamp.toString(16).toUpperCase()}`;

  return (
    <div 
      id="capture-area" 
      className={cn(
        "relative bg-white shadow-2xl overflow-hidden flex flex-col border border-slate-200",
        className
      )}
      style={{ fontFamily: 'ui-serif, Georgia, serif' }}
    >
      {/* 1. Golden Frame & Main Image */}
      <div className="p-4 sm:p-6 bg-slate-900">
        <div className="relative aspect-square w-full border-[3px] border-[#D4AF37] p-1.5 bg-black overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          {/* Inner Gold Border */}
          <div className="w-full h-full border border-[#D4AF37]/50 relative overflow-hidden">
            <img 
              src={record.imageUrl} 
              alt={record.species} 
              className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" 
            />
            
            {/* Red Distressed Seal (2x2 Layout: 知渔见证) */}
            {showStamp && (
              <div className="absolute bottom-4 right-4 animate-in zoom-in-150 bounce-in duration-700 pointer-events-none drop-shadow-lg">
                <div className="w-20 h-20 border-[4px] border-red-700 p-1 flex items-center justify-center bg-red-600/10 backdrop-blur-[0.5px] rotate-[-8deg]">
                   <div className="grid grid-cols-2 gap-0 font-black text-red-700 leading-none text-center h-full w-full">
                      {/* Left Column: 见, 证 */}
                      <div className="flex flex-col border-r-2 border-red-700">
                        <div className="h-1/2 flex items-center justify-center border-b-2 border-red-700 text-xl">见</div>
                        <div className="h-1/2 flex items-center justify-center text-xl">证</div>
                      </div>
                      {/* Right Column: 知, 渔 */}
                      <div className="flex flex-col">
                        <div className="h-1/2 flex items-center justify-center border-b-2 border-red-700 text-xl">知</div>
                        <div className="h-1/2 flex items-center justify-center text-xl">渔</div>
                      </div>
                   </div>
                </div>
                {/* Distress Effect Overlays */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-30 mix-blend-screen pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SBT Identity & Title */}
      <div className="pt-6 pb-2 px-8 text-center bg-white">
        <p className="text-[10px] font-mono text-slate-400 tracking-[0.2em] uppercase font-bold">
          Digital Authenticated Record
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-900 tracking-tight leading-none italic">
          {record.species}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2">
           <div className="h-px w-8 bg-slate-200" />
           <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">Master Angler Collection</span>
           <div className="h-px w-8 bg-slate-200" />
        </div>
      </div>

      {/* 3. Data Grid */}
      <div className="px-8 py-6 bg-white flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-slate-50 pb-6">
          <DataPoint icon={Scale} label="Weight" value={`${record.weight}kg`} />
          <DataPoint icon={Ruler} label="Length" value={`${record.length}cm`} />
          <DataPoint icon={MapPin} label="Location" value={record.spotName} />
          <DataPoint icon={Cloud} label="Enviro" value={`${record.manualWeather || '晴朗'} / ${record.exifData.pressure}hPa`} />
        </div>

        {/* 4. Gear loadout 2x2 Grid (Updated with Lure/Bait) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Zap size={10} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Deployment Loadout</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <GearItem icon={Anchor} label="竿 Rod" value={record.gearSnapshot.rod} />
            <GearItem icon={Navigation} label="轮 Reel" value={record.gearSnapshot.reel || '--'} />
            <GearItem icon={Wind} label="线 Line" value={record.gearSnapshot.line} />
            <GearItem icon={CircleDot} label="饵 Lure/Bait" value={record.gearSnapshot.hook || '--'} />
          </div>
        </div>
      </div>

      {/* 5. Signature Footer */}
      <div className="mx-8 pt-6 border-t border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-50 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center grayscale contrast-125">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt="ID" />
            ) : (
              <span className="text-lg font-black text-slate-200">{user?.name?.[0]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Angler Identity</span>
            <span className="text-xs font-black text-slate-900 uppercase">{user?.name}</span>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 block">Recorded On</span>
          <span className="text-[10px] font-bold text-slate-500 font-mono">
            {new Date(record.timestamp).toLocaleDateString().replace(/\//g, '.')}
          </span>
        </div>
      </div>

      {/* 6. Absolute Bottom: SBT Description & Hash */}
      <div className="pt-8 pb-10 px-8 text-center bg-white space-y-3">
        <p className="text-[10px] font-serif text-slate-400 leading-relaxed max-w-[280px] mx-auto italic">
          此SBT由知渔基于您的唯一数字身份与当前环境参数生成，永久铭刻，不可篡改，独一无二。
        </p>
        <p className="text-[9px] font-mono text-slate-300 select-all tracking-[0.1em] border-t border-slate-50 pt-3">
          {mockHash}
        </p>
      </div>

      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
    </div>
  );
};

const DataPoint = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex flex-col gap-0.5">
    <div className="flex items-center gap-1 text-slate-300">
      <Icon size={10} strokeWidth={2.5} />
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-xs font-bold text-slate-800 truncate">{value}</p>
  </div>
);

const GearItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100 min-w-0 transition-colors hover:bg-slate-100">
    <div className="p-1.5 bg-white rounded shadow-sm text-slate-400 shrink-0">
      <Icon size={12} />
    </div>
    <div className="min-w-0">
      <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</p>
      <p className="text-[10px] font-bold text-slate-700 truncate leading-tight mt-0.5">{value}</p>
    </div>
  </div>
);
