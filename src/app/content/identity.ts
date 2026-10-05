/* Who the site is about. Links and handles are verbatim from the resumes. */

export const identity = {
  name: "Shubh Singhal",
  first: "Shubh",
  last: "Singhal",
  role: "Software, AI & IoT Engineer",
  site: "https://shubhsinghal.in",
  email: "shubhsinghal.work@gmail.com",
  github: "https://github.com/Shubh-Singhal-Taken",
  githubHandle: "Shubh-Singhal-Taken",
  linkedin: "https://linkedin.com/in/shubh-singhal-",
  linkedinHandle: "shubh-singhal-",
} as const;

export const aboutText =
  "I'm a software, AI and IoT engineer, and I like owning the whole stack of a problem: the sensor on the bench, the model that reads it, and the product people actually use. I've shipped a multi-tenant SaaS platform, fault-tolerant backends, LLM pipelines with multi-provider failover, and ESP32 systems deployed at life scale. Today I'm a Gen AI full-stack intern at Sanixor.AI; as President of the CSED Club at GLA University I led a 150+ member community and mentored 900+ students.";

export type Stat = {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  noCount?: boolean;
};

export const stats: Stat[] = [
  { target: 10, label: "Shipped builds" },
  { target: 7, label: "Awards & recognitions" },
  { target: 900, suffix: "+", label: "Students mentored" },
  { target: 2027, label: "Graduation", noCount: true },
];
