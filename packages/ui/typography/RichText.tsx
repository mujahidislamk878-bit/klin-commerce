"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface RichTextProps extends EditableProps, HTMLAttributes<HTMLDivElement> {
  html?: string;
}

const RichText = forwardRef<HTMLDivElement, RichTextProps>(
  ({ children, html, className, ...props }, ref) => {
    if (html) {
      return (
        <div
          ref={ref}
          className={cn("prose max-w-none text-[#0F1020]/85", className)}
          dangerouslySetInnerHTML={{ __html: html }}
          {...props}
        />
      );
    }

    return (
      <div ref={ref} className={cn("prose max-w-none text-[#0F1020]/85", className)} {...props}>
        {children}
      </div>
    );
  }
);

RichText.displayName = "RichText";
export default RichText;
export { RichText };
