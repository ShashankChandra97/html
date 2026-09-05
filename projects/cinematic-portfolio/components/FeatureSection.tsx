"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TextReveal } from "./TextReveal";
import { ArrowIcon } from "./icons";
import { SceneVisual, type SceneVariant } from "./SceneVisual";
import { withBasePath } from "@/lib/basePath";

type FeatureSectionProps = {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  tone?: "light" | "dark";
  accent?: string;
  href?: string;
  actionLabel?: string;
  external?: boolean;
  visual: SceneVariant;
};

export function FeatureSection({ id, index, eyebrow, title, body, tone = "light", accent = "", href, actionLabel, external = false, visual }: FeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = section.querySelectorAll(".reveal-word");
      const bodyCopy = section.querySelector("[data-feature-body]");
      const sceneVisual = section.querySelector("[data-scene-visual]");
      gsap.fromTo(
        words,
        { yPercent: 105, opacity: 0, filter: "blur(7px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.025,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 82%", end: "top 34%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        sceneVisual,
        { yPercent: 10, rotateZ: -6, scale: 0.96 },
        {
          yPercent: -8,
          rotateZ: 6,
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.7 },
        },
      );
      gsap.fromTo(
        bodyCopy,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: section, start: "top 65%", end: "top 34%", scrub: 0.5 } },
      );
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id={id} className={`feature-section feature-${tone}`}>
      <div className="feature-accent" style={{ background: accent }} aria-hidden="true" />
      <SceneVisual variant={visual} className="feature-scene-visual" />
      <div className="feature-layout">
        <div className="feature-kicker"><span>{index}</span><p>{eyebrow}</p></div>
        <div className="feature-copy">
          <TextReveal as="h2" className="feature-title">{title}</TextReveal>
          <p data-feature-body>{body}</p>
          {href && actionLabel ? (
            <a
              className="feature-link"
              href={external ? href : withBasePath(href)}
              rel={external ? "noopener noreferrer" : undefined}
              target={external ? "_blank" : undefined}
            >
              {actionLabel}<ArrowIcon />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
