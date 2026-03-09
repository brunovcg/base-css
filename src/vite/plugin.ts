import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const customMedia = () => {
  const mediaMap = new Map<string, string>();
  const breakpointsPath = path.resolve(__dirname, "../styles/config/breakpoints.css");

  return {
    name: "base-css-custom-media",
    buildStart() {
      const content = fs.readFileSync(breakpointsPath, "utf-8");
      const regex = /@custom-media\s+(--[\w-]+)\s+\(([^)]+)\)\s*;/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        mediaMap.set(match[1], match[2]);
      }
    },
    transform(code: string, id: string) {
      if (!id.endsWith(".css")) return null;
      let result = code;
      result = result.replace(/@custom-media\s+--[\w-]+\s+\([^)]+\)\s*;\n?/g, "");
      for (const [name, value] of mediaMap) {
        result = result.replaceAll(`(${name})`, `(${value})`);
      }
      if (result !== code) return result;
      return null;
    },
  };
};
