
import React from 'react';
import { cn } from '../utils/styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none transition-all',
          'placeholder:text-slate-400',
          'focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500',
          error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
