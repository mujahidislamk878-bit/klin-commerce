"use client";

import { forwardRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface SearchBarProps extends EditableProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  results?: { label: string; href: string; description?: string }[];
}

const SearchBar = forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      placeholder = "Search...",
      onSearch,
      results = [
        { label: "Design System Guidelines", href: "/docs", description: "Design tokens overview" },
        { label: "Commerce Cart Integration", href: "/commerce", description: "Configuring Add to Cart" },
      ],
      className,
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);

    const filtered = query
      ? results.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
      : [];

    return (
      <div
        ref={ref}
        className={cn("relative w-full max-w-md", className)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          // close results list if click is outside search field container
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setFocused(false);
          }
        }}
        {...props}
      >
        <div className="flex items-center gap-3 px-4 rounded-xl border border-[#0F1020]/10 bg-white h-11 focus-within:ring-2 focus-within:ring-[#0F1020]/5 focus-within:border-[#0F1020]/25 transition duration-300">
          <Search className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="w-full bg-transparent border-0 p-0 text-sm placeholder:text-[#0F1020]/30 text-[#0F1020] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                onSearch?.("");
              }}
              className="p-1 rounded-full hover:bg-[#0F1020]/5 text-[#0F1020]/40"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Results Panel */}
        {focused && query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#0F1020]/10 shadow-2xl rounded-2xl p-2 z-50 max-h-[250px] overflow-y-auto animate-scaleIn">
            {filtered.length > 0 ? (
              <ul className="space-y-1">
                {filtered.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="block px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#FAFBFC] text-[#0F1020]"
                    >
                      <span className="block">{item.label}</span>
                      {item.description && (
                        <span className="block text-xs text-[#0F1020]/40 font-normal mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-xs text-[#0F1020]/30 font-bold">
                No matching results
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
export { SearchBar };
