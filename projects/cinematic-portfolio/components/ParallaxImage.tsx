"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ParallaxImage({ src, alt, className = "", priority = false }: ParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrapper = wrapperRef.current;
    const image = wrapper?.querySelector("img");
    if (!wrapper || !image) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      gsap.fromTo(
        image,
        { yPercent: -4, scale: 1.08 },
        {
          yPercent: 4,
          scale: 1.03,
          ease: "none",
          scrollTrigger: { trigger: wrapper, start: "top bottom", end: "bottom top", scrub: 0.65 },
        },
      );
    });
    return () => mm.revert();
  }, { scope: wrapperRef });

  return (
    <div ref={wrapperRef} className={`parallax-image ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" />
    </div>
  );
}
