"use client";

import { forwardRef, useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface RippleProps extends EditableProps {
  color?: string;
}

const Ripple = forwardRef<HTMLDivElement, RippleProps>(
  ({ color = "rgba(15,16,32,0.15)", className, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

    const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, newRipple]);
    };

    useEffect(() => {
      if (ripples.length > 0) {
        const timer = setTimeout(() => {
          setRipples((prev) => prev.slice(1));
        }, 800);
        return () => clearTimeout(timer);
      }
    }, [ripples]);

    return (
      <div
        ref={ref}
        onClick={addRipple}
        className={cn("absolute inset-0 w-full h-full overflow-hidden pointer-events-auto z-0 cursor-pointer", className)}
        {...props}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none animate-ripple bg-neutral-900/10"
            style={{
              width: `${r.size}px`,
              height: `${r.size}px`,
              left: `${r.x}px`,
              top: `${r.y}px`,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    );
  }
);

Ripple.displayName = "Ripple";
export default Ripple;
export { Ripple };
