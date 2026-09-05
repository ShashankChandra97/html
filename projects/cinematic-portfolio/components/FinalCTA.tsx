"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MagneticButton } from "./MagneticButton";
import { TextReveal } from "./TextReveal";

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = section.querySelectorAll(".reveal-word");
      const orb = section.querySelector("[data-final-orb]");
      const action = section.querySelector("[data-final-action]");
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section, start: "top 78%", end: "center center", scrub: 0.8 },
      })
        .fromTo(orb, { scale: 0.65, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0)
        .fromTo(words, { yPercent: 110, filter: "blur(8px)" }, { yPercent: 0, filter: "blur(0px)", stagger: 0.03, duration: 0.75 }, 0.12)
        .fromTo(action, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.5);
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="contact" className="final-section">
      <div className="final-orb" data-final-orb aria-hidden="true" />
      <div className="final-copy">
        <p className="eyebrow">Richardson, TX 75080</p>
        <TextReveal as="h2" className="final-title">Get in touch.</TextReveal>
        <div data-final-action>
          <MagneticButton href="mailto:shashankchandra97@gmail.com">Send me an email</MagneticButton>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/shashankchandra97" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="tel:+19453081103">+1 945 308 1103</a>
          </div>
        </div>
      </div>
      <footer>
        <p>© 2026 Shashank Chandra · AI DevOps &amp; Cloud Engineer · UTD</p>
        <p>Cloud engineering · AI-driven automation · Developer productivity</p>
      </footer>
    </section>
  );
}
