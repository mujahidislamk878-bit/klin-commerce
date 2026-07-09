"use client";

import { forwardRef, type BlockquoteHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface BlockquoteProps extends EditableProps, BlockquoteHTMLAttributes<HTMLQuoteElement> {
  cite?: string;
  author?: string;
  role?: string;
}

const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ children, cite, author, role, className, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        cite={cite}
        className={cn(
          "border-l-4 border-primary pl-6 my-6 italic text-[#0F1020]/80 text-base md:text-lg",
          className
        )}
        {...props}
      >
        <p className="mb-2">{children}</p>
        {(author || role) && (
          <cite className="not-italic text-sm font-semibold text-[#0F1020]/60 block mt-2">
            — {author}
            {role && <span className="font-normal text-[#0F1020]/40">, {role}</span>}
          </cite>
        )}
      </blockquote>
    );
  }
);

Blockquote.displayName = "Blockquote";
export default Blockquote;
export { Blockquote };
