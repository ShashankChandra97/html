"use client";

import { addSceneMorph } from "@/lib/sceneMorph";
import { useRef } from "react";
import { PinnedSection } from "./PinnedSection";
import { TextReveal } from "./TextReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { SceneVisual } from "./SceneVisual";

export function Hero() {
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
        const isDesktop = context.conditions.desktop;
        const primary = section.querySelector("[data-hero-primary]");
        const secondary = section.querySelector("[data-hero-secondary]");
        const atmosphere = section.querySelector("[data-hero-atmosphere]");
        const visual = section.querySelector("[data-scene-visual]");
        const words = section.querySelectorAll("[data-hero-secondary] .reveal-word");

        gsap.set(secondary, { autoAlpha: 0, yPercent: 12 });
        gsap.set(words, { yPercent: 110, filter: "blur(10px)" });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${isDesktop ? 210 : 155}%`,
            pin: true,
            scrub: isDesktop ? 0.9 : 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        addSceneMorph(timeline, visual, 2.8);

        timeline
          .to(primary, { autoAlpha: 0, yPercent: -18, filter: "blur(8px)", duration: 0.68 }, 0.28)
          .to(visual, { scale: isDesktop ? 1.04 : 1.01, yPercent: -5, rotateZ: 4, duration: 2.4 }, 0)
          .to(atmosphere, { scale: 1.14, yPercent: -5, opacity: 0.92, duration: 2.8 }, 0)
          .to(section, { backgroundColor: "#f2f2f7", color: "#1c1c1e", duration: 1.7 }, 0.95)
          .to(secondary, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, 1.12)
          .to(words, { yPercent: 0, filter: "blur(0px)", stagger: 0.035, duration: 0.9 }, 1.08)
          .to(visual, { yPercent: -9, scale: isDesktop ? 1.06 : 1.03, rotateZ: -2, duration: 0.9 }, 1.9);
      },
    );

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <PinnedSection ref={sectionRef} id="hero" className="hero-section">
      <div className="hero-atmosphere" data-hero-atmosphere />
      <div className="hero-grid" aria-hidden="true" />
      <SceneVisual variant="cloud" className="hero-scene-visual" />
      <div className="hero-copy hero-copy-primary" data-hero-primary>
        <p className="eyebrow">Graduating in December 2026</p>
        <TextReveal as="h1" className="hero-title">Shashank Chandra.</TextReveal>
        <p className="hero-intro">AI-powered DevOps &amp; Cloud Engineer — building intelligent pipelines, resilient Azure infrastructure, and automation-first systems.</p>
      </div>
      <div className="hero-copy hero-copy-secondary" data-hero-secondary>
        <p className="eyebrow">Cloud engineering · AI-driven automation</p>
        <TextReveal as="h2" className="hero-title">Cloud engineering. AI-driven automation. Developer productivity.</TextReveal>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll to explore</span><i />
      </div>
    </PinnedSection>
  );
}
