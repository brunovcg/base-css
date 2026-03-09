/* eslint-disable react-refresh/only-export-components */
import type { ElementType, Key, ReactElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import type { JSX as ReactJSX } from "react/jsx-runtime";
import { hasCustomCssProps, processCustomCssProps } from "./jsx.utils";

export const Fragment = _Fragment;

export type { ReactJSX as JSX };

export function jsx(type: ElementType, props: Record<string, unknown>, key?: Key): ReactElement {
  if (!props || typeof type !== "string" || !hasCustomCssProps(props)) {
    return _jsx(type, props, key);
  }

  return _jsx(type, processCustomCssProps(props), key);
}

export function jsxs(type: ElementType, props: Record<string, unknown>, key?: Key): ReactElement {
  if (!props || typeof type !== "string" || !hasCustomCssProps(props)) {
    return _jsxs(type, props, key);
  }

  return _jsxs(type, processCustomCssProps(props), key);
}
