import type { LensRanks } from "./lenses";
import type { Medal } from "./projects";

export type Achievement = {
  title: string;
  event: string;
  date?: string;
  medal: Medal;
  description: string;
  projectSlug?: string;
  lenses: LensRanks;
};

export const achievements: Achievement[] = [
  {
    title: "1st Place, Venturathon 2025",
    event: "HackEval · AI hackathon management",
    date: "2025",
    medal: "gold",
    description:
      "Top prize for the first version of HackEval, a platform that runs a hackathon and scores submissions with LLM-based assessment.",
    projectSlug: "hackeval",
    lenses: { software: 1, ai: 1 },
  },
  {
    title: "1st Place, Tech-Expo",
    event: "SARV · Surveillance Armed Rescue Vehicle",
    date: "2024 – 2025",
    medal: "gold",
    description:
      "Top prize for an unmanned ground vehicle combining embedded systems, computer vision and IoT into a practical reconnaissance and rescue platform.",
    projectSlug: "sarv",
    lenses: { iot: 2 },
  },
  {
    title: "Presented at the National Semiconductor Summit",
    event: "Automatic Water Management System · GLA University",
    date: "2026",
    medal: "select",
    description:
      "Presented a life-scale ESP32 and ThingWorx water-distribution system that monitors flow and runs its pumps on its own.",
    projectSlug: "water-management",
    lenses: { iot: 1 },
  },
  {
    title: "2nd Place, Hardware Category",
    event: "Google DevHouse Hackathon · VIT Chennai",
    date: "Apr 2025",
    medal: "silver",
    description:
      "Recognised for AAROI, an autonomous ROS rover combining LiDAR SLAM, voice-controlled navigation and long-range LoRaWAN communication.",
    projectSlug: "aaroi",
    lenses: { iot: 3, ai: 3 },
  },
  {
    title: "2nd Place, Field Project Competition",
    event: "ADAS Kit · Retrofit driver assistance",
    date: "2025",
    medal: "silver",
    description:
      "Awarded for an affordable edge computer-vision retrofit that brings lane detection and collision alerts to conventional vehicles.",
    projectSlug: "adas-kit",
    lenses: { iot: 4, ai: 2 },
  },
  {
    title: "NPTEL Silver Medal",
    event: "Organisational Behaviour: Individual Dynamics in Organisation",
    medal: "silver",
    description: "Silver medal for outstanding performance in the NPTEL course.",
    lenses: { software: 3, ai: 5, iot: 6 },
  },
  {
    title: "College-Level Selection, SIH 2023",
    event: "Mentify · Smart India Hackathon",
    date: "Sep 2023",
    medal: "select",
    description:
      "Selected at the Smart India Hackathon for an AI mental-wellness platform, built leading a team of five three weeks into my B.Tech.",
    projectSlug: "mentify",
    lenses: { software: 2, ai: 4, iot: 5 },
  },
];

/* Rank reads as temperature, not colour: the palette is monochrome, so
   gold and silver are warm and cool greys and `select` borrows the one
   accent in the system. */
export const medalColors: Record<Medal, string> = {
  gold: "#d9c9a3",
  silver: "#c6cbd1",
  bronze: "#c0a08a",
  select: "#059400",
};
