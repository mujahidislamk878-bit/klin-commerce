"use client";

import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface LabelProps extends EditableProps, LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, htmlFor, required, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "text-sm font-medium leading-none text-[#0F1020]/75 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";
export default Label;
export { Label };
