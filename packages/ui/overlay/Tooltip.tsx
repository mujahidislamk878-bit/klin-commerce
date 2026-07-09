"use client";

import { forwardRef, type ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn";

// ── Types ──

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipAlign = "start" | "center" | "end";
type TooltipVariant = "default" | "dark" | "light";

export interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  delayDuration?: number;
  variant?: TooltipVariant;
  className?: string;
}

// ── Variant styles ──

const variantClasses: Record<TooltipVariant, string> = {
  default: "bg-foreground text-background",
  dark: "bg-gray-950 text-white",
  light: "bg-white text-gray-950 border shadow-md",
};

// ── Component ──

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      side = "top",
      align = "center",
      delayDuration = 700,
      variant = "default",
      className,
    },
    ref,
  ) => {
    if (!content) {
      return <>{children}</>;
    }

    return (
      <TooltipPrimitive.Provider delayDuration={delayDuration}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            {children}
          </TooltipPrimitive.Trigger>

          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              ref={ref}
              side={side}
              align={align}
              sideOffset={5}
              className={cn(
                "z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs font-medium shadow-md",
                "animate-in fade-in-0 zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                "data-[side=bottom]:slide-in-from-top-1",
                "data-[side=left]:slide-in-from-right-1",
                "data-[side=right]:slide-in-from-left-1",
                "data-[side=top]:slide-in-from-bottom-1",
                variantClasses[variant],
                className,
              )}
            >
              {content}
              <TooltipPrimitive.Arrow
                className={cn(
                  "fill-current",
                  variant === "dark" && "text-gray-950",
                  variant === "light" && "text-white",
                  variant === "default" && "text-foreground",
                )}
              />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  },
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
export default Tooltip;
