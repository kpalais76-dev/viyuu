
import React from 'react';
import { FishRecord } from '../../core/types';
import { Card } from './Card';
import { RarityBadge } from './RarityBadge';
import { Scale, Ruler, Share2 } from 'lucide-react';
import { cn } from '../utils/styles';

interface FishCardProps {
  record: FishRecord;
  onClick?: () => void;
  onShare?: (e: React.MouseEvent) => void;
}

export const FishCard: React.FC<FishCardProps> = ({ record, onClick, onShare }) => {
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(e);
  };

  return (
    <Card padding="none" hoverable onClick={onClick} className="overflow-hidden group flex flex-col h-full">
      {/* Image Area */}
      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden shrink-0">
        {record.imageUrl ? (
          <img 
            src={record.imageUrl} 
            alt={record.species} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
             </svg>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <RarityBadge rarity={record.rarity} />
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
          {record.species}
        </h4>
        
        <div className="mt-3 flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1.5">
            <Ruler size={14} className="text-slate-300" />
            <span className="text-xs font-medium">{record.length} cm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Scale size={14} className="text-slate-300" />
            <span className="text-xs font-medium">{record.weight} kg</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
          {new Date(record.timestamp).toLocaleDateString()}
        </span>
        <button 
          onClick={handleShareClick}
          className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-xs font-bold px-2 py-1 -mr-2 rounded-lg hover:bg-blue-50"
        >
          <Share2 size={14} />
          <span>分享</span>
        </button>
      </div>
    </Card>
  );
};
