"use client";

import { useState } from "react";
import { PlatformCore } from "./PlatformCore";
import { withBasePath } from "@/lib/basePath";
import { experiences, skills, projects, education, certifications, contact } from "@/lib/portfolioContent";


const chapters = [["about", "About"], ["experience", "Experience"], ["skills", "Skills"], ["projects", "Projects"], ["contact", "Contact"]];
const Arrow = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;

export function CinematicExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <PlatformCore />
      <div className="scene-scrim" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#hero" aria-label="Shashank Chandra, home">SC<span className="wordmark-dot">.</span></a>
        <nav aria-label="Primary navigation" className={menuOpen ? "navigation is-open" : "navigation"}>
          {chapters.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="resume-link" href={withBasePath("/resume/Shashank_Chandra_DevOps.pdf")} target="_blank" rel="noopener noreferrer">Résumé <Arrow /></a>
        <button className="menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
      </header>
      <main id="main-content">
        <section id="hero" className="chapter hero" data-core-phase="0" aria-labelledby="hero-title">
          <div className="hero-topline"><span className="status-dot" /> AI DEVOPS / PLATFORM ENGINEERING</div>
          <div className="hero-content">
            <p className="eyebrow">Shashank Chandra</p>
            <h1 id="hero-title">Intelligence.<br />Engineered<br />to <em>deliver.</em></h1>
            <p className="intro">AI-powered DevOps &amp; Cloud Engineer.<br />Building intelligent pipelines, resilient Azure infrastructure, and automation-first systems.</p>
            <div className="actions"><a className="button button-primary" href="#projects">Explore my work <Arrow /></a><a className="text-link" href="#contact">Let’s connect <span aria-hidden="true">↗</span></a></div>
          </div>
          <div className="object-caption" aria-hidden="true"><span className="caption-line" /><span>01 — CLOUD CORE<br /><small>Intelligence, infrastructure, in sync.</small></span></div>
          <div className="hero-bottom"><span>RICHARDSON, TX · UTD MS ITM · DEC 2026</span><a href="#about">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
        </section>
        <section id="about" className="chapter about content-right" data-core-phase="1" aria-labelledby="about-title">
          <div className="section-heading"><span className="chapter-number">01 / THE MINDSET</span><h2 id="about-title">Complex systems.<br /><em>Clear thinking.</em></h2></div>
          <div className="reading-column"><p className="large-copy">I work where cloud engineering, AI-driven automation, and developer productivity meet.</p><p>Graduate student at The University of Texas at Dallas, pursuing an MS in Information Technology &amp; Management, graduating December 2026. At Xome, part of Rocket Companies, I build intelligent DevOps workflows using AI tooling. Previously, at Deloitte, I designed and supported enterprise Azure environments.</p>
          <div className="impact-strip"><div><strong>$130K+</strong><span>Annual cloud savings<br />at Deloitte</span></div><div><strong>&lt;30 min</strong><span>Deployment time<br />down from four hours</span></div></div></div>
        </section>
        <section id="experience" className="chapter engineering" data-core-phase="2" aria-labelledby="experience-title">
          <div className="section-heading"><span className="chapter-number">02 / SYSTEMS THAT DELIVER</span><h2 id="experience-title">From architecture<br />to <em>execution.</em></h2></div>
          <div className="experience-list reading-column">{experiences.map((job, i) => <article key={job.id} className="experience-item"><div className="item-overline"><span>0{i + 1}</span><span>{job.period}</span></div><h3>{job.role}</h3><p className="company">{job.company} · {job.location}</p><ul>{job.points.map(point => <li key={point}>{point}</li>)}</ul><div className="tags">{job.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}</div>
        </section>
        <section id="skills" className="chapter capabilities content-right" data-core-phase="3" aria-labelledby="skills-title">
          <div className="section-heading"><span className="chapter-number">03 / CONNECTED CAPABILITIES</span><h2 id="skills-title">The right tools.<br /><em>One system.</em></h2></div>
          <div className="skills-list reading-column">{skills.map((skill, i) => <article key={skill.category}><span className="skill-index">0{i + 1}</span><div><h3>{skill.category}</h3><p>{skill.items.join(" · ")}</p></div></article>)}</div>
        </section>
        <section id="projects" className="chapter projects" data-core-phase="4" aria-labelledby="projects-title">
          <div className="section-heading"><span className="chapter-number">04 / SELECTED WORK</span><h2 id="projects-title">Ideas, made<br /><em>operational.</em></h2><p className="section-intro">Automation, cloud operations, and hands-on learning.</p></div>
          <div className="project-list">{projects.map((project, i) => <article key={project.id} className={`project project-chapter ${i % 2 ? "content-right" : ""}`} id={project.id} data-core-phase={i ? 5 : undefined}><div className="reading-column"><div className="project-overline"><span>PROJECT / 0{i + 1}</span><span>{project.eyebrow.replace("Projects · ", "").replace("DevOps lab · ", "")}</span></div><h3>{project.title}</h3><p>{project.body}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.href ? <a className="project-link" href={project.external ? project.href : withBasePath(project.href)} target={project.external ? "_blank" : undefined} rel={project.external ? "noopener noreferrer" : undefined}>{project.actionLabel} <Arrow /></a> : <span className="project-note">AI automation workflow</span>}</div></article>)}</div>
        </section>
        <section id="education" className="chapter education" data-core-phase="6" aria-labelledby="education-title">
          <div className="section-heading"><span className="chapter-number">05 / FOUNDATIONS</span><h2 id="education-title">Always <em>building.</em><br />Always learning.</h2></div>
          <div className="reading-column education-list">{education.map(item => <article key={item.institution}><p className="item-overline">{item.date}</p><h3>{item.institution}</h3><p>{item.degree}</p><p className="muted">{item.detail}</p></article>)}</div>
        </section>
        <section id="certifications" className="chapter credentials content-right" data-core-phase="7" aria-labelledby="certification-title">
          <div className="section-heading"><span className="chapter-number">06 / VERIFIED KNOWLEDGE</span><h2 id="certification-title">Built on expertise.<br /><em>Backed by credentials.</em></h2></div>
          <div className="reading-column"><p className="large-copy">Microsoft certified in Azure fundamentals and administration.</p><div className="certifications">{certifications.map(cert => <a href={cert.href} key={cert.name} target="_blank" rel="noopener noreferrer"><span><strong>{cert.name}</strong><small>{cert.detail}</small></span><Arrow /></a>)}</div></div>
        </section>
        <section id="contact" className="chapter contact" data-core-phase="8" aria-labelledby="contact-title">
          <div className="section-heading"><span className="chapter-number">07 / NEXT CONNECTION</span><h2 id="contact-title">Let’s build<br /><em>what’s next.</em></h2></div>
          <div className="reading-column"><p className="large-copy">Cloud engineering. AI-driven automation.<br />A conversation is a good place to start.</p><a className="button button-primary" href={`mailto:${contact.email}`}>Get in touch <Arrow /></a><div className="contact-links"><a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href={`tel:${contact.phone}`}>{contact.phoneLabel}</a><a href={withBasePath("/resume/Shashank_Chandra_DevOps.pdf")}>View résumé <Arrow /></a></div></div>
        </section>
      </main>
      <footer className="site-footer"><div><a className="footer-name" href="#hero">Shashank Chandra<span>AI DevOps &amp; Cloud Engineer</span></a><a href={`mailto:${contact.email}`}>{contact.email}</a></div></footer>
    </>
  );
}
