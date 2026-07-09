"use client";

import type { ThemeTokens } from "../types";

export class ThemeRuntime {
  public resolveTokens(theme: ThemeTokens, overrides?: Partial<ThemeTokens>): ThemeTokens {
    // Merges base theme tokens with layout/component specific user overrides
    return {
      colors: { ...theme.colors, ...overrides?.colors },
      radii: { ...theme.radii, ...overrides?.radii },
      fonts: { ...theme.fonts, ...overrides?.fonts },
      shadows: { ...theme.shadows, ...overrides?.shadows },
      spacing: { ...theme.spacing, ...overrides?.spacing },
      components: { ...theme.components, ...overrides?.components },
    };
  }

  public applyToCSSVariables(theme: ThemeTokens) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Set colors
    Object.entries(theme.colors).forEach(([key, val]) => {
      root.style.setProperty(`--theme-color-${key}`, val);
    });

    // Set radii
    Object.entries(theme.radii).forEach(([key, val]) => {
      root.style.setProperty(`--theme-radius-${key}`, val);
    });

    // Set spacing
    Object.entries(theme.spacing).forEach(([key, val]) => {
      root.style.setProperty(`--theme-space-${key}`, val);
    });
  }
}

export const themeRuntime = new ThemeRuntime();
