export const ThemeService = {
  applyTheme(theme: any, setWebsite: (w: any) => void) {
    setWebsite((prev: any) => ({ ...prev, theme }));
  }
};
