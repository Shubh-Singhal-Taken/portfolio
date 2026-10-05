import { Briefcase, Mic, Rocket, Target, Trophy, Users, type LucideIcon } from "lucide-react";

/* The path so far, newest first: work, leadership, wins, workshops and
   milestones. Projects live in projects.ts; only the moments that shaped
   the path appear here. Where only the year is known, `order` places the
   entry at the end of that year. */

export type JourneyType = "work" | "leadership" | "achievement" | "milestone" | "workshop" | "project";

export type JourneyEntry = {
  date: string;
  /** yyyymm, used for ordering. */
  order: number;
  title: string;
  org: string;
  detail: string;
  type: JourneyType;
};

export const journeyIcons: Record<JourneyType, LucideIcon> = {
  work: Briefcase,
  leadership: Users,
  achievement: Trophy,
  milestone: Target,
  workshop: Mic,
  project: Rocket,
};

export const journeyLabels: Record<JourneyType, string> = {
  work: "Work",
  leadership: "Leadership",
  achievement: "Achievement",
  milestone: "Milestone",
  workshop: "Workshop",
  project: "Project",
};

const entries: JourneyEntry[] = [
  {
    date: "2026",
    order: 202612,
    title: "Presented at the National Semiconductor Summit",
    org: "Automatic Water Management System · GLA University",
    detail:
      "Presented a life-scale ESP32 and ThingWorx system that monitors water flow and runs its pumps without anyone watching the tanks.",
    type: "achievement",
  },
  {
    date: "Jan 2026",
    order: 202601,
    title: "Gen AI Full-Stack Intern",
    org: "Sanixor.AI",
    detail:
      "Building AI-powered full-stack applications with React, FastAPI, PostgreSQL and Docker, and integrating LLM pipelines into production workflows.",
    type: "work",
  },
  {
    date: "2025",
    order: 202512,
    title: "1st Place, Venturathon 2025",
    org: "HackEval",
    detail:
      "Won with the first version of HackEval, a platform that runs a hackathon and evaluates submissions with LLMs; it became a production SaaS in 2026.",
    type: "achievement",
  },
  {
    date: "May 2025",
    order: 202505,
    title: "Promoted to President",
    org: "CSED Club, GLA University",
    detail:
      "Led a 150+ member technical community through June 2026, ran 10+ events, hackathons and industry sessions, and mentored 900+ students.",
    type: "leadership",
  },
  {
    date: "Apr 2025",
    order: 202504,
    title: "2nd Place, Google DevHouse Hackathon",
    org: "AAROI · VIT Chennai",
    detail:
      "Led hardware and embedded integration for AAROI, an autonomous ROS rover with LiDAR SLAM and LoRaWAN, placing 2nd in the Hardware category.",
    type: "achievement",
  },
  {
    date: "Mar 2025",
    order: 202503,
    title: "Student-by-Student Initiative",
    org: "GLA University · guided by the Vice Chancellor",
    detail:
      "Founding student mentor for a peer-learning programme on Industry 4.0 technology, mentoring 200+ students across AI, IoT, Git, Docker and embedded systems.",
    type: "leadership",
  },
  {
    date: "Early 2025",
    order: 202502,
    title: "General Secretary",
    org: "CSED Club, GLA University",
    detail:
      "Stepped up to coordinate the executive committee, the technical teams and the club's annual roadmap.",
    type: "leadership",
  },
  {
    date: "Jan 2025",
    order: 202501,
    title: "AI-IoT Survival Challenge: Squid Game Edition",
    org: "CSED Club · 200+ students",
    detail:
      "Lead organiser and lead technical speaker for a flagship workshop teaching AI and IoT through hands-on Arduino, NodeMCU and Raspberry Pi challenges.",
    type: "workshop",
  },
  {
    date: "2025",
    order: 202500,
    title: "GARUDA Quadcopter, Fest Flagship",
    org: "GLA University Annual Technical Fest",
    detail:
      "Built a payload-capable Pixhawk quadcopter that hoisted the university flag at the fest's inauguration.",
    type: "project",
  },
  {
    date: "Dec 2024",
    order: 202412,
    title: "Met Prof. Anil D. Sahasrabudhe",
    org: "Chairman, NETF · NAAC & NBA",
    detail:
      "Presented my projects and startup ideas to the NETF Chairman, discussing how AI, IoT and robotics can reshape project-based engineering education.",
    type: "milestone",
  },
  {
    date: "2024 – 2025",
    order: 202410,
    title: "1st Place, Tech-Expo",
    org: "SARV · Surveillance Armed Rescue Vehicle",
    detail:
      "Led the hardware architecture for a surveillance and rescue rover that took first place as a practical, low-cost unmanned reconnaissance platform.",
    type: "achievement",
  },
  {
    date: "Sep 2024",
    order: 202409,
    title: "Versio Custodia: Git & GitHub Workshop",
    org: "CSED Club · joined as PR Member",
    detail:
      "My first time as both technical speaker and event organiser, teaching version control and DevOps fundamentals.",
    type: "workshop",
  },
  {
    date: "2024",
    order: 202403,
    title: "Startup Mahakumbh 2024",
    org: "New Delhi",
    detail:
      "One of India's largest startup gatherings: conversations with founders and leaders from Google, Flipkart and Zomato that changed how I think about products.",
    type: "milestone",
  },
  {
    date: "Sep 2023",
    order: 202309,
    title: "Mentify: SIH 2023 Selection",
    org: "Smart India Hackathon",
    detail:
      "Led a team of five to build an AI mental-wellness platform three weeks into my B.Tech, earning college-level selection.",
    type: "project",
  },
];

export const journey = [...entries].sort((a, b) => b.order - a.order);
