import { cn } from "../main";

interface ButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "success" | "primary" | "secondary";
}

function Button({
  isLoading = false,
  isDisabled = false,
  onClick,
  children = "Save",
  className = "",
  size = "md",
  variant = "success",
}: ButtonProps) {
  const disabled = isDisabled || isLoading;

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
  };

  const variantClasses = {
    success: disabled
      ? "opacity-50 border"
      : "bg-green-400 hover:bg-green-300 border-green-500",
    primary: disabled
      ? "opacity-50 border"
      : "bg-blue-400 hover:bg-blue-300 border-blue-500",
    secondary: disabled
      ? "opacity-50 border"
      : "bg-gray-400 hover:bg-gray-300 border-gray-500",
  };

  return (
    <button
      className={cn(
        "rounded border transition-colors duration-200",
        sizeClasses[size],
        variantClasses[variant],
        disabled ? "" : "cursor-pointer",
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⟳</span>
          Saving...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
