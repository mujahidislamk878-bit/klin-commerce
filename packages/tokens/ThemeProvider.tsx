"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ThemeTokens } from "../types";

const defaultTheme: ThemeTokens = {
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    secondary: "var(--secondary)",
    secondaryForeground: "var(--secondary-foreground)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    accentForeground: "var(--accent-foreground)",
    destructive: "var(--destructive)",
    destructiveForeground: "var(--destructive-foreground)",
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
  },
  radii: {
    none: "0px",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
    "3xl": "var(--radius-3xl)",
    full: "9999px",
    card: "var(--radius-card)",
  },
  fonts: {
    sans: "var(--font-sans)",
    display: "var(--font-display)",
    mono: "ui-monospace, monospace",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
    float: "var(--shadow-float)",
    lift: "var(--shadow-lift)",
    soft: "var(--shadow-soft)",
  },
  spacing: {
    none: "0px",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
};

export interface ThemeContextValue {
  theme: ThemeTokens;
  isDark: boolean;
  resolvedTheme: ThemeTokens;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  isDark: false,
  resolvedTheme: defaultTheme,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  theme,
  children,
}: {
  theme?: Partial<ThemeTokens>;
  children: ReactNode;
}) {
  const [dark, setDark] = useMemo(() => {
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    return [isDark, (val: boolean) => {
      if (typeof document !== "undefined") {
        if (val) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }];
  }, []);

  const toggleTheme = () => {
    const isCurrentlyDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    setDark(!isCurrentlyDark);
  };

  const value = useMemo(() => {
    const merged: ThemeTokens = {
      colors: { ...defaultTheme.colors, ...theme?.colors },
      radii: { ...defaultTheme.radii, ...theme?.radii },
      fonts: { ...defaultTheme.fonts, ...theme?.fonts },
      shadows: { ...defaultTheme.shadows, ...theme?.shadows },
      spacing: { ...defaultTheme.spacing, ...theme?.spacing },
      components: { ...defaultTheme.components, ...theme?.components },
    };
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    return { theme: merged, isDark, resolvedTheme: merged, toggleTheme };
  }, [theme, dark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}