"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PinnedSection } from "./PinnedSection";
import { TextReveal } from "./TextReveal";
import { withBasePath } from "@/lib/basePath";

const TOTAL_FRAMES = 120;
const FRAME_WINDOW = 12;
const USE_FRAME_ASSETS = process.env.NEXT_PUBLIC_FRAME_SEQUENCE === "true";

const experiences = [
  {
    id: "xome",
    index: "01 / 02",
    role: "AI DevOps Platform Intern",
    company: "Xome · Part of Rocket Companies · USA",
    period: "May 26, 2026 — Present",
    points: [
      <>Orchestrated the AI-assisted delivery of dedicated <strong>Azure DevOps CI/CD pipelines for 6+ applications</strong>, translating application requirements into structured prompts and completing each tested pipeline within one week.</>,
      <>Used <strong>SKILL.md and MCP servers</strong> to supply AI agents with project-specific context and tools, producing more relevant and consistent pipeline configurations.</>,
      <>Guided AI generation of <strong>AKS architectures, Kubernetes manifests, Dockerfiles, and ACR integrations</strong>, refining outputs against application and deployment requirements.</>,
      <>Defined and validated end-to-end <strong>Azure DevOps CI/CD workflows</strong> spanning builds, testing, container publishing to <strong>ACR</strong>, and deployments to <strong>AKS</strong>.</>,
      <>Directed AI-assisted technical presentations and infrastructure cost analyses, turning project information into stakeholder-ready deliverables.</>,
    ],
    skills: ["Azure DevOps", "AI-assisted CI/CD", "AKS", "Kubernetes", "Docker", "ACR", "SKILL.md", "MCP Servers"],
  },
  {
    id: "deloitte",
    index: "02 / 02",
    role: "Analyst — Cloud Infrastructure Engineer",
    company: "Deloitte Support Services Pvt. Ltd · Bengaluru, India",
    period: "July 2021 — December 2024",
    points: [
      <>Designed, deployed, and supported enterprise-scale <strong>Azure infrastructure</strong> across multiple production subscriptions.</>,
      <>Automated VM, certificate, and database administration using <strong>PowerShell and SQL</strong>, reducing manual effort by <strong>60%+</strong>.</>,
      <>Engineered and optimized <strong>Azure DevOps CI/CD pipelines</strong>, reducing deployment time from four hours to under <strong>30 minutes</strong>.</>,
      <>Delivered <strong>$130K+ in annual cloud savings</strong> through resource rightsizing and lifecycle-management policies.</>,
      <>Remediated critical cloud vulnerabilities and maintained compliance with internal and client security standards.</>,
      <>Earned a promotion in <strong>June 2023</strong> and multiple <strong>Spot Awards</strong> for operational excellence.</>,
    ],
    skills: ["Azure", "CI/CD", "PowerShell", "SQL", "AZ-900", "AZ-104", "Promoted 2023", "Spot Awards"],
  },
] as const;

const framePath = (frame: number) => withBasePath(`/frames/frame-${String(frame + 1).padStart(3, "0")}.webp`);

function drawImageCover(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawProceduralFrame(context: CanvasRenderingContext2D, width: number, height: number, frame: number) {
  const progress = frame / (TOTAL_FRAMES - 1);
  const centerX = width / 2;
  const centerY = height / 2;
  const unit = Math.min(width, height);

  const mix = (start: number, end: number) => Math.round(start + (end - start) * progress);
  const azure = `rgb(${mix(0, 70)}, ${mix(122, 66)}, ${mix(255, 214)})`;
  const deepBlue = `rgb(${mix(2, 45)}, ${mix(61, 38)}, ${mix(138, 122)})`;

  context.clearRect(0, 0, width, height);
  const background = context.createRadialGradient(centerX * 1.06, centerY * 0.82, 0, centerX, centerY, unit * 1.08);
  background.addColorStop(0, azure);
  background.addColorStop(0.48, deepBlue);
  background.addColorStop(1, progress < 0.5 ? "#03152e" : "#140d35");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  // A low-contrast perspective plane grounds the pipeline without introducing a card or enclosure.
  context.save();
  context.strokeStyle = "rgba(174, 174, 178, .09)";
  context.lineWidth = Math.max(1, unit * 0.0012);
  for (let index = -5; index <= 5; index += 1) {
    const x = centerX + index * unit * 0.12;
    context.beginPath();
    context.moveTo(centerX + (x - centerX) * 0.26, centerY * 0.74);
    context.lineTo(x * 1.12 - centerX * 0.12, height * 0.88);
    context.stroke();
  }
  for (let index = 0; index < 7; index += 1) {
    const y = centerY * 0.78 + index * unit * 0.067;
    context.beginPath();
    context.moveTo(width * 0.16, y);
    context.lineTo(width * 0.84, y);
    context.stroke();
  }
  context.restore();

  const drift = Math.sin(progress * Math.PI * 2) * unit * 0.025;
  const x0 = centerX - unit * 0.39;
  const y0 = centerY + unit * 0.1;
  const x1 = centerX - unit * 0.1;
  const y1 = centerY - unit * 0.22 + drift;
  const x2 = centerX + unit * 0.13;
  const y2 = centerY + unit * 0.2 - drift;
  const x3 = centerX + unit * 0.39;
  const y3 = centerY - unit * 0.04;

  // One continuous bezier represents source, build, cluster, and observability stages.
  context.save();
  context.lineCap = "round";
  context.shadowColor = "rgba(0, 122, 255, .5)";
  context.shadowBlur = unit * 0.035;
  const pipelineGradient = context.createLinearGradient(x0, y0, x3, y3);
  pipelineGradient.addColorStop(0, "#30b0c7");
  pipelineGradient.addColorStop(0.5, "#007aff");
  pipelineGradient.addColorStop(1, "#5856d6");
  context.strokeStyle = pipelineGradient;
  context.lineWidth = Math.max(3, unit * 0.008);
  context.beginPath();
  context.moveTo(x0, y0);
  context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
  context.stroke();
  context.restore();

  const cubicPoint = (t: number) => {
    const inverse = 1 - t;
    return {
      x: inverse ** 3 * x0 + 3 * inverse ** 2 * t * x1 + 3 * inverse * t ** 2 * x2 + t ** 3 * x3,
      y: inverse ** 3 * y0 + 3 * inverse ** 2 * t * y1 + 3 * inverse * t ** 2 * y2 + t ** 3 * y3,
    };
  };

  const stages = [0, 0.34, 0.68, 1].map(cubicPoint);
  stages.forEach((point, index) => {
    const radius = unit * (index === 1 || index === 2 ? 0.028 : 0.022);
    context.beginPath();
    context.fillStyle = "#1c1c1e";
    context.strokeStyle = index < 2 ? "#30b0c7" : "#8f8cff";
    context.lineWidth = Math.max(2, unit * 0.004);
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  });

  const pulse = cubicPoint(progress);
  context.save();
  context.shadowColor = "#ffffff";
  context.shadowBlur = unit * 0.025;
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(pulse.x, pulse.y, unit * 0.01, 0, Math.PI * 2);
  context.fill();
  context.restore();

  // The cloud topology evolves with scroll and keeps the experience domain-specific.
  const cloudX = centerX + unit * 0.18;
  const cloudY = centerY - unit * 0.2;
  context.save();
  context.translate(cloudX, cloudY);
  context.rotate((progress - 0.5) * 0.14);
  context.strokeStyle = "rgba(255,255,255,.2)";
  context.lineWidth = Math.max(1, unit * 0.002);
  for (const scale of [1, 1.28, 1.58]) {
    context.beginPath();
    context.ellipse(0, 0, unit * 0.12 * scale, unit * 0.045 * scale, progress * 0.3, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();

  context.fillStyle = "rgba(255,255,255,.62)";
  context.font = `${Math.max(11, unit * 0.018)}px ui-monospace, SFMono-Regular, monospace`;
  context.fillText(`AZURE / DELIVERY FLOW ${String(frame + 1).padStart(3, "0")}`, width * 0.06, height * 0.91);
}

export function ImageSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const images = new Map<number, HTMLImageElement>();
    const unavailable = new Set<number>();
    const playhead = { frame: 0 };
    let animationFrame = 0;
    let logicalWidth = 0;
    let logicalHeight = 0;

    const render = () => {
      animationFrame = 0;
      const frame = Math.round(playhead.frame);
      const image = images.get(frame);
      if (image?.complete && image.naturalWidth > 0) drawImageCover(context, image, logicalWidth, logicalHeight);
      else drawProceduralFrame(context, logicalWidth, logicalHeight, frame);
    };

    const requestRender = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(render);
    };

    const loadFrame = (frame: number) => {
      if (!USE_FRAME_ASSETS || images.has(frame) || unavailable.has(frame) || frame < 0 || frame >= TOTAL_FRAMES) return;
      const image = new Image();
      images.set(frame, image);
      image.decoding = "async";
      image.onload = requestRender;
      image.onerror = () => {
        images.delete(frame);
        unavailable.add(frame);
      };
      image.src = framePath(frame);
    };

    const preloadAround = (frame: number) => {
      loadFrame(frame);
      for (let offset = 1; offset <= FRAME_WINDOW; offset += 1) {
        loadFrame(frame + offset);
        loadFrame(frame - offset);
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      logicalWidth = Math.max(1, Math.round(bounds.width * dpr));
      logicalHeight = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width !== logicalWidth || canvas.height !== logicalHeight) {
        canvas.width = logicalWidth;
        canvas.height = logicalHeight;
      }
      requestRender();
      ScrollTrigger.refresh();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    preloadAround(0);

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
      },
      (media) => {
      if (!media.conditions?.motion) return;
      const desktop = media.conditions.desktop;
      const phases = gsap.utils.toArray<HTMLElement>("[data-experience-phase]", section);
      const progressBar = section.querySelector(".sequence-progress span");
      const xomeLines = gsap.utils.toArray<HTMLElement>("[data-experience-line]", phases[0]);
      const deloitteLines = gsap.utils.toArray<HTMLElement>("[data-experience-line]", phases[1]);
      const xomeSkills = phases[0].querySelector("[data-experience-skills]");
      const deloitteSkills = phases[1].querySelector("[data-experience-skills]");

      gsap.set(phases, { autoAlpha: 0 });
      gsap.set(phases[0], { autoAlpha: 1, y: 0 });
      gsap.set([...xomeLines, ...deloitteLines], { autoAlpha: 0, y: 14 });
      gsap.set([xomeSkills, deloitteSkills], { autoAlpha: 0, y: 10 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${desktop ? 540 : 480}%`,
          pin: true,
          scrub: desktop ? 0.65 : 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(playhead, {
          frame: TOTAL_FRAMES - 1,
          duration: 10,
          snap: "frame",
          onUpdate: () => {
            requestRender();
            preloadAround(Math.round(playhead.frame));
          },
        }, 0)
        .to(progressBar, { scaleX: 1, duration: 10 }, 0)
        .fromTo(phases[0], { y: 16 }, { y: 0, duration: 0.42, immediateRender: false }, 0.08)
        .to(xomeLines, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.44 }, 0.48)
        .to(xomeSkills, { autoAlpha: 1, y: 0, duration: 0.42 }, 2.82)
        .to(phases[0], { autoAlpha: 0, y: -18, duration: 0.38 }, 3.72)
        .fromTo(
          phases[1],
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.48, immediateRender: false },
          4.08,
        )
        .to(deloitteLines, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.4 }, 4.62)
        .to(deloitteSkills, { autoAlpha: 1, y: 0, duration: 0.42 }, 7.06)
        .to(phases[1], { autoAlpha: 0, y: -18, duration: 0.42 }, 9.46);
      },
    );

    return () => {
      mm.revert();
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
      images.clear();
    };
  }, { scope: sectionRef });

  return (
    <PinnedSection ref={sectionRef} id="experience" className="sequence-section">
      <canvas ref={canvasRef} className="sequence-canvas" role="img" aria-label="Animated delivery pipeline connecting source, build, Kubernetes, and observability stages" />
      <div className="sequence-vignette" aria-hidden="true" />
      {experiences.map((experience) => (
        <article className={`experience-panel experience-${experience.id}`} data-experience-phase key={experience.id}>
          <div className="experience-heading">
            <p className="eyebrow">Experience · {experience.index}</p>
            <p className="experience-company">{experience.company}</p>
            <TextReveal as="h2" className="experience-role">{experience.role}</TextReveal>
            <p className="experience-period">{experience.period}</p>
          </div>
          <ul className="experience-list">
            {experience.points.map((point, index) => <li data-experience-line key={index}>{point}</li>)}
          </ul>
          <div className="experience-skills" data-experience-skills aria-label="Technologies and recognition">
            {experience.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </article>
      ))}
      <div className="sequence-progress" aria-hidden="true"><span /></div>
    </PinnedSection>
  );
}
