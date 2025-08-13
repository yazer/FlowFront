interface ButtonPros {
  bgColor?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  small: "px-2 py-1 text-xs",
  medium: "px-3 py-2 text-sm",
  large: "px-5 py-3 text-base",
};

export function Button({
  size = "medium",
  onClick,
  children,
  type = "button",
  disabled = false,
  className,
}: ButtonPros) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`
        ${sizeClasses[size]}
        font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300
        ${className}
        ${disabled ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"}
      `}
    >
      {children}
    </button>
  );
}
