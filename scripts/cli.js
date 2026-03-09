#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseCssRoot = path.resolve(__dirname, "..");

const command = process.argv[2];

const commands = {
  register: () => {
    console.log("Generating CSS register...");
    execSync(`node ${path.join(baseCssRoot, "scripts/generate-css-register.js")}`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  },
  build: () => {
    console.log("Building base-css...");
    execSync(`npm run build`, {
      stdio: "inherit",
      cwd: baseCssRoot,
    });
  },
};

if (!command || !commands[command]) {
  console.log("Usage: base-css <command>");
  console.log("");
  console.log("Commands:");
  console.log("  register   Generate CSS register (scans base + consumer design dirs)");
  console.log("  build      Full build (register + tsc + bundle CSS)");
  process.exit(command ? 1 : 0);
}

commands[command]();
