"use client";

import { forwardRef } from "react";
import { Calendar, Clock, Pipette } from "lucide-react";
import { cn } from "../../utils/cn";
import { FormFieldWrapper } from "./FormFieldWrapper";
import type { EditableProps } from "../../types";

export interface PickerProps extends EditableProps {
  label?: string;
  error?: string;
  required?: boolean;
}

const ColorPicker = forwardRef<HTMLInputElement, PickerProps & { value?: string; onChange?: (val: string) => void }>(
  ({ label, error, required, value = "#0F1020", onChange, className, ...props }, ref) => {
    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div className="relative flex items-center gap-3 px-4 rounded-xl border border-[#0F1020]/10 bg-white h-11 focus-within:ring-2 focus-within:ring-[#0F1020]/5 focus-within:border-[#0F1020]/25 transition duration-300">
          <Pipette className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
          <input
            type="color"
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-8 h-6 border-0 p-0 rounded cursor-pointer bg-transparent"
            {...props}
          />
          <span className="text-sm font-mono text-[#0F1020]/75 uppercase">{value}</span>
        </div>
      </FormFieldWrapper>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

const DatePicker = forwardRef<HTMLInputElement, PickerProps & { value?: string; onChange?: (val: string) => void }>(
  ({ label, error, required, value, onChange, className, ...props }, ref) => {
    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div className="relative flex items-center gap-3 px-4 rounded-xl border border-[#0F1020]/10 bg-white h-11 focus-within:ring-2 focus-within:ring-[#0F1020]/5 focus-within:border-[#0F1020]/25 transition duration-300">
          <Calendar className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
          <input
            type="date"
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-sm text-[#0F1020] focus:outline-none cursor-pointer"
            {...props}
          />
        </div>
      </FormFieldWrapper>
    );
  }
);
DatePicker.displayName = "DatePicker";

const TimePicker = forwardRef<HTMLInputElement, PickerProps & { value?: string; onChange?: (val: string) => void }>(
  ({ label, error, required, value, onChange, className, ...props }, ref) => {
    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div className="relative flex items-center gap-3 px-4 rounded-xl border border-[#0F1020]/10 bg-white h-11 focus-within:ring-2 focus-within:ring-[#0F1020]/5 focus-within:border-[#0F1020]/25 transition duration-300">
          <Clock className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
          <input
            type="time"
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-sm text-[#0F1020] focus:outline-none cursor-pointer"
            {...props}
          />
        </div>
      </FormFieldWrapper>
    );
  }
);
TimePicker.displayName = "TimePicker";

export { ColorPicker, DatePicker, TimePicker };
