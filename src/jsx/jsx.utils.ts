import type { Css } from "../css/css.types";
import { cssReducer } from "../css/css.reducer";
import { getOrCreateClass } from "../css/css.manager";

const CUSTOM_CSS_PROPS = ["css", "cssHover", "cssFocus", "cssMobile", "cssDesktop"] as const;

export function hasCustomCssProps(props: Record<string, unknown>): boolean {
  for (const prop of CUSTOM_CSS_PROPS) {
    if (Object.prototype.hasOwnProperty.call(props, prop)) return true;
  }
  return false;
}

export function processCustomCssProps(props: Record<string, unknown>): Record<string, unknown> {
  const { css, cssHover, cssFocus, cssMobile, cssDesktop, className, ...rest } = props;

  const parts: string[] = [];

  const baseClassName = cssReducer(className as Css, css as Css);
  if (baseClassName) parts.push(baseClassName);

  if (cssHover) {
    const generated = getOrCreateClass("hover", cssHover as Css);
    if (generated) parts.push(generated);
  }

  if (cssFocus) {
    const generated = getOrCreateClass("focus", cssFocus as Css);
    if (generated) parts.push(generated);
  }

  if (cssMobile) {
    const generated = getOrCreateClass("mobile", cssMobile as Css);
    if (generated) parts.push(generated);
  }

  if (cssDesktop) {
    const generated = getOrCreateClass("desktop", cssDesktop as Css);
    if (generated) parts.push(generated);
  }

  const newClassName = parts.join(" ") || undefined;

  return { ...rest, className: newClassName };
}
