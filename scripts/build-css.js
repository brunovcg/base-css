import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stylesDir = path.resolve(__dirname, "../src/styles");
const outputFile = path.resolve(__dirname, "../dist/styles.css");

function readAndInlineImports(filePath, visited = new Set()) {
  if (visited.has(filePath)) return "";
  visited.add(filePath);

  const content = fs.readFileSync(filePath, "utf-8");
  const dir = path.dirname(filePath);

  return content.replace(/@import\s+["'](.+?)["']\s*;/g, (_match, importPath) => {
    const resolved = path.resolve(dir, importPath);
    if (!fs.existsSync(resolved)) {
      console.warn(`Warning: import not found: ${resolved}`);
      return "";
    }
    return readAndInlineImports(resolved, visited);
  });
}

function resolveCustomMedia(css) {
  const mediaMap = new Map();
  const regex = /@custom-media\s+(--[\w-]+)\s+\(([^)]+)\)\s*;/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    mediaMap.set(match[1], match[2]);
  }

  // Remove @custom-media declarations
  let result = css.replace(/@custom-media\s+--[\w-]+\s+\([^)]+\)\s*;\n?/g, "");

  // Replace usages
  for (const [name, value] of mediaMap) {
    result = result.replaceAll(`(${name})`, `(${value})`);
  }

  return result;
}

async function loadConfig() {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, "base-css.config.js");

  if (fs.existsSync(configPath)) {
    try {
      const configUrl = pathToFileURL(configPath).href;
      const configModule = await import(configUrl);
      return configModule.default || configModule;
    } catch (error) {
      console.warn(`Failed to load config from ${configPath}:`, error.message);
    }
  }

  return null;
}

async function main() {
  const entryFile = path.resolve(stylesDir, "index.css");

  if (!fs.existsSync(entryFile)) {
    console.error(`Entry CSS file not found: ${entryFile}`);
    process.exit(1);
  }

  // Ensure dist directory exists
  const distDir = path.dirname(outputFile);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Bundle base-css structural CSS
  let bundled = readAndInlineImports(entryFile);
  bundled = resolveCustomMedia(bundled);

  // Check for consumer config to include additional CSS
  const config = await loadConfig();

  if (config?.styles) {
    const cwd = process.cwd();
    const consumerStylesEntry = path.resolve(cwd, config.styles);

    if (fs.existsSync(consumerStylesEntry)) {
      console.log(`Including consumer styles: ${consumerStylesEntry}`);
      let consumerCss = readAndInlineImports(consumerStylesEntry);
      consumerCss = resolveCustomMedia(consumerCss);
      bundled += "\n/* Consumer styles */\n" + consumerCss;
    } else {
      console.warn(`Consumer styles entry not found: ${consumerStylesEntry}`);
    }
  }

  fs.writeFileSync(outputFile, bundled);
  console.log(`Bundled CSS written to ${outputFile}`);
}

main();
