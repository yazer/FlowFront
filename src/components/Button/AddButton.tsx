import React from 'react';

interface ButtonProps {
  bgColor?: string;        // Background color
  textColor?: string;      // Text color
  size?: 'small' | 'medium' | 'large'; // Size options
  children: React.ReactNode; // Button content
  onClick?: () => void;     // Click handler
  type?: "button" | "submit" | "reset"; // Button type
  disabled?: boolean;       // Disabled state
  className?: string;       // Additional classes
}

export function Button({
  bgColor = 'bg-blue-700',    // Default background color
  textColor = 'text-white',    // Default text color
  size = 'medium',              // Default size
  onClick,
  children,
  type = "button",
  disabled = false,
  className = '',              // Default empty class name
}: ButtonProps) {
  // Size classes
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-2 text-base',
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`${sizeClasses[size]} font-medium text-center rounded-lg focus:ring-4 focus:outline-none ${bgColor} ${textColor} ${className} ${disabled ? 'bg-gray-500' : 'hover:bg-blue-800'}`}
    >
      {children}
    </button>
  );
}
