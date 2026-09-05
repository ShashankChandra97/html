import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedPaths = ["lib/build-info.json", "public/build-info.json"];

export function generateBuildInfo({ ensure = false } = {}) {
  if (ensure && generatedPaths.every((path) => existsSync(resolve(projectRoot, path)))) {
    return JSON.parse(readFileSync(resolve(projectRoot, generatedPaths[0]), "utf8"));
  }

  const { version } = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8"));
  let commit = "unavailable";
  let commitShort = "unavailable";
  let dirty = null;
  try {
    commit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: projectRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    commitShort = commit.slice(0, 12);
    dirty = execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], {
      cwd: projectRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim().length > 0;
  } catch {
    // A source archive may have no .git directory. Do not infer commit identity.
  }

  const metadata = {
    version,
    builtAt: new Date().toISOString(),
    commit,
    commitShort,
    dirty,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  };
  const serialized = `${JSON.stringify(metadata, null, 2)}\n`;
  for (const path of generatedPaths) {
    const destination = resolve(projectRoot, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, serialized);
  }
  return metadata;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const metadata = generateBuildInfo({ ensure: process.argv.includes("--ensure") });
  console.log(`Build metadata: ${metadata.version} · ${metadata.builtAt} · ${metadata.commitShort} · dirty=${metadata.dirty}`);
}
