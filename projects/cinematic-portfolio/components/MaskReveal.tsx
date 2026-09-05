"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PinnedSection } from "./PinnedSection";
import { ParallaxImage } from "./ParallaxImage";
import { TextReveal } from "./TextReveal";
import { withBasePath } from "@/lib/basePath";
import { SceneVisual } from "./SceneVisual";

export function MaskReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const mask = section.querySelector("[data-mask]");
      const intro = section.querySelector("[data-mask-intro]");
      const reveal = section.querySelector("[data-mask-reveal]");
      const words = section.querySelectorAll("[data-mask-reveal] .reveal-word");

      gsap.set(reveal, { autoAlpha: 0 });
      gsap.set(words, { yPercent: 110, filter: "blur(8px)" });

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=210%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(mask, { clipPath: "inset(35% 32% round 44px)", scale: 0.92 }, { clipPath: "inset(0% 0% round 0px)", scale: 1, duration: 1.6 }, 0)
        .to(intro, { autoAlpha: 0, yPercent: -15, duration: 0.48 }, 0.4)
        .to(reveal, { autoAlpha: 1, duration: 0.4 }, 1.18)
        .to(words, { yPercent: 0, filter: "blur(0px)", stagger: 0.03, duration: 0.62 }, 1.16)
        .to(mask, { filter: "brightness(.72)", duration: 0.75 }, 1.3);
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <PinnedSection ref={sectionRef} id="skills" className="mask-section">
      <div className="mask-frame" data-mask>
        <ParallaxImage src={withBasePath("/cloud-field.svg")} alt="Abstract blue and indigo ribbons representing connected cloud and automation workflows" priority />
        <SceneVisual variant="skills" className="mask-scene-visual" />
      </div>
      <div className="mask-intro" data-mask-intro>
        <p className="eyebrow">Capabilities</p>
        <h2>What I work with.</h2>
      </div>
      <div className="mask-reveal-copy" data-mask-reveal>
        <p className="eyebrow">Azure · Kubernetes · Docker · CI/CD</p>
        <TextReveal as="h2">Cloud. DevOps. AI &amp; automation.</TextReveal>
        <p className="skill-summary">PowerShell · Python · SQL · Bash · MCP Servers · Claude Code · Azure Monitor · Security</p>
      </div>
    </PinnedSection>
  );
}
