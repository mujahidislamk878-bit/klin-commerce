"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface KbdProps extends EditableProps, HTMLAttributes<HTMLElement> {}

const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[#0F1020]/20 bg-[#FAFBFC] px-1.5 font-mono text-[10px] font-medium text-[#0F1020]/60 opacity-100 shadow-[0_1px_0_0px_rgba(15,16,32,0.15)]",
          className
        )}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";
export default Kbd;
export { Kbd };
