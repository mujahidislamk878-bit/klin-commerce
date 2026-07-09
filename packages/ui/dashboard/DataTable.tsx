"use client";

import {
  forwardRef,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

// ── Types ──

interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

interface DataTableProps extends EditableProps {
  columns: DataTableColumn[];
  data: Record<string, unknown>[];
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selected: Record<string, unknown>[]) => void;
  onRowClick?: (row: Record<string, unknown>) => void;
  emptyMessage?: string;
  variant?: "default" | "striped" | "bordered" | "minimal";
}

export type { DataTableColumn, DataTableProps };

// ── Helpers ──

type SortDirection = "asc" | "desc" | null;

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function renderCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// ── Variant maps ──

const variantHead: Record<string, string> = {
  default: "border-b border-border",
  striped: "border-b border-border",
  bordered: "border-b border-border",
  minimal: "",
};

const variantRow: Record<string, (idx: number) => string> = {
  default: () => "border-b border-border/50",
  striped: (idx: number) =>
    cn(
      "border-b border-border/50",
      idx % 2 === 1 && "bg-muted/30",
    ),
  bordered: () => "border-b border-border",
  minimal: () => "",
};

const variantTable: Record<string, string> = {
  default: "border border-border rounded-lg overflow-hidden",
  striped: "border border-border rounded-lg overflow-hidden",
  bordered: "border-2 border-border rounded-lg overflow-hidden",
  minimal: "",
};

// ── Component ──

/**
 * DataTable renders a sortable, searchable, selectable data table
 * with pagination and multiple visual variants.
 *
 * @example
 * <DataTable
 *   columns={[
 *     { key: "name", label: "Name", sortable: true },
 *     { key: "email", label: "Email" },
 *   ]}
 *   data={[{ name: "Alice", email: "alice@example.com" }]}
 *   searchable
 *   variant="striped"
 * />
 */
const DataTable = forwardRef<HTMLDivElement, DataTableProps>(
  (
    {
      className,
      columns,
      data,
      pageSize = 10,
      searchable = false,
      sortable = false,
      selectable = false,
      onRowSelect,
      onRowClick,
      emptyMessage = "No results found.",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    // ── State ──
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);

    // ── Filtered data ──
    const filtered = useMemo(() => {
      if (!searchQuery || !searchable) return data;

      const q = searchQuery.toLowerCase();
      return data.filter((row) =>
        columns.some((col) => {
          const val = getNestedValue(row, col.key);
          if (typeof val === "string" && val.toLowerCase().includes(q))
            return true;
          if (typeof val === "number" && String(val).includes(q)) return true;
          return false;
        }),
      );
    }, [data, searchQuery, searchable, columns]);

    // ── Sorted data ──
    const sorted = useMemo(() => {
      if (!sortKey || !sortDir) return filtered;

      return [...filtered].sort((a, b) => {
        const aVal = getNestedValue(a, sortKey);
        const bVal = getNestedValue(b, sortKey);

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let cmp = 0;
        if (typeof aVal === "number" && typeof bVal === "number") {
          cmp = aVal - bVal;
        } else {
          cmp = String(aVal).localeCompare(String(bVal));
        }

        return sortDir === "desc" ? -cmp : cmp;
      });
    }, [filtered, sortKey, sortDir]);

    // ── Pagination ──
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginated = useMemo(
      () => sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
      [sorted, safePage, pageSize],
    );

    // ── Handlers ──
    const handleSort = useCallback(
      (colKey: string) => {
        if (!sortable) return;
        setSortKey((prev) => {
          if (prev === colKey) {
            setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
            return colKey;
          }
          setSortDir("asc");
          return colKey;
        });
      },
      [sortable],
    );

    const handleRowCheck = useCallback(
      (rowIdx: number) => {
        const globalIdx = (safePage - 1) * pageSize + rowIdx;
        const row = sorted[globalIdx];
        if (!row) return;

        const key = JSON.stringify(row);
        const next = new Set(selectedKeys);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        setSelectedKeys(next);
        onRowSelect?.(
          sorted.filter((_, i) => next.has(JSON.stringify(sorted[i]))),
        );
      },
      [sorted, selectedKeys, safePage, pageSize, onRowSelect],
    );

    const handleSelectAll = useCallback(() => {
      if (selectedKeys.size === paginated.length) {
        setSelectedKeys(new Set());
        onRowSelect?.([]);
      } else {
        const all = new Set(paginated.map((r) => JSON.stringify(r)));
        setSelectedKeys(all);
        onRowSelect?.(paginated);
      }
    }, [paginated, selectedKeys, onRowSelect]);

    // ── Render ──
    return (
      <motion.div
        ref={ref}
        className={cn("w-full", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {/* Search */}
        {searchable && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className={cn(
                "w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-input",
                "bg-background text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
                "transition-colors duration-150",
              )}
            />
          </div>
        )}

        {/* Table wrapper */}
        <div className={cn("overflow-x-auto", variantTable[variant])}>
          <table className="w-full text-sm">
            {/* ── Head ── */}
            <thead className={cn("bg-muted/50", variantHead[variant])}>
              <tr>
                {selectable && (
                  <th className="w-10 px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input accent-primary"
                      checked={
                        paginated.length > 0 &&
                        selectedKeys.size === paginated.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const isActive = sortable && sortKey === col.key;
                  const canSort = sortable && col.sortable;
                  return (
                    <th
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                        canSort && "cursor-pointer select-none hover:text-foreground",
                      )}
                      onClick={() => {
                        if (canSort) handleSort(col.key);
                      }}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        {col.label}
                        {canSort && (
                          <span className="inline-flex flex-col text-[10px] opacity-50">
                            {isActive && sortDir === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5 opacity-100" />
                            ) : isActive && sortDir === "desc" ? (
                              <ChevronUp className="h-3.5 w-3.5 rotate-180 opacity-100" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length + (selectable ? 1 : 0)
                    }
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => {
                  const rowKey = JSON.stringify(row);
                  const isSelected = selectedKeys.has(rowKey);

                  return (
                    <tr
                      key={rowKey}
                      className={cn(
                        "transition-colors duration-100",
                        variantRow[variant](idx),
                        onRowClick && "cursor-pointer",
                        isSelected && "bg-primary/5",
                      )}
                      onClick={() => {
                        if (onRowClick) onRowClick(row);
                      }}
                    >
                      {selectable && (
                        <td className="w-10 px-3 py-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-input accent-primary"
                            checked={isSelected}
                            onChange={() => handleRowCheck(idx)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-4 py-3 whitespace-nowrap"
                        >
                          {col.render
                            ? col.render(getNestedValue(row, col.key), row)
                            : renderCellValue(
                                getNestedValue(row, col.key),
                              )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 text-sm">
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {(safePage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(safePage * pageSize, sorted.length)}
              </span>{" "}
              of <span className="font-medium">{sorted.length}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "disabled:pointer-events-none disabled:opacity-40",
                )}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - safePage) <= 1) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev !== undefined && p - prev > 1;
                  return (
                    <span key={p} className="inline-flex items-center">
                      {showEllipsis && (
                        <span className="h-8 w-4 inline-flex items-center justify-center text-muted-foreground select-none">
                          ...
                        </span>
                      )}
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center justify-center h-8 min-w-8 rounded-md text-sm font-medium transition-colors",
                          p === safePage
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                        )}
                        onClick={() => setPage(p)}
                        aria-current={p === safePage ? "page" : undefined}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}

              <button
                type="button"
                disabled={safePage >= totalPages}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "disabled:pointer-events-none disabled:opacity-40",
                )}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  },
);

DataTable.displayName = "DataTable";

export { DataTable };
export default DataTable;