import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: 'none' | 'teal' | 'emerald';
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  glow = 'none',
  bordered = true,
  className = '',
  ...props
}) => {
  const glowStyles = {
    none: '',
    teal: 'hover:shadow-glow-teal hover:border-teal-500/40',
    emerald: 'hover:shadow-glow-emerald hover:border-emerald-500/40',
  }[glow];

  const hoverStyle = hoverable ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg' : '';

  return (
    <div
      className={`rounded-xl bg-white dark:bg-cyber-bg-darkCard text-slate-900 dark:text-slate-100 ${
        bordered ? 'border border-slate-200 dark:border-white/10' : ''
      } shadow-sm ${hoverStyle} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
