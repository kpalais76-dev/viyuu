
import React from 'react';
import { Thermometer, Waves, Anchor, Navigation } from 'lucide-react';
import { ExifData } from '../../core/types';
import { cn } from '../utils/styles';

interface FishingDataBlockProps {
  data: ExifData;
  className?: string;
}

export const FishingDataBlock: React.FC<FishingDataBlockProps> = ({ data, className }) => {
  const Item = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100 group">
      <Icon size={16} className="text-slate-400 group-hover:text-blue-500 mb-1.5 transition-colors" />
      <span className="text-[10px] text-slate-400 uppercase font-medium">{label}</span>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      <Item icon={Thermometer} label="气压" value={`${data.pressure} hPa`} />
      <Item icon={Waves} label="潮汐" value={data.tide} />
      <Item icon={Anchor} label="钓点" value={data.location?.name || '未知区域'} />
    </div>
  );
};
