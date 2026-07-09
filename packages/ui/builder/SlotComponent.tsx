"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface SlotProps extends EditableProps {
  children?: ReactNode;
  name?: string;
}

const SlotComponent = forwardRef<HTMLDivElement, SlotProps>(
  ({ children, name = "Content Slot", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-dashed border-[#0F1020]/10 p-4 min-h-[50px] relative bg-white/50",
          className
        )}
        {...props}
      >
        <div className="absolute top-1 right-2 text-[9px] uppercase font-bold text-[#0F1020]/20 select-none">
          {name}
        </div>
        {children}
      </div>
    );
  }
);

SlotComponent.displayName = "SlotComponent";

const CanvasContainer = forwardRef<HTMLDivElement, SlotProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CanvasContainer.displayName = "CanvasContainer";

export { SlotComponent, CanvasContainer };
