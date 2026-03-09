import type { Css } from "./css.types";
import { BREAKPOINTS } from "../config/breakpoints";

type Variant = "hover" | "focus" | "mobile" | "desktop";

const VARIANT_PREFIX: Record<Variant, string> = {
  hover: "_h",
  focus: "_f",
  mobile: "_m",
  desktop: "_d",
};

function resolveCssToClassNames(css: Css | undefined): string[] {
  if (!css || typeof css === "boolean") return [];
  if (typeof css === "string") return [css];
  if (Array.isArray(css)) return css.flatMap(resolveCssToClassNames);
  return Object.entries(css)
    .filter(([, value]) => value)
    .map(([key]) => key);
}

const classPropertiesCache = new Map<string, string>();

function findStyleRuleInList(rules: CSSRuleList, className: string): string {
  for (const rule of rules) {
    if (rule instanceof CSSStyleRule && rule.selectorText === `.${className}`) {
      return rule.style.cssText;
    }
    if ("cssRules" in rule) {
      const found = findStyleRuleInList((rule as CSSGroupingRule).cssRules, className);
      if (found) return found;
    }
  }
  return "";
}

function getCssProperties(className: string): string {
  if (classPropertiesCache.has(className)) return classPropertiesCache.get(className)!;

  for (const sheet of document.styleSheets) {
    try {
      const cssText = findStyleRuleInList(sheet.cssRules, className);
      if (cssText) {
        classPropertiesCache.set(className, cssText);
        return cssText;
      }
    } catch {
      continue;
    }
  }

  classPropertiesCache.set(className, "");
  return "";
}

let styleElement: HTMLStyleElement | null = null;

function ensureStyleSheet(): CSSStyleSheet | null {
  if (typeof document === "undefined") return null;
  if (styleElement?.sheet) return styleElement.sheet;
  styleElement = document.createElement("style");
  styleElement.setAttribute("data-css-manager", "");
  document.head.appendChild(styleElement);
  return styleElement.sheet;
}

const cache = new Map<string, string>();
let counter = 0;

function buildRule(variant: Variant, generatedClass: string, properties: string): string {
  switch (variant) {
    case "hover":
      return `.${generatedClass}:hover { ${properties} }`;
    case "focus":
      return `.${generatedClass}:focus-visible { ${properties} }`;
    case "mobile":
      return `@media (${BREAKPOINTS.mobile}) { .${generatedClass} { ${properties} } }`;
    case "desktop":
      return `@media (${BREAKPOINTS.desktop}) { .${generatedClass} { ${properties} } }`;
  }
}

export function getOrCreateClass(variant: Variant, cssInput: Css): string {
  const classNames = resolveCssToClassNames(cssInput);
  if (classNames.length === 0) return "";

  const sorted = [...classNames].sort();
  const cacheKey = variant + ":" + sorted.join(",");

  const existing = cache.get(cacheKey);
  if (existing) return existing;

  const properties = classNames.map(getCssProperties).filter(Boolean).join(" ");
  if (!properties) {
    cache.set(cacheKey, "");
    return "";
  }

  const generatedClass = VARIANT_PREFIX[variant] + counter++;
  const rule = buildRule(variant, generatedClass, properties);

  const sheet = ensureStyleSheet();
  if (sheet) {
    sheet.insertRule(rule, sheet.cssRules.length);
  }

  cache.set(cacheKey, generatedClass);
  return generatedClass;
}
