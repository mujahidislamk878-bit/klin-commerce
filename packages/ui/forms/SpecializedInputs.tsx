"use client";

import { forwardRef, useState, useRef } from "react";
import { Star } from "lucide-react";
import { cn } from "../../utils/cn";
import { FormFieldWrapper } from "./FormFieldWrapper";
import type { EditableProps } from "../../types";

export interface SpecializedInputProps extends EditableProps {
  label?: string;
  error?: string;
  required?: boolean;
}

const OTPInput = forwardRef<HTMLDivElement, SpecializedInputProps & { length?: number; onChange?: (code: string) => void }>(
  ({ label, error, required, length = 6, onChange, className, ...props }, ref) => {
    const [vals, setVals] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (val: string, idx: number) => {
      const copy = [...vals];
      copy[idx] = val.slice(-1);
      setVals(copy);
      onChange?.(copy.join(""));

      // Shift focus
      if (val && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === "Backspace" && !vals[idx] && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    };

    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div ref={ref} className="flex gap-2 justify-between" {...props}>
          {Array(length)
            .fill(0)
            .map((_, idx) => (
              <input
                key={idx}
                ref={(el) => { inputsRef.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={vals[idx]}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-11 h-11 text-center font-bold text-lg border border-[#0F1020]/10 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1020]/5 focus:border-[#0F1020]/25 transition"
              />
            ))}
        </div>
      </FormFieldWrapper>
    );
  }
);
OTPInput.displayName = "OTPInput";

const PhoneInput = forwardRef<HTMLInputElement, SpecializedInputProps & { value?: string; onChange?: (val: string) => void }>(
  ({ label, error, required, value = "", onChange, className, ...props }, ref) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const clean = e.target.value.replace(/\D/g, "");
      // simple format: (123) 456-7890
      let formatted = clean;
      if (clean.length > 3 && clean.length <= 6) {
        formatted = `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
      } else if (clean.length > 6) {
        formatted = `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
      }
      onChange?.(formatted);
    };

    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <input
          type="tel"
          ref={ref}
          value={value}
          onChange={handlePhoneChange}
          placeholder="(123) 456-7890"
          className="w-full px-4 rounded-xl border border-[#0F1020]/10 bg-white h-11 text-sm text-[#0F1020] focus:outline-none focus:ring-2 focus:ring-[#0F1020]/5 focus:border-[#0F1020]/25 transition duration-300 placeholder:text-[#0F1020]/25"
          {...props}
        />
      </FormFieldWrapper>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

const RatingInput = forwardRef<HTMLDivElement, SpecializedInputProps & { value?: number; onChange?: (val: number) => void }>(
  ({ label, error, required, value = 0, onChange, className, ...props }, ref) => {
    const [hovered, setHovered] = useState<number | null>(null);
    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div ref={ref} className="flex gap-1.5 py-1" {...props}>
          {[1, 2, 3, 4, 5].map((star) => {
            const active = hovered !== null ? star <= hovered : star <= value;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onChange?.(star)}
                className="text-[#0F1020]/10 transition hover:scale-110"
              >
                <Star className={cn("h-6 w-6", active ? "text-amber-400 fill-amber-400" : "text-[#0F1020]/15")} />
              </button>
            );
          })}
        </div>
      </FormFieldWrapper>
    );
  }
);
RatingInput.displayName = "RatingInput";

export { OTPInput, PhoneInput, RatingInput };
