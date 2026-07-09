"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";
import type { InputProps } from "../../types";
import { FormFieldWrapper } from "./FormFieldWrapper";

const sizeMap: Record<string, string> = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
  xl: "h-14 px-5 text-lg",
};

const iconPaddingMap: Record<string, { left: string; right: string }> = {
  xs: { left: "pl-6", right: "pr-6" },
  sm: { left: "pl-7", right: "pr-7" },
  md: { left: "pl-9", right: "pr-9" },
  lg: { left: "pl-11", right: "pr-11" },
  xl: { left: "pl-13", right: "pr-13" },
};

const iconSizeMap: Record<string, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      type = "text",
      required,
      disabled,
      error,
      hint,
      icon,
      iconPosition = "left",
      size = "md",
      radius,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    const radiusClass = radius
      ? radius === "none"
        ? "rounded-none"
        : `rounded-${radius}`
      : "rounded-md";

    return (
      <FormFieldWrapper
        label={label}
        required={required}
        error={error}
        hint={hint}
        id={inputId}
        className={className}
      >
        <div className="relative">
          {icon && iconPosition === "left" && (
            <span
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none",
                size === "sm" ? "pl-2.5" : size === "lg" ? "pl-3.5" : "pl-3",
              )}
            >
              <span
                className={cn(
                  iconSizeMap[size],
                  "shrink-0",
                )}
              >
                {icon}
              </span>
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={cn(
              "flex w-full border border-input bg-transparent py-2 ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              sizeMap[size],
              radiusClass,
              error && "border-destructive",
              icon && iconPosition === "left" && iconPaddingMap[size].left,
              icon && iconPosition === "right" && iconPaddingMap[size].right,
              isPassword && "pr-10",
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                size === "sm" ? "pr-2.5" : size === "lg" ? "pr-3.5" : "pr-3",
              )}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className={cn(iconSizeMap[size], "shrink-0")} />
              ) : (
                <Eye className={cn(iconSizeMap[size], "shrink-0")} />
              )}
            </button>
          )}

          {icon && iconPosition === "right" && !isPassword && (
            <span
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none",
                size === "sm" ? "pr-2.5" : size === "lg" ? "pr-3.5" : "pr-3",
              )}
            >
              <span className={cn(iconSizeMap[size], "shrink-0")}>
                {icon}
              </span>
            </span>
          )}
        </div>
      </FormFieldWrapper>
    );
  },
);

Input.displayName = "Input";

export { Input };
export default Input;