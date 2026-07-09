"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface StepNavProps extends EditableProps {
  steps?: { label: string; description?: string }[];
  currentStep?: number;
}

const StepNav = forwardRef<HTMLDivElement, StepNavProps>(
  (
    {
      steps = [
        { label: "Account Details", description: "First name, last name" },
        { label: "Business Profile", description: "Company name, type" },
        { label: "Workspace Launch", description: "Preferences setup" },
      ],
      currentStep = 0,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full py-4", className)}
        {...props}
      >
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div key={idx} className="flex-1 flex items-center gap-4 w-full">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300",
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                      : isActive
                      ? "bg-[#0F1020] border-[#0F1020] text-white shadow-lg shadow-[#0F1020]/10"
                      : "bg-[#FAFBFC] border-[#0F1020]/10 text-[#0F1020]/30"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <div>
                  <h4
                    className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      isActive ? "text-[#0F1020]" : isCompleted ? "text-[#0F1020]/60" : "text-[#0F1020]/30"
                    )}
                  >
                    {step.label}
                  </h4>
                  {step.description && (
                    <p
                      className={cn(
                        "text-xs mt-0.5 transition-colors duration-300",
                        isActive ? "text-[#0F1020]/50" : isCompleted ? "text-[#0F1020]/45" : "text-[#0F1020]/20"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "hidden md:block flex-1 h-px transition-colors duration-500 mx-4",
                    idx < currentStep ? "bg-emerald-500" : "bg-[#0F1020]/5"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

StepNav.displayName = "StepNav";
export default StepNav;
export { StepNav };
