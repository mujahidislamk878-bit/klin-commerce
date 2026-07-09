"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "rectangular", width, height, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-[#0F1020]/5",
          variant === "text" && "h-3.5 w-full rounded-md",
          variant === "circular" && "rounded-full shrink-0",
          variant === "rectangular" && "rounded-2xl",
          className
        )}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
export default Skeleton;
export { Skeleton };
