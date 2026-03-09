import { useSyncExternalStore } from "react";
import { theme, type ThemePreference } from "./Theme";

export function useTheme(): { currentTheme: ThemePreference; setTheme: (t: ThemePreference) => void } {
  useSyncExternalStore(theme.subscribe, theme.getPreference);
  const currentTheme = theme.getPreference();
  return { currentTheme, setTheme: (t: ThemePreference) => theme.setTheme(t) };
}
