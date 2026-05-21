import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd());
const source = path.join(rootDir, "dist", "server");
const dest = path.join(rootDir, "api", "server");

if (!fs.existsSync(source)) {
  console.error(`Source directory not found: ${source}`);
  process.exit(1);
}

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

fs.cpSync(source, dest, { recursive: true });
console.log(`Copied server bundle from ${source} to ${dest}`);
