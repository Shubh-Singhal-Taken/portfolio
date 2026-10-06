import { BrainCircuit, Code2, Cpu, type LucideIcon } from "lucide-react";

/* Skills as the front page shows them: one group per discipline, the
   strongest few from each lens. The lens pages show their full resume
   skill groups from lenses.ts instead. */

export type SkillTier = {
  tier: string;
  caption: string;
  icon: LucideIcon;
  skills: string[];
};

export const skillTiers: SkillTier[] = [
  {
    tier: "Software",
    caption: "Backends, pipelines and the products on top of them",
    icon: Code2,
    skills: ["TypeScript", "Node.js", "FastAPI", "React", "MongoDB", "PostgreSQL", "Redis", "BullMQ", "Docker", "GCP Cloud Run"],
  },
  {
    tier: "AI",
    caption: "Models wired into real products and real hardware",
    icon: BrainCircuit,
    skills: ["LLMs", "OpenAI SDK", "RAG", "Prompt engineering", "LSTM", "OpenCV", "Edge AI", "Azure ML"],
  },
  {
    tier: "IoT",
    caption: "Sensors, controllers and the links between them",
    icon: Cpu,
    skills: ["ESP32", "Arduino", "Raspberry Pi", "MQTT", "ThingWorx", "LoRaWAN", "ROS", "Embedded C", "Pixhawk"],
  },
];

export const softSkills: { label: string }[] = [
  { label: "Leadership" },
  { label: "Problem solving" },
  { label: "Public speaking" },
  { label: "Team collaboration" },
  { label: "Communication" },
  { label: "Quick learner" },
  { label: "Project management" },
  { label: "Mentoring" },
];
