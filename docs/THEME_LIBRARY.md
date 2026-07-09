# Theme Library Documentation (Enterprise v2.0)

This document describes the design tokens, theme contexts, component-level CSS variable overrides, and the runtime color-scheme switcher of the Klin Design System.

---

## 1. Global Tokens

Global tokens define variables for spacing, font families, shadows, border radii, and brand colors. These variables are declared as CSS Custom Properties in `src/styles.css` and are resolved dynamically by Tailwind v4.

### Colors Context
| Token | CSS Variable | Default Value | Description |
|---|---|---|---|
| `background` | `--background` | `oklch(99% 0.01 250)` | Primary canvas backdrop color |
| `foreground` | `--foreground` | `oklch(15% 0.02 245)` | Primary body typography color |
| `primary` | `--primary` | `oklch(12% 0.02 240)` | Main brand accent background |
| `primaryForeground` | `--primary-foreground` | `oklch(100% 0 0)` | Contrast color for primary buttons |
| `border` | `--border` | `rgba(15,16,32,0.08)` | Default card and divider border color |

---

## 2. Component-Level Tokens

Component-level tokens allow granular theme customizations of specific element types at the context scope.

```typescript
export interface ThemeTokens {
  // ...global tokens
  components?: {
    button?: Record<string, string>;
    card?: Record<string, string>;
    navbar?: Record<string, string>;
    footer?: Record<string, string>;
    input?: Record<string, string>;
    modal?: Record<string, string>;
    badge?: Record<string, string>;
  };
}
```

### Custom Overrides Example
To override only button background gradients and card corner roundedness, pass a partial theme token map to `ThemeProvider`:
```tsx
const customTokens = {
  components: {
    button: {
      primaryBg: "linear-gradient(to right, #6366f1, #a855f7)",
      radius: "16px",
    },
    card: {
      shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    }
  }
};

<ThemeProvider theme={customTokens}>
  <App />
</ThemeProvider>
```

---

## 3. Runtime Theme Switcher

The `useTheme()` hook exposes `toggleTheme` to swap between light and dark modes at runtime.

### API Usage
```tsx
import { useTheme } from "@klin/tokens";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Active Theme: {isDark ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
```

### Theme Syncing
Under the hood, `toggleTheme()` toggles the `dark` class on the root HTML node (`document.documentElement.classList`), triggering Tailwind CSS dark selectors.
