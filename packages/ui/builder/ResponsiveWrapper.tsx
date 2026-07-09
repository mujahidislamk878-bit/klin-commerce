"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface ResponsiveWrapperProps extends EditableProps {
  children?: ReactNode;
  visibleOn?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}

const ResponsiveWrapper = forwardRef<HTMLDivElement, ResponsiveWrapperProps>(
  (
    {
      children,
      visibleOn = { desktop: true, tablet: true, mobile: true },
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          !visibleOn.desktop && "lg:hidden",
          !visibleOn.tablet && "md:max-lg:hidden",
          !visibleOn.mobile && "max-md:hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveWrapper.displayName = "ResponsiveWrapper";
export default ResponsiveWrapper;
export { ResponsiveWrapper };
