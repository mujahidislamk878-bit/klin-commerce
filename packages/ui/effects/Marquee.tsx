"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";

// ── Types ──

type MarqueeDirection = "left" | "right";

export interface MarqueeProps {
  children: ReactNode;
  direction?: MarqueeDirection;
  speed?: number;
  pauseOnHover?: boolean;
  duration?: number;
  className?: string;
}

// ── Inline keyframes ──

const keyframes = `
@keyframes klin-marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes klin-marquee-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
`;

// ── Component ──

const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      children,
      direction = "left",
      speed = 1,
      pauseOnHover = true,
      duration = 20,
      className,
    },
    ref,
  ) => {
    const adjustedDuration = duration / speed;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex overflow-hidden",
          pauseOnHover && "group",
          className,
        )}
      >
        <style>{keyframes}</style>

        {/* Gradient fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

        {/* Scrolling track — one container with duplicated children */}
        <div
          className="flex shrink-0 items-center gap-8"
          style={{
            animationName:
              direction === "left" ? "klin-marquee-left" : "klin-marquee-right",
            animationDuration: `${adjustedDuration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: pauseOnHover ? "running" : undefined,
            willChange: "transform",
          }}
          // pause on hover (Tailwind group-hover can't control JS animations)
          onMouseEnter={(e) => {
            if (pauseOnHover)
              (e.currentTarget as HTMLElement).style.animationPlayState =
                "paused";
          }}
          onMouseLeave={(e) => {
            if (pauseOnHover)
              (e.currentTarget as HTMLElement).style.animationPlayState =
                "running";
          }}
        >
          {children}
          {children}
        </div>
      </div>
    );
  },
);

Marquee.displayName = "Marquee";

export { Marquee };
export default Marquee;
