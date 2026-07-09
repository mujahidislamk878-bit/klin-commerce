"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface AnchorProps extends EditableProps {
  anchorId: string;
}

const Anchor = forwardRef<HTMLDivElement, AnchorProps>(
  ({ anchorId, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={anchorId}
        className={cn("scroll-mt-20 w-full h-0", className)}
        {...props}
      />
    );
  }
);

Anchor.displayName = "Anchor";
export default Anchor;
export { Anchor };
