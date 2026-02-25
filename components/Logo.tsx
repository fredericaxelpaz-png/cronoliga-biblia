import React from 'react';
import { BookOpen, Cross, Sun } from 'lucide-react';
import clsx from 'clsx';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md', variant = 'light' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 40
  };

  return (
    <div className={clsx("flex flex-col items-center", className)}>
      <div className={clsx(
        "relative rounded-full flex items-center justify-center border-2 shadow-sm",
        sizeClasses[size],
        variant === 'light' 
          ? "bg-sacred-50 border-sacred-300 text-sacred-600" 
          : "bg-sacred-800 border-sacred-600 text-sacred-200"
      )}>
        <BookOpen size={iconSizes[size]} strokeWidth={1.5} className="absolute" />
        <Cross size={iconSizes[size] * 0.6} strokeWidth={2} className="absolute -top-1 opacity-80" />
      </div>
      {size !== 'sm' && (
        <div className="mt-2 text-center">
          <h1 className={clsx(
            "font-display font-bold tracking-wide",
            size === 'lg' ? "text-2xl" : "text-lg",
            variant === 'light' ? "text-sacred-900" : "text-sacred-100"
          )}>
            Guía Bíblica
          </h1>
          <p className={clsx(
            "font-sans italic text-xs tracking-wider opacity-80",
            variant === 'light' ? "text-sacred-700" : "text-sacred-300"
          )}>
            Luz y Verdad
          </p>
        </div>
      )}
    </div>
  );
};
