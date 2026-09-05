import { forwardRef, type HTMLAttributes } from "react";

type PinnedSectionProps = HTMLAttributes<HTMLElement>;

export const PinnedSection = forwardRef<HTMLElement, PinnedSectionProps>(
  ({ className = "", children, ...props }, ref) => (
    <section ref={ref} className={`pinned-section ${className}`} {...props}>
      {children}
    </section>
  ),
);

PinnedSection.displayName = "PinnedSection";
