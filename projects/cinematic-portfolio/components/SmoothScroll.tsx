"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      anchors: { offset: -64 },
      duration: 1.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.88,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    const handleVisibility = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener("visibilitychange", handleVisibility);
    document.documentElement.classList.add("has-lenis");

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.documentElement.classList.remove("has-lenis");
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return children;
}
