"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowIcon } from "./icons";
import { TextReveal } from "./TextReveal";
import { SceneVisual } from "./SceneVisual";

const credentials = [
  {
    institution: "University of Texas at Dallas",
    degree: "MS — Information Technology & Management",
    date: "Expected December 2026",
    detail: "In progress · GPA 3.52 / 4.0",
  },
  {
    institution: "Christ University · Bangalore, India",
    degree: "BCA — Computer Science",
    date: "May 2021",
    detail: "GPA 3.42 / 4.0",
  },
] as const;

const certifications = [
  { name: "Microsoft AZ-900", detail: "Azure Fundamentals", href: "https://drive.google.com/file/d/1MHq9p2fx4J_EOK4V8R3w2pTXwXz_MGaA/view" },
  { name: "Microsoft AZ-104", detail: "Azure Administrator", href: "https://drive.google.com/file/d/1Ce81ABvDkgENXNNO-weDAa0dRf2geoAN/view" },
] as const;

export function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        section.querySelectorAll("[data-education-item]"),
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 72%", end: "center 60%", scrub: 0.65 },
        },
      );
      gsap.fromTo(
        section.querySelector("[data-scene-visual]"),
        { rotateZ: -8, yPercent: 8 },
        { rotateZ: 8, yPercent: -8, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 } },
      );
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="education" className="education-section">
      <SceneVisual variant="education" className="education-scene-visual" />
      <div className="education-heading">
        <p className="eyebrow">Education &amp; certifications</p>
        <TextReveal as="h2" className="education-title">Academic background.</TextReveal>
      </div>
      <div className="education-list">
        {credentials.map((credential, index) => (
          <article data-education-item className="education-item" key={credential.institution}>
            <span className="education-index">0{index + 1}</span>
            <div>
              <h3>{credential.institution}</h3>
              <p>{credential.degree}</p>
            </div>
            <div className="education-meta">
              <strong>{credential.date}</strong>
              <span>{credential.detail}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="certification-list" aria-label="Certifications">
        {certifications.map((certification) => (
          <a data-education-item href={certification.href} target="_blank" rel="noopener noreferrer" key={certification.name}>
            <span><strong>{certification.name}</strong><small>{certification.detail}</small></span>
            <ArrowIcon />
          </a>
        ))}
      </div>
    </section>
  );
}
