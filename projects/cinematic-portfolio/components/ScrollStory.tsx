"use client";

import { addSceneMorph } from "@/lib/sceneMorph";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PinnedSection } from "./PinnedSection";
import { TextReveal } from "./TextReveal";
import { SceneVisual } from "./SceneVisual";

const chapters = [
  { overline: "About me", title: "Cloud. DevOps. AI automation.", body: "Graduate student at The University of Texas at Dallas pursuing an MS in Information Technology & Management, graduating December 2026.", align: "left" },
  { overline: "Professional experience", title: "3.8 years of professional experience.", body: "Experience at the intersection of cloud engineering, AI-driven automation, and developer productivity.", align: "right" },
  { overline: "Cloud efficiency", title: "$130K+ in annual cloud savings.", body: "Delivered through Azure resource rightsizing and lifecycle-management policies at Deloitte.", align: "left" },
  { overline: "Delivery velocity", title: "Four hours to under 30 minutes.", body: "Engineered and optimized Azure DevOps CI/CD pipelines, reducing deployment time from four hours to under 30 minutes.", align: "center" },
] as const;

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const desktop = context.conditions.desktop;
        const phases = gsap.utils.toArray<HTMLElement>("[data-story-phase]", section);
        const visual = section.querySelector("[data-scene-visual]");
        const halo = section.querySelector("[data-story-halo]");

        gsap.set(phases, { autoAlpha: 0 });
        gsap.set(phases[0], { autoAlpha: 1 });
        phases.forEach((phase) => {
          gsap.set(phase.querySelectorAll(".reveal-word"), {
            yPercent: 115,
            opacity: 0,
            filter: "blur(8px)",
          });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${desktop ? 320 : 230}%`,
            pin: true,
            scrub: desktop ? 0.85 : 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        addSceneMorph(timeline, visual, 4.2);

        const reveal = (phase: HTMLElement, at: number) => {
          timeline
            .to(phase, { autoAlpha: 1, duration: 0.22 }, at)
            .to(
              phase.querySelectorAll(".reveal-word"),
              { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: 0.025, duration: 0.55 },
              at,
            );
        };

        reveal(phases[0], 0);
        timeline
          .to(phases[0], { autoAlpha: 0, yPercent: -8, duration: 0.35 }, 0.78)
          .fromTo(
            visual,
            { x: 0, yPercent: 0, scale: desktop ? 1 : 0.88, rotateZ: 0 },
            { x: desktop ? "-21vw" : "-12vw", yPercent: -5, scale: desktop ? 0.88 : 0.78, rotateZ: -8, duration: 0.9, immediateRender: false },
            0.72,
          );

        reveal(phases[1], 0.98);
        timeline
          .to(phases[1], { autoAlpha: 0, yPercent: -8, duration: 0.32 }, 1.72)
          .to(visual, { x: desktop ? "20vw" : "12vw", yPercent: -2, scale: desktop ? 0.94 : 0.82, rotateZ: 9, duration: 0.85 }, 1.65)
          .to(halo, { xPercent: 20, scale: 1.18, opacity: 0.8, duration: 1 }, 1.6);

        reveal(phases[2], 1.9);
        timeline
          .to(phases[2], { autoAlpha: 0, yPercent: -8, duration: 0.32 }, 2.64)
          .to(visual, { x: 0, yPercent: -6, scale: desktop ? 1.02 : 0.88, rotateZ: 0, duration: 0.9 }, 2.56)
          .to(section, { backgroundColor: "#13246b", color: "#ffffff", duration: 0.7 }, 2.5);

        reveal(phases[3], 2.82);
        timeline
          .to(phases[3], { autoAlpha: 0, scale: 0.985, duration: 0.4 }, 3.62)
          .to(visual, { scale: 1.12, rotateZ: 4, autoAlpha: 0, duration: 0.72 }, 3.48)
          .to(halo, { scale: 1.8, opacity: 0, duration: 0.7 }, 3.45);
      },
    );

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <PinnedSection ref={sectionRef} id="about" className="story-section">
      <div className="story-halo" data-story-halo aria-hidden="true" />
      <SceneVisual variant="profile" className="story-scene-visual" />
      <div className="story-index" aria-hidden="true">01 — 04</div>
      {chapters.map((chapter, index) => (
        <div className={`story-phase story-${chapter.align}`} data-story-phase key={chapter.title}>
          <p className="eyebrow">{chapter.overline}</p>
          <TextReveal as="h2" className="story-title">{chapter.title}</TextReveal>
          <p className="story-body">{chapter.body}</p>
          <span className="chapter-number">0{index + 1}</span>
        </div>
      ))}
    </PinnedSection>
  );
}
