"use client";

import { forwardRef } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface EmptyStateProps extends EditableProps {
  title?: string;
  description?: string;
  iconName?: string;
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title = "No Content Found",
      description = "Try adjusting your filters or editing this section inside the builder.",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#0F1020]/10 rounded-2xl bg-[#FAFBFC] min-h-[250px]",
          className
        )}
        {...props}
      >
        <HelpCircle className="h-10 w-10 text-[#0F1020]/30 mb-3" />
        <h3 className="text-base font-bold text-[#0F1020]">{title}</h3>
        <p className="text-xs text-[#0F1020]/50 mt-1 max-w-[280px]">{description}</p>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
export default EmptyState;
export { EmptyState };
