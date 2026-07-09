"use client";

import { forwardRef, useState } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "../../utils/cn";
import { FormFieldWrapper } from "./FormFieldWrapper";
import type { EditableProps } from "../../types";

export interface SelectorProps extends EditableProps {
  label?: string;
  error?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

const Combobox = forwardRef<HTMLDivElement, SelectorProps & { value?: string; onChange?: (val: string) => void }>(
  ({ label, error, required, options = [], value = "", onChange, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedOption = options.find((opt) => opt.value === value);
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div
          ref={ref}
          className="relative w-full"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          {...props}
        >
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 rounded-xl border border-[#0F1020]/10 bg-white h-11 text-sm text-[#0F1020] focus:outline-none focus:ring-2 focus:ring-[#0F1020]/5 focus:border-[#0F1020]/25 transition duration-300 text-left"
          >
            <span className={selectedOption ? "text-[#0F1020]" : "text-[#0F1020]/30"}>
              {selectedOption ? selectedOption.label : "Select option..."}
            </span>
            <ChevronDown className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#0F1020]/10 shadow-2xl rounded-2xl p-2 z-50 max-h-[250px] overflow-y-auto animate-scaleIn">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs border-b border-[#0F1020]/5 focus:outline-none placeholder:text-[#0F1020]/35 text-[#0F1020] bg-[#FAFBFC] rounded-lg mb-2"
              />
              <ul className="space-y-0.5">
                {filtered.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange?.(opt.value);
                        setOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#FAFBFC] text-[#0F1020] text-left"
                    >
                      <span>{opt.label}</span>
                      {value === opt.value && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </FormFieldWrapper>
    );
  }
);
Combobox.displayName = "Combobox";

const MultiSelect = forwardRef<HTMLDivElement, SelectorProps & { value?: string[]; onChange?: (val: string[]) => void }>(
  ({ label, error, required, options = [], value = [], onChange, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const toggleOption = (val: string) => {
      const copy = value.includes(val) ? value.filter((v) => v !== val) : [...value, val];
      onChange?.(copy);
    };

    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div
          ref={ref}
          className="relative w-full"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          {...props}
        >
          <div
            onClick={() => setOpen(!open)}
            className="w-full flex flex-wrap items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-[#0F1020]/10 bg-white text-sm text-[#0F1020] focus-within:ring-2 focus-within:ring-[#0F1020]/5 focus-within:border-[#0F1020]/25 transition duration-300 cursor-pointer"
          >
            {value.length > 0 ? (
              value.map((val) => {
                const opt = options.find((o) => o.value === val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 bg-[#0F1020]/5 px-2 py-0.5 rounded-lg text-xs font-semibold text-[#0F1020]"
                  >
                    {opt?.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(val);
                      }}
                      className="hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="text-[#0F1020]/30 select-none">Select options...</span>
            )}
          </div>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#0F1020]/10 shadow-2xl rounded-2xl p-2 z-50 max-h-[250px] overflow-y-auto animate-scaleIn">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs border-b border-[#0F1020]/5 focus:outline-none placeholder:text-[#0F1020]/35 text-[#0F1020] bg-[#FAFBFC] rounded-lg mb-2"
              />
              <ul className="space-y-0.5">
                {filtered.map((opt) => {
                  const selected = value.includes(opt.value);
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => toggleOption(opt.value)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#FAFBFC] text-[#0F1020] text-left"
                      >
                        <span>{opt.label}</span>
                        {selected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </FormFieldWrapper>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

const Slider = forwardRef<HTMLInputElement, { label?: string; error?: string; required?: boolean; min?: number; max?: number; step?: number; value?: number; onChange?: (val: number) => void; className?: string }>(
  ({ label, error, required, min = 0, max = 100, step = 1, value = 50, onChange, className, ...props }, ref) => {
    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div className="space-y-2">
          <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className="w-full accent-[#0F1020] h-1 bg-[#0F1020]/10 rounded-lg appearance-none cursor-pointer"
            {...props}
          />
          <div className="flex justify-between text-xs text-[#0F1020]/45 font-mono font-semibold">
            <span>{min}</span>
            <span className="text-[#0F1020]/75">{value}</span>
            <span>{max}</span>
          </div>
        </div>
      </FormFieldWrapper>
    );
  }
);
Slider.displayName = "Slider";

const Range = forwardRef<HTMLDivElement, { label?: string; error?: string; required?: boolean; min?: number; max?: number; step?: number; value?: [number, number]; onChange?: (val: [number, number]) => void; className?: string }>(
  ({ label, error, required, min = 0, max = 100, step = 1, value = [20, 80], onChange, className, ...props }, ref) => {
    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div ref={ref} className="space-y-4" {...props}>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F1020]/35">Min Value</span>
              <input
                type="number"
                min={min}
                max={value[1]}
                value={value[0]}
                onChange={(e) => onChange?.([Number(e.target.value), value[1]])}
                className="w-full px-3 py-1.5 border border-[#0F1020]/10 rounded-lg text-xs font-mono font-semibold"
              />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F1020]/35">Max Value</span>
              <input
                type="number"
                min={value[0]}
                max={max}
                value={value[1]}
                onChange={(e) => onChange?.([value[0], Number(e.target.value)])}
                className="w-full px-3 py-1.5 border border-[#0F1020]/10 rounded-lg text-xs font-mono font-semibold"
              />
            </div>
          </div>
        </div>
      </FormFieldWrapper>
    );
  }
);
Range.displayName = "Range";

export { Combobox, MultiSelect, Slider, Range };
