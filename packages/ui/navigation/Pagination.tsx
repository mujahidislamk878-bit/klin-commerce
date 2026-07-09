"use client";

import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { PaginationProps } from "../../types";

// ── Helpers ──

const sizeMap = {
  sm: "h-8 min-w-8 text-xs",
  md: "h-10 min-w-10 text-sm",
  lg: "h-12 min-w-12 text-base",
} as const;

const iconSizeMap = { sm: 14, md: 16, lg: 18 } as const;

function generatePages(
  totalPages: number,
  currentPage: number,
  siblingCount: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [1, "...", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, "...", ...middleRange, "...", totalPages];
}

// ── Component ──

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      total,
      perPage = 10,
      currentPage: currentPageProp = 1,
      siblingCount = 1,
      showFirstLast = true,
      showPrevNext = true,
      size = "md",
      ...props
    },
    ref,
  ) => {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.max(1, Math.min(currentPageProp, totalPages));

    const pages = useMemo(
      () => generatePages(totalPages, currentPage, siblingCount),
      [totalPages, currentPage, siblingCount],
    );

    const btnClass = cn(
      "inline-flex items-center justify-center rounded-md transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-40",
      sizeMap[size],
    );

    const activeClass =
      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground";

    return (
      <motion.div
        ref={ref}
        className={cn("inline-flex items-center gap-1", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {/* First */}
        {showFirstLast && (
          <button
            className={btnClass}
            disabled={currentPage === 1}
            aria-label="First page"
            type="button"
          >
            <ChevronsLeft size={iconSizeMap[size]} aria-hidden="true" />
          </button>
        )}

        {/* Prev */}
        {showPrevNext && (
          <button
            className={btnClass}
            disabled={currentPage === 1}
            aria-label="Previous page"
            type="button"
          >
            <ChevronLeft size={iconSizeMap[size]} aria-hidden="true" />
          </button>
        )}

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className={cn(
                "inline-flex items-center justify-center select-none",
                sizeMap[size],
              )}
            >
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              className={cn(btnClass, page === currentPage && activeClass)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
              type="button"
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        {showPrevNext && (
          <button
            className={btnClass}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            type="button"
          >
            <ChevronRight size={iconSizeMap[size]} aria-hidden="true" />
          </button>
        )}

        {/* Last */}
        {showFirstLast && (
          <button
            className={btnClass}
            disabled={currentPage === totalPages}
            aria-label="Last page"
            type="button"
          >
            <ChevronsRight size={iconSizeMap[size]} aria-hidden="true" />
          </button>
        )}
      </motion.div>
    );
  },
);

Pagination.displayName = "Pagination";

export { Pagination };
export default Pagination;
