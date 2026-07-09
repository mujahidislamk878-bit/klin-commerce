"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { TextareaProps } from "../../types";
import { FormFieldWrapper } from "./FormFieldWrapper";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      placeholder,
      required,
      disabled,
      error,
      hint,
      rows = 4,
      maxLength,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <FormFieldWrapper
        label={label}
        required={required}
        error={error}
        hint={hint}
        id={inputId}
        className={className}
      >
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
            error && "border-destructive",
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
      </FormFieldWrapper>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;