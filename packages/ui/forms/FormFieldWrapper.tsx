"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import type { FormFieldWrapperProps } from "../../types";
import { Label } from "@radix-ui/react-label";

const FormFieldWrapper = forwardRef<HTMLDivElement, FormFieldWrapperProps>(
  ({ label, required, error, hint, children, className, id }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1.5", className)}
        id={id}
      >
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              !label && "sr-only",
            )}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        )}
        {children}
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  },
);

FormFieldWrapper.displayName = "FormFieldWrapper";

export { FormFieldWrapper };
export default FormFieldWrapper;