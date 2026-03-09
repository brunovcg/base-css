export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

const STORAGE_KEY = "base-css-theme";

class ThemeManager {
  private currentTheme: Theme;
  private preference: ThemePreference;

  private readonly listeners = new Set<() => void>();
  private readonly mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    this.preference = stored === "dark" || stored === "system" ? stored : "light";
    this.currentTheme = this.resolveTheme(this.preference);
    this.applyTheme(this.currentTheme);

    this.mediaQuery.addEventListener("change", this.handleSystemChange);
  }

  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  getTheme = () => this.currentTheme;

  getPreference = () => this.preference;

  setTheme(newPreference: ThemePreference) {
    this.preference = newPreference;
    this.currentTheme = this.resolveTheme(newPreference);
    this.applyTheme(this.currentTheme);
    localStorage.setItem(STORAGE_KEY, newPreference);
    this.listeners.forEach((cb) => cb());
  }

  private resolveTheme(preference: ThemePreference): Theme {
    if (preference === "system") {
      return this.mediaQuery.matches ? "dark" : "light";
    }
    return preference;
  }

  private handleSystemChange = () => {
    if (this.preference !== "system") return;
    this.currentTheme = this.resolveTheme("system");
    this.applyTheme(this.currentTheme);
    this.listeners.forEach((cb) => cb());
  };

  private applyTheme(value: Theme) {
    document.documentElement.dataset.theme = value;
  }
}

export const theme = new ThemeManager();
