"use client";

import { useEffect, useRef, useState } from "react";

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
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const initialize = async () => {
      const current = ++revision;
      dispose?.();
      dispose = undefined;
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
    return () => {
      cancelled = true;
      revision++;
      preference.removeEventListener("change", initialize);
      dispose?.();
    };
  }, []);

  return (
    <div className="platform-stage" data-renderer={renderer} aria-hidden="true">
      <svg
        className="platform-fallback"
        viewBox="0 0 700 700"
        fill="none"
        style={{ opacity: renderer === "webgl" ? 0 : 1 }}
        focusable="false"
      >
        <defs>
          <linearGradient id="cloud-silver" x1="150" y1="200" x2="510" y2="470" gradientUnits="userSpaceOnUse"><stop stopColor="#e7f3ff"/><stop offset=".48" stopColor="#9ec7ee"/><stop offset="1" stopColor="#3472a7"/></linearGradient>
          <linearGradient id="cloud-edge" x1="200" y1="360" x2="450" y2="510" gradientUnits="userSpaceOnUse"><stop stopColor="#6ba3d5"/><stop offset="1" stopColor="#205a8f"/></linearGradient>
        </defs>
        <ellipse cx="350" cy="505" rx="180" ry="22" fill="#bad1e9" opacity=".2"/>
        <path d="M175 425c-68 0-91-100-28-127 4-86 103-117 156-60 47-86 179-48 186 46 87-6 127 126 32 154H190Z" fill="url(#cloud-edge)" transform="translate(0 19)"/>
        <path d="M175 425c-68 0-91-100-28-127 4-86 103-117 156-60 47-86 179-48 186 46 87-6 127 126 32 141H175Z" fill="url(#cloud-silver)" stroke="#719dc4" strokeWidth="2"/>
        <g stroke="#edf7ff" strokeWidth="3" opacity=".75"><path d="M182 307h303M162 350h360M174 392h340M224 276v144M272 283v137M320 260v160M368 248v172M416 265v155M464 312v108"/></g>
        <g fill="#2179bd"><circle cx="246" cy="371" r="5"/><circle cx="389" cy="327" r="5"/><circle cx="439" cy="371" r="5"/></g>
      </svg>
      <div
        ref={canvasHost}
        className="platform-canvas"
        style={{ opacity: renderer === "webgl" ? 1 : 0 }}
      />
    </div>
  );
}
