
import React from 'react';
import { cn } from '../utils/styles';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  // Added onClick prop to support interactive cards and fix Type error in FishCard.tsx
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  padding = 'md',
  onClick,
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-slate-200 rounded-2xl shadow-sm transition-shadow',
        hoverable && 'hover:shadow-md cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
};
