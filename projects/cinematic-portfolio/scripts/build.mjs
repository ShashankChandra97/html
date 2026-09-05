import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { generateBuildInfo, projectRoot } from "./build-info.mjs";

const require = createRequire(import.meta.url);
const metadata = generateBuildInfo();
console.log(`Building ${metadata.version} from ${metadata.commitShort}${metadata.dirty ? " (uncommitted changes)" : ""} at ${metadata.builtAt}`);
execFileSync(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

// Include only the existing public, browser-only demo assets. Keep this list in
// sync when adding a demo asset; private/ignored implementations are not exports.
const demos = {
  cloudveyra: [
    "index.html", "kubernetes.html", "css/style.css", "js/shell.js",
    "js/aks-demo.js", "js/demo-app.js", "js/demo-data.js",
  ],
  "container-command": ["index.html"],
};
for (const [demo, paths] of Object.entries(demos)) {
  for (const path of paths) {
    const destination = resolve(projectRoot, "out/projects", demo, path);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(resolve(projectRoot, "..", demo, path), destination);
  }
}
writeFileSync(resolve(projectRoot, "out/.nojekyll"), "");
console.log(`Static artifact ready: out/ (base path: ${metadata.basePath || "/"})`);
