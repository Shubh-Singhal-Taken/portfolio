import {
  BrainCircuit,
  Code2,
  Cpu,
  Globe,
  Lightbulb,
  MessageCircle,
  Mic,
  Radar,
  Sparkles,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

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

export const softSkills: { label: string; icon: LucideIcon }[] = [
  { label: "Leadership", icon: Users },
  { label: "Problem Solving", icon: Lightbulb },
  { label: "Public Speaking", icon: Mic },
  { label: "Team Collaboration", icon: Users },
  { label: "Communication", icon: MessageCircle },
  { label: "Quick Learner", icon: Zap },
  { label: "Project Management", icon: Wrench },
  { label: "Mentoring", icon: Sparkles },
];

/* The six capability cards. Retired in favour of the lens pages once
   those land; kept current until then. */
export type Capability = { title: string; text: string; icon: LucideIcon };

export const capabilities: Capability[] = [
  {
    title: "Backend & Distributed Systems",
    text: "REST APIs, queues and caches that keep working under load: bounded concurrency, retries with backoff, rate limits and idempotent writes.",
    icon: Code2,
  },
  {
    title: "Generative AI",
    text: "LLM pipelines in production: prompt engineering, document processing, automated evaluation and failover across model providers.",
    icon: Sparkles,
  },
  {
    title: "IoT & Embedded",
    text: "ESP32, Arduino and Raspberry Pi nodes, sensors and pumps, wired over MQTT and LoRaWAN into cloud dashboards.",
    icon: Radar,
  },
  {
    title: "AI & Computer Vision",
    text: "Predictive models on sensor data and vision pipelines that stay fast on edge hardware, from LSTM forecasting to lane detection.",
    icon: BrainCircuit,
  },
  {
    title: "Cloud & DevOps",
    text: "Dockerised services shipped through GitHub Actions to GCP Cloud Run and AWS, with secrets, schedulers and security scanning in the pipeline.",
    icon: Globe,
  },
  {
    title: "Leadership & Mentoring",
    text: "Led a 150+ member technical community, ran 10+ events and hackathons, and mentored 900+ students.",
    icon: Users,
  },
];
