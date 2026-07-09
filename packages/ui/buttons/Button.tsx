"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { ButtonProps, ButtonVariant, ButtonSize, RoundedSize } from "../../types";

// ── Variant map ──

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
  outline:
    "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  soft: "bg-primary/10 text-primary hover:bg-primary/20",
  link: "text-primary underline-offset-4 hover:underline",
  gradient: "text-white shadow-sm",
};

// ── Size map ──

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs gap-1",
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-10 px-6 text-sm gap-2",
  lg: "h-11 px-8 text-base gap-2",
  xl: "h-12 px-10 text-base gap-2.5",
};

// ── Radius map ──

const radiusMap: Record<RoundedSize, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

// ── Badge variant map ──

const badgeVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-input bg-background text-foreground",
  ghost: "bg-muted text-muted-foreground",
  soft: "bg-primary/10 text-primary",
  link: "text-primary underline",
  gradient: "bg-gradient-to-r from-primary to-purple-600 text-white",
};

// ── Component ──

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      radius,
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = "left",
      iconOnly = false,
      href,
      target,
      rel,
      children,
      type = "button",
      gradientFrom = "#6366f1",
      gradientTo = "#8b5cf6",
      badge,
      badgeVariant = "primary",
      asChild,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    // shared content (icon + text + loader + badge)
    const content = (
      <>
        {loading && (
          <Loader2
            className="h-4 w-4 animate-spin shrink-0"
            aria-hidden="true"
          />
        )}

        {!loading && icon && iconPosition === "left" && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}

        {children && (
          <span className={cn(iconOnly && "sr-only")}>{children}</span>
        )}

        {!loading && icon && iconPosition === "right" && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}

        {badge !== undefined && badge !== null && (
          <span
            className={cn(
              "absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-semibold leading-none rounded-full pointer-events-none",
              badgeVariantClasses[badgeVariant],
            )}
          >
            {badge}
          </span>
        )}
      </>
    );

    // base class list (shared by all renders)
    const baseClasses = cn(
      // layout & reset
      "relative inline-flex items-center justify-center font-medium",
      "transition-colors duration-150 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "select-none",
      // variant
      variant !== "gradient" && variantClasses[variant],
      // size
      sizeClasses[size],
      // radius
      radius ? radiusMap[radius] : "rounded-md",
      // full
      fullWidth && "w-full",
      // icon-only squared up
      iconOnly && !children && size === "md" && "h-10 w-10 p-0",
      iconOnly && !children && size === "sm" && "h-9 w-9 p-0",
      iconOnly && !children && size === "lg" && "h-11 w-11 p-0",
      iconOnly && !children && size === "xs" && "h-8 w-8 p-0",
      iconOnly && !children && size === "xl" && "h-12 w-12 p-0",
      className,
    );

    const gradientStyle =
      variant === "gradient"
        ? { backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }
        : undefined;

    // ── asChild → Slot ───────────────────────────────────
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={baseClasses}
          style={gradientStyle}
          {...props}
        >
          {content}
        </Slot>
      );
    }

    // ── href → anchor ────────────────────────────────────
    if (href) {
      return (
        <motion.a
          ref={ref as any}
          href={href}
          target={target}
          rel={rel}
          className={baseClasses}
          style={gradientStyle}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...(props as any)}
        >
          {content}
        </motion.a>
      );
    }

    // ── Default button ───────────────────────────────────
    return (
      <motion.button
        ref={ref}
        type={type}
        className={baseClasses}
        disabled={isDisabled}
        style={gradientStyle}
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...(props as any)}
      >
        {content}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export default Button;
