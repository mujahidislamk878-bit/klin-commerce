export interface ThemeMetadata {
  id: string;
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

export const ThemeRegistry = {
  getThemes(): ThemeMetadata[] {
    return [
      {
        id: "default-light",
        name: "Klin Minimalist Light",
        colors: { primary: "#6366F1", background: "#ffffff", foreground: "#0F1020", accent: "#6366F1" },
        fonts: { body: "Inter", heading: "Outfit" }
      },
      {
        id: "corporate-dark",
        name: "Corporate Midnight Dark",
        colors: { primary: "#4F46E5", background: "#0A0B10", foreground: "#FFFFFF", accent: "#818CF8" },
        fonts: { body: "Inter", heading: "Outfit" }
      }
    ];
  }
};
