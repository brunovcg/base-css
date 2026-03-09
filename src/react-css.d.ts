import "react";
import type { Css } from "./css/css.types";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DOMAttributes<T> {
    css?: Css;
    cssHover?: Css;
    cssFocus?: Css;
    cssMobile?: Css;
    cssDesktop?: Css;
  }
}
