/* eslint-disable react-refresh/only-export-components */
import type { ElementType, Key, ReactElement } from "react";
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import type { JSX as ReactJSX, JSXSource } from "react/jsx-dev-runtime";
import { hasCustomCssProps, processCustomCssProps } from "./jsx.utils";

export const Fragment = _Fragment;
export type { ReactJSX as JSX };

export function jsxDEV(type: ElementType, props: Record<string, unknown>, key: Key | undefined, isStaticChildren: boolean, source?: JSXSource, self?: unknown): ReactElement {
  if (!props || typeof type !== "string" || !hasCustomCssProps(props)) {
    return _jsxDEV(type, props, key, isStaticChildren, source, self);
  }

  return _jsxDEV(type, processCustomCssProps(props), key, isStaticChildren, source, self);
}
