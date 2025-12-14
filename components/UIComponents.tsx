import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destruct' | 'ghost';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false,
  isLoading = false
}) => {
  const baseStyle = "font-semibold rounded-xl px-4 py-3 active:scale-95 transition-transform duration-100 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-ios-blue text-white shadow-sm active:bg-blue-600 disabled:bg-blue-300",
    secondary: "bg-gray-200 text-black active:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
    destruct: "bg-white text-ios-red border border-ios-red active:bg-red-50",
    ghost: "bg-transparent text-ios-blue active:bg-gray-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  label
}) => (
  <div className="flex flex-col gap-2 mb-4">
    {label && <label className="text-sm font-medium text-gray-500 ml-1">{label}</label>}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-gray-100 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue/50 transition-all placeholder:text-gray-400"
    />
  </div>
);

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  label,
  rows = 4
}) => (
  <div className="flex flex-col gap-2 mb-4">
    {label && <label className="text-sm font-medium text-gray-500 ml-1">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="bg-gray-100 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue/50 transition-all placeholder:text-gray-400 resize-none"
    />
  </div>
);

interface TagProps {
  text: string;
}

export const Tag: React.FC<TagProps> = ({ text }) => (
  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium mr-2">
    #{text}
  </span>
);
