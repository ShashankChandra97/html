"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";
import { ArrowIcon } from "./icons";

export function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 30, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 400, damping: 30, mass: 0.8 });

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.1);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.14);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      className="magnetic-button"
      href={href}
      onPointerLeave={reset}
      onPointerMove={handlePointerMove}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <span>{children}</span>
      <span className="button-arrow"><ArrowIcon /></span>
    </motion.a>
  );
}
