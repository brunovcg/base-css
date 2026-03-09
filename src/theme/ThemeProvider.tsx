import type { PropsWithChildren } from "react";
import { useSyncExternalStore } from "react";
import { theme } from "./Theme";

export function ThemeProvider({ children }: Readonly<PropsWithChildren>) {
  useSyncExternalStore(theme.subscribe, theme.getTheme);
  return children;
}
