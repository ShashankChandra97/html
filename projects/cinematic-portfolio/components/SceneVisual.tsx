"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { addSceneMorph } from "@/lib/sceneMorph";

export type SceneVariant =
  | "cloud"
  | "profile"
  | "pipeline"
  | "parking"
  | "telemetry"
  | "containers"
  | "skills"
  | "education";

type SceneVisualProps = {
  variant: SceneVariant;
  className?: string;
};

function CloudVisual() {
  return (
    <>
      <ellipse className="scene-ring scene-ring-a" cx="320" cy="320" rx="244" ry="96" />
      <ellipse className="scene-ring scene-ring-b" cx="320" cy="320" rx="244" ry="96" />
      <ellipse className="scene-ring scene-ring-c" cx="320" cy="320" rx="184" ry="250" />
      <g className="scene-cloud-form">
        <path d="M208 365c-35 0-63-25-63-57 0-29 23-53 54-57 12-61 69-105 136-99 50 4 93 34 113 77 43 2 77 33 77 72 0 40-37 73-83 73H218" />
        <path className="scene-fill" d="M210 350c-24 0-43-18-43-40 0-21 18-38 42-40 15-56 71-95 131-85 43 7 78 36 92 75 39 0 70 26 70 59 0 17-8 31-21 42-14 11-30 15-52 15H222" />
      </g>
      <g className="scene-nodes">
        <circle cx="145" cy="308" r="7" /><circle cx="198" cy="205" r="6" />
        <circle cx="350" cy="135" r="8" /><circle cx="500" cy="242" r="6" />
        <circle cx="487" cy="414" r="8" /><circle cx="274" cy="495" r="6" />
      </g>
    </>
  );
}

function ProfileVisual() {
  return (
    <>
      <circle className="scene-profile-halo" cx="320" cy="320" r="118" />
      <circle className="scene-ring scene-ring-a" cx="320" cy="320" r="212" />
      <ellipse className="scene-ring scene-ring-b" cx="320" cy="320" rx="246" ry="112" />
      <path className="scene-axis" d="M92 320h456M320 92v456" />
      <g className="scene-monogram">
        <path d="M271 285c0-25 20-43 51-43 23 0 42 9 55 24l-22 18c-8-9-19-14-33-14-13 0-21 5-21 13 0 24 83 8 83 67 0 28-24 48-62 48-29 0-53-12-67-31l24-19c11 14 25 21 43 21 18 0 29-7 29-17 0-25-80-9-80-67Z" />
      </g>
      <g className="scene-nodes">
        <circle cx="108" cy="320" r="8" /><circle cx="320" cy="108" r="8" />
        <circle cx="532" cy="320" r="8" /><circle cx="320" cy="532" r="8" />
      </g>
    </>
  );
}

function PipelineVisual() {
  return (
    <>
      <path className="scene-pipeline-shadow" d="M78 356C151 356 155 226 235 226s86 188 170 188 91-113 158-113" />
      <path className="scene-pipeline" d="M78 340c73 0 77-130 157-130s86 188 170 188 91-113 158-113" />
      <path className="scene-pipeline-branch" d="M235 210c37 0 52-61 90-61 46 0 55 80 96 80h111" />
      <g className="scene-nodes scene-pipeline-nodes">
        <circle cx="78" cy="340" r="15" /><circle cx="235" cy="210" r="18" />
        <circle cx="405" cy="398" r="18" /><circle cx="563" cy="285" r="15" />
        <circle cx="421" cy="229" r="10" /><circle cx="532" cy="229" r="10" />
      </g>
      <g className="scene-pulses"><circle cx="78" cy="340" r="7" /><circle cx="405" cy="398" r="7" /></g>
    </>
  );
}

function ParkingVisual() {
  return (
    <>
      <g className="scene-map-grid">
        <path d="M78 205 336 84l226 142-260 132Z" />
        <path d="m78 282 224 142 260-132M78 359l224 142 260-132M164 165l226 142M250 125l226 142M132 316l258-132M218 370l258-132" />
      </g>
      <g className="scene-pin">
        <path d="M320 126c-55 0-100 43-100 97 0 81 100 178 100 178s100-97 100-178c0-54-45-97-100-97Z" />
        <circle cx="320" cy="223" r="37" />
        <path className="scene-pin-p" d="M304 250v-55h22c18 0 29 9 29 25 0 17-12 27-31 27h-3v3h-17Zm17-18h5c8 0 12-4 12-11s-4-11-12-11h-5v22Z" />
      </g>
    </>
  );
}

function TelemetryVisual() {
  return (
    <>
      <circle className="scene-radar-ring ring-1" cx="320" cy="320" r="82" />
      <circle className="scene-radar-ring ring-2" cx="320" cy="320" r="154" />
      <circle className="scene-radar-ring ring-3" cx="320" cy="320" r="232" />
      <path className="scene-radar-sweep" d="M320 320 529 225A232 232 0 0 0 320 88Z" />
      <path className="scene-telemetry-line" d="M82 366h75l33-64 43 108 55-170 50 126 43-67 35 67h142" />
      <g className="scene-nodes">
        <circle cx="190" cy="302" r="9" /><circle cx="288" cy="240" r="9" />
        <circle cx="381" cy="299" r="9" /><circle cx="494" cy="366" r="9" />
      </g>
    </>
  );
}

function ContainersVisual() {
  return (
    <>
      <g className="scene-container-stack stack-a">
        <path d="m130 336 144-73 145 82-146 76-143-85Z" />
        <path d="m130 336 1 79 143 87 145-80v-77M274 421v81" />
      </g>
      <g className="scene-container-stack stack-b">
        <path d="m225 210 119-61 121 69-122 63-118-71Z" />
        <path d="m225 210 1 65 118 71 121-66v-62M344 281v65" />
      </g>
      <path className="scene-container-route" d="M116 500c0-44 49-49 86-49h234c51 0 89-25 89-72V188" />
      <g className="scene-nodes"><circle cx="116" cy="500" r="10" /><circle cx="525" cy="188" r="10" /></g>
    </>
  );
}

function SkillsVisual() {
  return (
    <>
      <path className="scene-skill-links" d="M320 320 157 182M320 320l181-128M320 320 169 472M320 320l170 158M157 182l344 10M169 472l321 6" />
      <circle className="scene-profile-halo" cx="320" cy="320" r="88" />
      <g className="scene-skill-nodes">
        <circle cx="320" cy="320" r="30" /><circle cx="157" cy="182" r="22" />
        <circle cx="501" cy="192" r="22" /><circle cx="169" cy="472" r="22" />
        <circle cx="490" cy="478" r="22" />
      </g>
    </>
  );
}

function EducationVisual() {
  return (
    <>
      <ellipse className="scene-ring scene-ring-a" cx="320" cy="320" rx="242" ry="108" />
      <circle className="scene-ring scene-ring-c" cx="320" cy="320" r="204" />
      <g className="scene-cap">
        <path d="m126 274 194-93 194 93-194 94-194-94Z" />
        <path d="M209 315v91c66 42 155 42 222 0v-91M514 274v121" />
        <circle cx="514" cy="416" r="12" />
      </g>
    </>
  );
}

export function SceneVisual({ variant, className = "" }: SceneVisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  const gradientId = useId().replace(/:/g, "");
  useGSAP(() => {
    if (variant === "cloud" || variant === "profile") return;
    const root = ref.current;
    const section = root?.closest("section");
    if (!root || !section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: section, start: "top 85%", end: "top 8%", scrub: 0.65,
      } });
      addSceneMorph(timeline, root, 1);
    });
    return () => mm.revert();
  }, { scope: ref });
  const silhouettes: Record<SceneVariant, string> = {
    cloud: "M320 152C386 152 426 190 448 229C491 231 525 262 525 301C525 341 488 374 442 374H208C173 374 145 349 145 317C145 288 168 264 199 260C211 199 254 152 320 152Z",
    profile: "M320 108A212 212 0 1 1 319.9 108Z",
    pipeline: "M320 164C409 164 421 266 492 266C555 266 559 364 492 364C401 364 405 470 320 470C231 470 220 368 149 368C86 368 82 270 149 270C240 270 235 164 320 164Z",
    parking: "M320 126C375 126 420 169 420 223C420 304 320 401 320 401C320 401 220 304 220 223C220 169 265 126 320 126Z",
    telemetry: "M320 88A232 232 0 1 1 319.9 88Z",
    containers: "M274 263L419 345L419 422L274 502L131 415L130 336Z",
    skills: "M320 145L372 253L490 278L405 363L425 485L320 428L215 485L235 363L150 278L268 253Z",
    education: "M320 181L514 274L431 315L431 406Q320 469 209 406L209 315L126 274Z",
  };
  const visual = {
    cloud: <CloudVisual />,
    profile: <ProfileVisual />,
    pipeline: <PipelineVisual />,
    parking: <ParkingVisual />,
    telemetry: <TelemetryVisual />,
    containers: <ContainersVisual />,
    skills: <SkillsVisual />,
    education: <EducationVisual />,
  }[variant];

  return (
    <div ref={ref} className={`scene-visual scene-${variant} ${className}`} data-scene-visual data-variant={variant} aria-hidden="true">
      <div className="scene-aura" />
      <svg viewBox="0 0 640 640" focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--scene-secondary)" stopOpacity="0.12" />
            <stop offset="48%" stopColor="var(--scene-primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--scene-primary)" stopOpacity="0.02" />
          </linearGradient>
          <path data-morph-target d={silhouettes[variant]} />
        </defs>
        <g data-spatial-frame className="scene-spatial-frame">
          <path d="M320 72 568 214 568 426 320 568 72 426 72 214Z" />
          <path d="M72 214 320 356 568 214M320 356v212M320 72v110M72 426l95-55M568 426l-95-55" />
          <circle cx="320" cy="72" r="4" /><circle cx="72" cy="426" r="4" /><circle cx="568" cy="426" r="4" />
        </g>
        <g className="scene-morph-shell">
          {[0, 1, 2, 3, 4].map((layer) => <path key={layer} data-morph-contour d={silhouettes[variant]} fill={layer === 2 ? `url(#${gradientId})` : "none"} />)}
        </g>
        <g data-scene-detail>{visual}</g>
      </svg>
    </div>
  );
}
