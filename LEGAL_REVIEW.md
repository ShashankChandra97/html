# Code and asset legal review

RESEARCH NOTES — NOT LEGAL ADVICE — REVIEW WITH A LICENSED ATTORNEY BEFORE ACTING

**Review context [user provided]:** GitHub Pages hosting; United States target audience; reviewer is a developer; no user data is collected by the owner. The repository identifies Shashank Chandra as the portfolio author. No organization-specific OSS policy or legal approver has been supplied. This report uses the supplied skills as a review framework, without installing the plugin or claiming its practice-profile setup is complete.

Reviewed October 12, 2026. Scope: root static portfolio, cinematic portfolio source and existing local `out/` artifact, CloudVeyra and Container Command demos, asset documentation, installed dependency licenses, and deployment workflow. The initial review used installed licenses and official guidance. The user subsequently supplied Anthropic's Claude for Legal repository; its relevant skills were read on the same date. This is a technical compliance review and draft for attorney review, not a legal determination. Applicable jurisdiction, contracts, asset ownership and the live deployment were not verified.

## Findings

### 1. Medium severity, first remediation priority: missing dependency notices in the inspected distribution

The existing `projects/cinematic-portfolio/out/` contains font OFL texts and the Devicon MIT license, but no dependency license collection. Searches of its JavaScript chunks did not find the full MIT permission notice or the copyright lines supplied with React, React DOM, Three.js, Lenis, Framer Motion and Next.js. Their installed license files require inclusion of copyright and permission notices with copies or substantial portions of the software. The build script (`projects/cinematic-portfolio/scripts/build.mjs`) exports Next assets and copies the demo allowlist without a notice-generation step; GitHub Pages uploads `out/` alone.

This is evidence of a likely distribution compliance gap in the local artifact, subject to confirming which dependencies and substantial portions actually ship. The artifact's correspondence to the currently deployed site was not established. Before distribution, generate a third-party notice file from exact installed versions, include applicable transitive/browser dependency notices, copy it into the export, and check the final generated bundles and artifact. A package-lock license field alone does not contain the required license text. Source: installed package license texts [user provided repository; locally inspected].

### 2. Medium priority: third-party font requests and incomplete privacy documentation

`index.html:9-11`, `projects/cloudveyra/index.html:9-11` and `projects/cloudveyra/kubernetes.html:9-11` connect to Google Fonts. The CloudVeyra pages are included in the cinematic build, so the portfolio's self-hosted fonts do not eliminate all external font requests. Google confirms its font servers receive visitors' IP addresses: https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html .

CloudVeyra also saves preferences in localStorage (`projects/cloudveyra/js/shell.js:9,34`). No dedicated privacy policy was found in the inspected site files. Whether disclosures, consent or another legal basis are required depends on jurisdiction and actual hosting/data processing; this is not a confirmed privacy-law violation. Self-host the demo fonts with their respective licenses, document preference storage and host processing, and assess applicable disclosure requirements. Preference storage alone does not establish a need for a consent banner.

**US context update:** The owner confirms no first-party user-data collection. The source review found no first-party analytics or data-submission endpoint; local preference storage is not evidence of transmission to the owner. GitHub nevertheless documents IP-address logging for security on Pages sites ([GitHub Pages documentation, Data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection), [web retrieved; primary source]). Distinguish those hosting logs and Google Fonts requests from collection by the owner. No mandatory assessment, consent banner or privacy-law violation is established from the reviewed facts. A short factual privacy notice is a proportionate transparency improvement; this report does not establish that a specific US law mandates it. US targeting is not proof that no overseas visitors can access the public site.

### 3. Review needed: imagery provenance and brand presentation

`projects/cinematic-portfolio/public/images/photoreal/README.md` records generated editorial scenes, actual demo captures and retained Devicon notices. It describes the education photograph as preserved without documenting its original author, source or usage permission. Add that provenance. Its absence is an evidence gap, not proof of infringement.

The documentation identifies employer scenes as concepts and certification medals as decorative. Visitor-facing alt text (`lib/visualScenes.ts:6,11`) does not carry all of that context. Consider concise captions if the visuals could be interpreted as actual employer facilities or official credential artwork. Verify applicable brand rules separately from the SVG artwork license; no trademark violation was established by this review.

### 4. Review needed: employer claims and confidentiality

`projects/cinematic-portfolio/lib/portfolioContent.ts:21-25,36-41` publishes project details, quantified savings and performance claims. The repository does not establish supporting evidence or employer/client publication permission. Check those against employment agreements and approved public claims. This review found no basis to label them false or confidential solely from their presence in the code.

## Checks with no identified issue

- Font OFL files and the Devicon MIT text are retained in both source and the inspected static artifact.
- Current GSAP terms permit ordinary commercial website use. This portfolio does not appear to provide a competing visual animation builder. Do not classify GSAP as MIT; preserve proprietary notices when building. Official terms: https://gsap.com/community/standard-license/ .
- The inspected demos use static sample data and simulations; no analytics SDK, payment collection or authentication flow was identified in the reviewed application files.
- A missing license for the author's own repository is a reuse-policy choice, not by itself a legal violation.

## Limits and changes

Only this report was added. Application code, assets and the pre-existing modified cinematic README were left untouched. No new build, browser network audit, accessibility audit, Git-history secret scan, full transitive-license audit or production verification was performed. External linked applications and certificate documents were outside the code review. Those limits prevent a blanket legal-compliance conclusion.

## Follow-up using the supplied legal skills

Framework source [user provided]: https://github.com/anthropics/claude-for-legal . Inspected revision: `4a6c651889c97cc9140580363c73e0eb17379c2b`. Read the OSS review, privacy use-case triage and marketing claims review skills, and the OSS quick-start instructions. No plugin was installed or account connector configured.

The OSS skill requires a configured practice profile before its full formal workflow. No profile exists at `~/.claude/plugins/config/claude-for-legal/`. The user has now supplied hosting, audience jurisdiction, reviewer role and collection context, recorded above. A complete plugin setup was not performed; no organizational license policy or attorney approver is invented. The following records technical evidence and a framework-based assessment rather than formal legal clearance.

### Dependency inventory evidence

The lockfile has 453 package entries excluding the root. Metadata counts: 357 MIT; 36 Apache-2.0; 13 MPL-2.0; 10 LGPL-3.0-or-later; 3 Apache-2.0 AND LGPL-3.0-or-later; 1 Apache-2.0 AND LGPL-3.0-or-later AND MIT; 17 ISC; 7 BSD-2-Clause; 2 BSD-3-Clause; 1 each Python-2.0, CC-BY-4.0, BlueOak-1.0.0, CC0-1.0 and 0BSD; 2 GSAP custom-license metadata entries. These are metadata labels, not verified legal classifications or evidence that every package is deployed. Optional packages for mutually exclusive operating systems are counted separately.

- Sharp/libvips platform entries carry LGPL or composite license metadata. Do not infer that the portfolio must publish its own source from those labels: first establish whether these binaries are distributed, their relationship to other code, modifications and actual license terms.
- The observed delivery is a static export uploaded to GitHub Pages. Client JavaScript is delivered to visitors even though the site is hosted. Build tooling in `node_modules` is not automatically part of that distribution.
- `caniuse-lite@1.0.30001810` has CC-BY-4.0 metadata and an installed license; inspect whether its data is copied into distributed assets before assigning attribution obligations.
- `gsap@3.15.0` and `@gsap/react@2.1.2` reference a custom GSAP license. They must not be swept into an MIT-only notice or approval policy. Official license source [web retrieved; primary source]: https://gsap.com/community/standard-license/ .

The metadata inventory broadens coverage beyond the initial direct-package checks. Actual full transitive license-text review and artifact mapping remain unfinished, and no shipment approval is given.

### Deployment-specific assessment

The active page imports `CinematicExperience`, which imports React, GSAP/its React integration and `PhotographicStage`; the photo renderer imports Three.js. Older source components also import Lenis and Framer Motion, but their presence in the repository alone does not prove they are in the active exported bundles. Prioritize active browser dependencies and then confirm remaining inclusions using a fresh build's bundle evidence.

| Dependency evidence | License-text finding | Action for the static distribution |
|---|---|---|
| React 19.2.8, React DOM 19.2.8, Next 16.3.4, Three.js 0.185.1 | Installed MIT texts read | Preserve copyright and permission notices for the portions distributed |
| Lenis 1.3.26, Framer Motion 13.2.0 | Installed MIT texts read; referenced by older components | Check actual bundle inclusion before treating every package as deployed |
| motion-dom 13.2.0, motion-utils 13.0.0, scheduler 0.27.0, styled-jsx 5.1.6 | Installed MIT license files inspected | Include notices if their code ships; trace consumption through the build |
| @swc/helpers 0.5.23 | Installed Apache-2.0 text inspected | If shipped, include applicable license/notices and preserve any required change notices |
| tslib 2.8.1 | Installed 0BSD license and copyright notice inspected | Record separately from MIT; do not assume an MIT attribution condition |
| GSAP 3.15.0 and @gsap/react 2.1.2 | Custom license references; official terms retrieved | Ordinary website use appears permitted; preserve proprietary notices and avoid calling it MIT |
| Sharp/libvips platform packages | LGPL/composite metadata; actual platform license audit incomplete | `scripts/generate-mobile-posters.mjs` uses Sharp locally; no `.node`, `.so`, `.dylib` or `.wasm` binaries found in inspected `out/`. No evidence here that visitors receive libvips binaries |
| MPL-labeled lockfile entries | Metadata only | Do not impose browser source-disclosure duties without mapping actual files to the exported artifact |

Sources for installed-file findings: [user provided repository; locally inspected]. GSAP terms: [web retrieved; primary source]. License metadata is never used as proof of final artifact inclusion.

### Result and next actions

1. **Fix the likely browser-distribution notice gap.** Missing permissive-license attribution is medium severity under the supplied OSS skill's calibration, and remains the first practical remediation. Preserve exact installed notices in the build artifact and verify a fresh export.
2. **Improve privacy wording if added.** Describe no first-party tracking, local demo preferences, GitHub security logging and third-party font requests accurately. Avoid an absolute statement that nobody collects any data. Self-hosting demo fonts would remove the font-provider request.
3. **Resolve evidence gaps.** Document education-image provenance and retain support for quantified employment claims. The repository alone does not establish infringement, false claims or breach of an employment agreement.

Application code remains unchanged. These are review findings, not approval to publish or a conclusion that all 453 lockfile entries are compliant. A complete bundle-mapped license audit, asset provenance check and any contested legal interpretation remain separate follow-ups.

## Viewer notice implementation

At the owner's subsequent explicit request, a required terms/privacy notice was added to the cinematic portfolio, root static portfolio and direct demo entry pages. Visitors choose “Agree and continue” or “Exit site”; the latter navigates to `about:blank`. A native modal dialog blocks interaction until agreement, and a persistent “Terms & privacy” button reopens it. Browser-local, versioned acceptance is not sent to the owner. Updating the notice version requires a new acknowledgement; unavailable storage permits access for the current document and prompts again on later visits. JavaScript-disabled visitors see an enable-JavaScript message and an exit link.

This is an interaction gate, not server-side access control or a mechanism that prevents hosting logs or font requests before agreement. The notice explicitly describes that timing. Its terms cover illustrative content, third-party rights, lawful use and availability without adding arbitration, broad rights waivers or unsupported privacy promises. Legal enforceability has not been determined. The existing dependency-notice remediation remains separate and is not fixed by this viewer notice.

Validation: JavaScript syntax, TypeScript, ESLint and the GitHub Pages static build passed. Script-level behavioral checks covered first visit, cancellation without acceptance, acceptance, focus return, reopening, exit, existing/revised acceptance and blocked storage. No browser surface was available for visual or actual browser interaction QA. No deployment was performed.
