import React from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0c] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-hipixel-accent hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-indigo-400/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm",
    ghost: "text-gray-400 hover:text-white bg-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-3 bg-[#0f0f12] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-hipixel-accent focus:ring-1 focus:ring-hipixel-accent transition-all duration-200 ${className}`}
    {...props}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-4 py-3 bg-[#0f0f12] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-hipixel-accent focus:ring-1 focus:ring-hipixel-accent transition-all duration-200 min-h-[120px] ${className}`}
    {...props}
  />
);

interface SelectCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectCard: React.FC<SelectCardProps> = ({ label, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      cursor-pointer px-5 py-4 rounded-lg border transition-all duration-200 flex items-center justify-between group
      ${selected 
        ? 'bg-hipixel-accent/10 border-hipixel-accent text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
        : 'bg-[#0f0f12] border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/5'}
    `}
  >
    <span className="font-medium">{label}</span>
    {selected && <Check className="w-5 h-5 text-hipixel-accent" />}
  </div>
);

export const GlassPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass-panel rounded-2xl p-6 md:p-10 ${className}`}>
    {children}
  </div>
);