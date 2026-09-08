"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/basePath";

/** Decorative enhancement: the complete portfolio remains ordinary HTML. */
export function PlatformCore() {
  const canvasHost = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<"loading" | "webgl" | "fallback">("loading");

  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;
    let cancelled = false;
    let revision = 0;
    let dispose: (() => void) | undefined;
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-width: 1024px)");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const initialize = async () => {
      const current = ++revision;
      dispose?.();
      dispose = undefined;
      setRenderer("loading");
      if (mobile.matches) return;
      try {
        const { createPlatformScene } = await import("../lib/platformScene");
        if (cancelled || current !== revision) return;
        dispose = createPlatformScene(host, {
          reducedMotion: preference.matches,
          onReady: () => setRenderer("webgl"),
          onFailure: () => setRenderer("fallback"),
        });
      } catch {
        if (!cancelled && current === revision) setRenderer("fallback");
      }
    };

    void initialize();
    preference.addEventListener("change", initialize);
    mobile.addEventListener("change", initialize);
    return () => {
      cancelled = true;
      revision++;
      preference.removeEventListener("change", initialize);
      mobile.removeEventListener("change", initialize);
      dispose?.();
    };
  }, []);

  return (
    <div className="platform-stage" data-renderer={renderer} aria-hidden="true">
      <picture className="platform-fallback" style={{ opacity: renderer === "webgl" ? 0 : 1 }}>
        <source media="(max-width: 767px), (pointer: coarse) and (max-width: 1024px)" srcSet={withBasePath("/images/mobile-model-0.webp")} />
        <img src={withBasePath("/images/mobile-model-0.webp")} width="800" height="600" alt="" />
      </picture>
      <div
        ref={canvasHost}
        className="platform-canvas"
        style={{ opacity: renderer === "webgl" ? 1 : 0 }}
      />
    </div>
  );
}
