"use client";

import { forwardRef, useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface ConfettiProps extends EditableProps {
  active?: boolean;
}

const Confetti = forwardRef<HTMLDivElement, ConfettiProps>(
  ({ active = false, className, ...props }, ref) => {
    const [pieces, setPieces] = useState<{ id: number; left: number; delay: number; color: string; size: number }[]>([]);

    useEffect(() => {
      if (active) {
        const colors = ["#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#E91E63"];
        const list = Array.from({ length: 40 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 6,
        }));
        setPieces(list);
      } else {
        setPieces([]);
      }
    }, [active]);

    if (!active) return null;

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 pointer-events-none z-50 overflow-hidden", className)}
        {...props}
      >
        {pieces.map((p) => (
          <div
            key={p.id}
            className="absolute top-0 animate-confettiFall rounded-sm"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    );
  }
);

Confetti.displayName = "Confetti";
export default Confetti;
export { Confetti };
