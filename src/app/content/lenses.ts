/* The three professional profiles the site is read through.

   Resumes go in public/resume/ as shubh-singhal-<software|ai|iot>-
   engineer.pdf; set each lens's `resume` once its file is there.

   Each lens is its own page (/software, /ai, /iot) that its resume links
   to. Everything else in content/ is tagged with the lenses it belongs to
   and its rank within each, and the lens pages compose from that. */

export const LENSES = ["software", "ai", "iot"] as const;
export type Lens = (typeof LENSES)[number];

/** Per-lens rank: present means "show on this lens", lower ranks first. */
export type LensRanks = Partial<Record<Lens, number>>;

export type SkillGroup = { label: string; skills: string[] };

export type LensProfile = {
  id: Lens;
  path: string;
  /** Short switcher label. */
  label: string;
  /** Job title this lens presents. */
  role: string;
  headline: string;
  /** ≤ 20 words under the headline. */
  sub: string;
  /** Search-result and link-preview summary for the lens page. */
  description: string;
  /** Web copy of the matching resume (no phone number). Left unset until
      the PDF is in public/resume/, so no page ever links to a missing file. */
  resume?: string;
  skills: SkillGroup[];
  /** True while the lens is assembled without its own resume. */
  provisional?: boolean;
};

export const lenses: Record<Lens, LensProfile> = {
  software: {
    id: "software",
    path: "/software",
    label: "Software",
    role: "Software Engineer",
    headline: "I build backend systems that keep working under load.",
    sub: "Queues, retries, caching and LLM services, shipped in Node.js, FastAPI and Docker.",
    description:
      "Software engineer building fault-tolerant backends: BullMQ pipelines, Redis caching, a 50-API benchmarking service and LLM platforms in Node.js, FastAPI and Docker.",
    skills: [
      {
        label: "Languages & CS",
        skills: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "OOP", "Data Structures & Algorithms"],
      },
      {
        label: "Backend & APIs",
        skills: ["Node.js", "Express.js", "FastAPI", "REST APIs", "Multi-tier architecture", "Background workers", "Event-driven architecture"],
      },
      {
        label: "Distributed systems",
        skills: ["Redis", "BullMQ", "Concurrency", "Rate limiting", "Retries & backoff", "Idempotency", "Caching"],
      },
      {
        label: "Data",
        skills: ["MongoDB", "PostgreSQL", "MySQL", "PyMongo", "Indexing", "Aggregation", "Data modeling", "Query optimization"],
      },
      {
        label: "Frontend",
        skills: ["React", "React 19", "Vite", "Tailwind CSS", "React Router", "Framer Motion"],
      },
      {
        label: "Cloud & DevOps",
        skills: ["Docker", "GitHub Actions", "CI/CD", "AWS", "GCP Cloud Run", "Cloud Scheduler", "Secret Manager", "Azure"],
      },
      {
        label: "Integrations",
        skills: ["Google OAuth2", "Gmail API", "Calendar API", "Tasks API", "Firebase FCM", "Playwright", "BeautifulSoup"],
      },
    ],
  },

  ai: {
    id: "ai",
    path: "/ai",
    label: "AI",
    role: "AI Engineer",
    headline: "I put language models into products people use.",
    sub: "LLM pipelines, multi-provider failover and automated evaluation, from Sanixor.AI to HackEval.",
    description:
      "AI engineer putting language models into production: LLM evaluation pipelines, five-provider failover, LSTM forecasting and edge computer vision.",
    provisional: true,
    skills: [
      {
        label: "GenAI",
        skills: ["LLMs", "AI agents", "OpenAI SDK", "RAG", "Prompt engineering", "Multi-provider LLM integration", "LLM evaluation"],
      },
      {
        label: "Machine learning",
        skills: ["Python", "LSTM", "Predictive models", "AI inference", "Azure ML"],
      },
      {
        label: "Computer vision",
        skills: ["OpenCV", "Edge AI", "LiDAR SLAM", "Lane & collision detection"],
      },
      {
        label: "Serving & pipelines",
        skills: ["FastAPI", "Redis", "BullMQ", "Docker", "Async processing", "PostgreSQL", "MongoDB"],
      },
      {
        label: "Cloud",
        skills: ["Azure", "GCP Cloud Run", "AWS", "GitHub Actions"],
      },
    ],
  },

  iot: {
    id: "iot",
    path: "/iot",
    label: "IoT",
    role: "IoT Engineer",
    headline: "I wire sensors, pumps and models into systems that run on their own.",
    sub: "ESP32, MQTT and ThingWorx, deployed at life scale and presented at the National Semiconductor Summit.",
    description:
      "IoT engineer wiring ESP32 sensors, pumps and LSTM models into systems deployed at life scale and presented at the National Semiconductor Summit.",
    skills: [
      {
        label: "Embedded",
        skills: ["C", "Embedded C", "Python", "ESP32", "Arduino", "NodeMCU", "Raspberry Pi", "GPIO", "Edge computing"],
      },
      {
        label: "IoT & communication",
        skills: ["MQTT", "ThingWorx", "LoRaWAN", "REST APIs", "Sensor telemetry", "Device-to-cloud"],
      },
      {
        label: "Sensors & hardware",
        skills: ["Soil moisture", "DHT22", "DS18B20", "Water flow", "LiDAR", "Motors", "Relays", "Actuators"],
      },
      {
        label: "Robotics",
        skills: ["ROS", "Computer vision", "Autonomous systems", "Motor control", "Real-time control", "Pixhawk"],
      },
      {
        label: "AI for IoT",
        skills: ["Machine learning", "LSTM", "FastAPI", "AI inference", "Predictive systems"],
      },
      {
        label: "Cloud & tools",
        skills: ["Azure", "AWS", "Docker", "GitHub Actions", "Arduino IDE", "Git"],
      },
    ],
  },
};

/** Sort items that carry lens ranks for one lens, dropping the rest. */
export function forLens<T extends { lenses: LensRanks }>(items: T[], lens: Lens): T[] {
  return items
    .filter((item) => item.lenses[lens] !== undefined)
    .sort((a, b) => (a.lenses[lens] as number) - (b.lenses[lens] as number));
}
