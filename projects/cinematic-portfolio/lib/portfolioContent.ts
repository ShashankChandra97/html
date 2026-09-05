// Personal claims and links transcribed from the existing root index.html.
// Keep experience dates explicit; do not hardcode a drifting total-years figure.
export const contact = {
  name: "Shashank Chandra",
  role: "AI DevOps & Cloud Engineer",
  email: "shashankchandra97@gmail.com",
  linkedin: "https://www.linkedin.com/in/shashankchandra97",
  phone: "+19453081103",
  phoneLabel: "+1 945 308 1103",
  location: "Richardson, TX 75080",
};

export const experiences = [
  {
    id: "xome",
    role: "AI DevOps Platform Intern",
    company: "Xome · Part of Rocket Companies",
    location: "USA",
    period: "May 26, 2026 — Present",
    points: [
      "Orchestrated the AI-assisted delivery of dedicated Azure DevOps CI/CD pipelines for 6+ applications, translating application requirements into structured prompts and completing each tested pipeline within one week.",
      "Used SKILL.md and MCP servers to supply AI agents with project-specific context and tools, producing more relevant and consistent pipeline configurations.",
      "Guided AI generation of AKS architectures, Kubernetes manifests, Dockerfiles, and ACR integrations, iteratively refining outputs against application and deployment requirements.",
      "Defined and validated end-to-end Azure DevOps CI/CD workflows spanning application builds, testing, container image publishing to ACR, and deployments to AKS.",
      "Directed the AI-assisted creation of technical presentation decks and infrastructure cost analyses, turning project information into stakeholder-ready deliverables.",
    ],
    skills: ["Azure DevOps", "AI-Assisted CI/CD", "Prompt Engineering", "AKS", "Kubernetes", "Docker", "ACR", "SKILL.md", "MCP Servers"],
  },
  {
    id: "deloitte",
    role: "Analyst — Cloud Infrastructure Engineer",
    company: "Deloitte Support Services Pvt. Ltd",
    location: "Bengaluru, India",
    period: "July 2021 — December 2024",
    points: [
      "Designed, deployed, and supported enterprise-scale Azure infrastructure across multiple production subscriptions.",
      "Automated VM, certificate, and database administration using PowerShell and SQL, reducing manual effort by 60%+.",
      "Engineered and optimized Azure DevOps CI/CD pipelines, reducing deployment time from four hours to under 30 minutes.",
      "Delivered $130K+ in annual cloud savings through resource rightsizing and lifecycle-management policies.",
      "Remediated critical cloud vulnerabilities and maintained compliance with internal and client security standards.",
      "Earned a promotion in June 2023 and multiple Spot Awards for operational excellence.",
    ],
    skills: ["Azure", "CI/CD", "PowerShell", "SQL", "AZ-900", "AZ-104", "Promoted 2023", "Spot Awards"],
  },
];

export const skills = [
  { category: "Cloud Engineering", items: ["Azure VMs", "Key Vaults", "Storage", "Networking", "Disaster Recovery", "Cert Mgmt"] },
  { category: "DevOps", items: ["Docker", "Kubernetes", "Git", "Azure DevOps", "CI/CD Pipelines", "GitHub Actions"] },
  { category: "AI & Automation", items: ["SKILL.md", "MCP Servers", "Claude Code", "LLM Integration", "Prompt Engineering", "AI-driven DevOps"] },
  { category: "Programming", items: ["PowerShell", "Python", "SQL", "Bash", "C#", "HTML"] },
  { category: "Analysis & Monitoring", items: ["Power BI", "Excel", "Azure Monitor", "SQL Profiler", "SSMS", "Venafi"] },
  { category: "Security", items: ["Vuln Remediation", "Zero Trust", "Cert Lifecycle", "Compliance"] },
];

export const projects = [
  {
    id: "starways",
    title: "Star-Ways",
    eyebrow: "Web application",
    body: "Neighborhood parking spot booking platform built on Base44. Features real-time availability, a full admin dashboard, and robust data management — streamlining the complete parking reservation flow.",
    tags: ["Base44", "Web App", "Admin Dashboard", "Data Mgmt"],
    href: "https://starways-9662174b.base44.app",
    actionLabel: "Visit Star-Ways",
    external: true,
  },
  {
    id: "cloudveyra",
    title: "CloudVeyra Monitor",
    eyebrow: "Azure monitoring concept",
    body: "Interactive Azure monitoring concept that maps project resources into a unified operations dashboard. The demo uses realistic sample telemetry, so it works instantly without an Azure account or backend configuration.",
    tags: ["Azure", "Cloud Monitoring", "Static Demo", "Mock Telemetry"],
    href: "/projects/cloudveyra/index.html",
    actionLabel: "Launch demo",
    external: false,
  },

];

export const education = [
  { institution: "University of Texas at Dallas", degree: "MS — Information Technology & Management", date: "Expected December 2026", detail: "In progress · GPA 3.52 / 4.0" },
  { institution: "Christ University · Bangalore, India", degree: "BCA — Computer Science", date: "May 2021", detail: "GPA 3.42 / 4.0" },
];

export const certifications = [
  { name: "Microsoft AZ-900", detail: "Azure Fundamentals", href: "https://drive.google.com/file/d/1MHq9p2fx4J_EOK4V8R3w2pTXwXz_MGaA/view" },
  { name: "Microsoft AZ-104", detail: "Azure Administrator", href: "https://drive.google.com/file/d/1Ce81ABvDkgENXNNO-weDAa0dRf2geoAN/view" },
];
