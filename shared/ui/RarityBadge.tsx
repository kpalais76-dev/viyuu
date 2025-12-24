
import React from 'react';
import { Rarity } from '../../core/types';
import { cn } from '../utils/styles';

interface RarityBadgeProps {
  rarity: Rarity;
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, className }) => {
  const styles = {
    Common: 'bg-slate-100 text-slate-500 border-slate-200',
    Rare: 'bg-purple-50 text-purple-600 border-purple-100',
    Legendary: 'bg-amber-50 text-amber-600 border-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.3)]',
  };

  const labels = {
    Common: '普通',
    Rare: '稀有',
    Legendary: '传说',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border',
        styles[rarity],
        className
      )}
    >
      {labels[rarity]}
    </span>
  );
};
