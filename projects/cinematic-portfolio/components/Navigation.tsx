"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
];

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!navRef.current) return;

    const trigger = ScrollTrigger.create({
      start: 48,
      end: "max",
      toggleClass: { targets: navRef.current, className: "nav-scrolled" },
    });

    gsap.from(navRef.current, {
      opacity: 0,
      y: -12,
      duration: 0.8,
      delay: 0.25,
      ease: "power3.out",
    });

    return () => trigger.kill();
  }, { scope: navRef });

  return (
    <nav ref={navRef} className="site-nav" aria-label="Primary navigation">
      <a className="brand-mark" href="#hero" aria-label="Shashank Chandra, back to top">
        Shashank <span>Chandra</span>
      </a>
      <div className="nav-links">
        {links.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <a className="nav-cta" href="#contact">Contact</a>
    </nav>
  );
}
