"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface TiltCardProps extends EditableProps {
  children?: ReactNode;
  maxTilt?: number;
}

const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(
  ({ children, maxTilt = 15, className, ...props }, ref) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const rX = ((yc - y) / yc) * maxTilt;
      const rY = ((x - xc) / xc) * maxTilt;
      setRotateX(rX);
      setRotateY(rY);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("transition-transform duration-200 ease-out select-none", className)}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TiltCard.displayName = "TiltCard";
export default TiltCard;
export { TiltCard };
