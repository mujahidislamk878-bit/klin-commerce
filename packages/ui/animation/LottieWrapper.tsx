"use client";

import { forwardRef } from "react";
import { Play } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface LottieWrapperProps extends EditableProps {
  src?: string;
  autoplay?: boolean;
  loop?: boolean;
}

const LottieWrapper = forwardRef<HTMLDivElement, LottieWrapperProps>(
  ({ src, autoplay = true, loop = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-[#FAFBFC] border border-[#0F1020]/5 flex items-center justify-center min-h-[150px] p-6 text-center",
          className
        )}
        {...props}
      >
        <div className="space-y-2">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
            <Play className="h-4 w-4 fill-current" />
          </div>
          <span className="block text-xs font-bold text-[#0F1020]/45 uppercase tracking-wider">Lottie Animation</span>
          <span className="block text-[10px] text-[#0F1020]/35 font-mono max-w-[200px] truncate">{src || "No source JSON specified"}</span>
        </div>
      </div>
    );
  }
);

LottieWrapper.displayName = "LottieWrapper";
export default LottieWrapper;
export { LottieWrapper };
