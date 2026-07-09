"use client";

import { forwardRef, type ReactNode } from "react";
import type { EditableProps } from "../../types";

export interface ConditionalWrapperProps extends EditableProps {
  children?: ReactNode;
  condition?: boolean;
  fallback?: ReactNode;
}

const ConditionalWrapper = forwardRef<HTMLDivElement, ConditionalWrapperProps>(
  ({ children, condition = true, fallback = null, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {condition ? children : fallback}
      </div>
    );
  }
);

ConditionalWrapper.displayName = "ConditionalWrapper";
export default ConditionalWrapper;
export { ConditionalWrapper };
