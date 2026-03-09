import type { CSS_REGISTER } from "./css.register";

export type CssClass = (typeof CSS_REGISTER)[keyof typeof CSS_REGISTER][number];

export type Css = CssClass | null | undefined | boolean | { [key in CssClass]?: boolean | null | undefined } | Css[];

export type PropsWithCss<T = Record<never, never>> = T & {
  css?: Css;
  cssHover?: Css;
  cssFocus?: Css;
  cssMobile?: Css;
  cssDesktop?: Css;
};

type ExtractColor<T> = T extends `color-${infer Color}` ? Color : never;
export type CssColor = ExtractColor<CssClass>;
