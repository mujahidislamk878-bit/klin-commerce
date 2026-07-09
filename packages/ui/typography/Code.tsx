"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface CodeProps extends EditableProps, HTMLAttributes<HTMLPreElement> {
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
}

export interface InlineCodeProps extends EditableProps, HTMLAttributes<HTMLElement> {}

const Code = forwardRef<HTMLPreElement, CodeProps>(
  ({ children, code, language, showLineNumbers, className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-lg bg-[#0F1020] p-4 text-xs font-mono text-[#F6F7FB] border border-[#0F1020]/10",
          className
        )}
        {...props}
      >
        <code className={language ? `language-${language}` : undefined}>
          {code || children}
        </code>
      </pre>
    );
  }
);

Code.displayName = "Code";

const InlineCode = forwardRef<HTMLElement, InlineCodeProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          "rounded bg-[#0F1020]/5 px-1.5 py-0.5 text-xs font-mono text-[#0F1020]/90",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);

InlineCode.displayName = "InlineCode";

export default Code;
export { Code, InlineCode };
