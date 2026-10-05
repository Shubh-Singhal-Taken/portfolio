import type { Lens } from "./lenses";

/* Roles, newest first. Each bullet names the lenses it is evidence for,
   so a lens page shows only the bullets its reader cares about. */

export type ExperienceBullet = { text: string; lenses: Lens[] };

export type Experience = {
  org: string;
  role: string;
  /** Earlier role at the same organisation, shown beneath the current one. */
  previousRole?: { role: string; period: string };
  period: string;
  place: string;
  current?: boolean;
  bullets: ExperienceBullet[];
};

const ALL: Lens[] = ["software", "ai", "iot"];

export const experience: Experience[] = [
  {
    org: "Sanixor.AI",
    role: "Gen AI Full-Stack Intern",
    period: "Jan 2026 – Present",
    place: "Hybrid",
    current: true,
    bullets: [
      {
        text: "Build AI-powered full-stack applications with React, FastAPI, PostgreSQL and Docker for production GenAI workflows.",
        lenses: ["software", "ai"],
      },
      {
        text: "Integrate large language models and prompt-engineering pipelines for content generation, intelligent document processing and conversational features.",
        lenses: ["ai"],
      },
      {
        text: "Design and optimise REST APIs on FastAPI and PostgreSQL for secure data, authentication and communication between AI services and the frontend.",
        lenses: ["software", "ai"],
      },
    ],
  },
  {
    org: "CSED Club, GLA University",
    role: "President",
    previousRole: { role: "General Secretary", period: "Early 2025" },
    period: "May 2025 – Jun 2026",
    place: "Mathura, UP",
    bullets: [
      {
        text: "Led a 150+ member technical community and mentored 900+ students through workshops, bootcamps and hands-on training in Industry 4.0, AI, IoT and robotics.",
        lenses: ALL,
      },
      {
        text: "Planned and ran 10+ technical events, hackathons and industry sessions with corporate experts and faculty.",
        lenses: ALL,
      },
      {
        text: "Directed club operations, sponsorships, partnerships and cross-functional teams.",
        lenses: ALL,
      },
    ],
  },
];

/** Roles for one lens, keeping only that lens's bullets. */
export function experienceFor(lens: Lens): Experience[] {
  return experience.map((role) => ({
    ...role,
    bullets: role.bullets.filter((b) => b.lenses.includes(lens)),
  }));
}
