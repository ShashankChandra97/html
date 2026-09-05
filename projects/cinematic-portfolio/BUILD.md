# Static builds and versioning

`package.json` is the authoritative application version. The lockfile mirrors it. Increment the semantic version with `npm version patch --no-git-tag-version` (or `minor` / `major`), then add a concise entry to `CHANGELOG.md`. This command does not create a commit, release, or tag.

## Reproduce the artifact

Use Node.js 22 and Python 3 for local preview:

```bash
npm ci
npm run lint
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/html npm run build
npm run preview -- --port 4187
```

Open `http://127.0.0.1:4187/html/`. Omit `NEXT_PUBLIC_BASE_PATH` to build for `/`. The preview reads the artifact's base path automatically; an explicit `--base-path /html` is also accepted. `npm start` runs this static preview. `npm run dev` is a local development tool and is not a deployment runtime.

`npm run build` generates build metadata once, compiles the Next.js static export, copies the public CloudVeyra and Container Command demo assets into `out/projects/`, and creates `.nojekyll`. Deploy only `out/`. `.github/workflows/static.yml` performs the same build with `/html`, matching the existing GitHub Pages host.

## Build identity

The build writes identical `lib/build-info.json` and `public/build-info.json` files. The generated metadata imports the first; Next.js copies the second to `out/build-info.json`. Both therefore identify the same artifact. These generated files and build output are ignored by Git. Development and typechecking create metadata only when it is missing; a production build always generates new values before compilation.

| Field | Meaning |
| --- | --- |
| `version` | Semantic version read from `package.json` |
| `builtAt` | Actual build-start timestamp in UTC ISO 8601 format |
| `commit` | Full source commit, or `"unavailable"` |
| `commitShort` | First 12 commit characters, or `"unavailable"` |
| `dirty` | `true` for uncommitted changes, `false` for clean source, `null` if Git status is unavailable |
| `basePath` | Deployment prefix used during this build |

Git status covers the repository, including untracked source files and excluding ignored generated output. Build identity is created by the local/CI build script; it is never computed from the visitor's clock. Rebuilding the same source intentionally changes `builtAt`. If building from an archive without Git, the artifact explicitly reports unavailable commit/status information.

The build uses the installed Next.js `output: "export"` support. All deployed application behavior runs in the browser, with static HTML/CSS/JavaScript and assets. There are no API routes, server actions, functions, databases, runtime Node server, or external processing services. Contact uses ordinary links. The Python preview only serves the static artifact; it does not execute application logic.

Demo assets are explicitly listed in `scripts/build.mjs`; add new public demo assets there when needed. This avoids copying ignored private demo implementations into the public artifact.
