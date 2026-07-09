"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { AvatarProps } from "../../types";

// ── Maps ──

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
} as const;

const radiusMap = {
  full: "rounded-full",
  md: "rounded-md",
  lg: "rounded-lg",
} as const;

const bgColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-orange-500",
];

// ── Helpers ──

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
}

// ── Component ──

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = "",
      name,
      size = "md",
      radius = "full",
      fallback,
      ...props
    },
    ref,
  ) => {
    const initials = fallback || (name ? getInitials(name) : "?");
    const bgColor = name ? getColorFromName(name) : "bg-muted text-muted-foreground";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center shrink-0 overflow-hidden",
          sizeMap[size],
          radiusMap[radius],
          !src && cn(bgColor, "text-white font-medium"),
          className,
        )}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || ""}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="select-none leading-none">{initials}</span>
        )}
      </motion.div>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar };
export default Avatar;
