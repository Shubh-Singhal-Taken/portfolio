import {
  Binary,
  Bot,
  Brain,
  BrainCircuit,
  Cpu,
  Folder,
  Globe,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Mic,
  Radar,
  Rocket,
  ScrollText,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wrench,
  Zap,
  type LucideIcon
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   Single source of truth for all portfolio content.
   Facts, links, and handles are preserved verbatim from the
   original site + portfolio_content.md. Copy is elevated into
   case-study storytelling. Adding a project / achievement /
   journey entry is just appending an object to an array.
   ────────────────────────────────────────────────────────── */

/* Identity ------------------------------------------------- */

export const identity = {
  name: "Shubh Singhal",
  first: "Shubh",
  last: "Singhal",
  role: "AI/ML & IoT Engineer",
  eyebrow: "Available for AI / ML & IoT roles",
  headline:
    "I build intelligent systems that turn complex ideas into production reality, blending sensing, intelligence, and control with product-grade rigor.",
  email: "shubhsinghal.work@gmail.com",
  github: "https://github.com/Shubh-Singhal-Taken",
  githubHandle: "Shubh-Singhal-Taken",
  linkedin: "https://linkedin.com/in/shubh-singhal-",
  linkedinHandle: "shubh-singhal-",
  resume: "/resume.pdf"
} as const;

/* Navigation lives in src/app/lib/navigation.ts, which pairs each
   section with its translation key. */

/* About copy ----------------------------------------------- */

export const aboutText =
  "I'm an AI/ML and IoT engineer who likes the part of the problem where software meets something physical — a camera, a motor, a drone in the air. Across five flagship builds I've owned perception pipelines, embedded architecture, and the integration work that makes them survive contact with the real world. Alongside that I lead the CSED Club as General Secretary and have mentored 400+ students.";

/* Education ------------------------------------------------- */

export type EducationEntry = {
  qualification: string;
  institution: string;
  period: string;
  note?: string;
};

export type CertificationGroup = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

export const education: EducationEntry[] = [
  {
    qualification: "B.Tech · Computer Science & Engineering",
    institution: "GLA University, Mathura",
    period: "2022 — 2026",
    note: "Specialising in AI/ML, IoT and embedded systems"
  }
];

/* TODO(shubh): add your certifications here — each group renders as a
   collapsible branch under the Education tab. Delete any group you do
   not need; an empty array simply renders nothing. */
export const certifications: CertificationGroup[] = [
  {
    title: "Certifications & Coursework",
    icon: ScrollText,
    items: []
  }
];

/* Stats ---------------------------------------------------- */

export type Stat = {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  noCount?: boolean;
};

export const stats: Stat[] = [
  { target: 5, suffix: "+", label: "Flagship Builds" },
  { target: 4, label: "Awards & Selections" },
  { target: 400, suffix: "+", label: "Students Mentored" },
  { target: 2026, label: "Graduation", noCount: true }
];

/* About pillars -------------------------------------------- */

export type Pillar = { title: string; text: string; icon: LucideIcon };

export const pillars: Pillar[] = [
  {
    title: "AI & Computer Vision",
    text: "From lane detection to LiDAR-based SLAM, I architect perception pipelines that stay performant in real-world noise on edge hardware.",
    icon: BrainCircuit
  },
  {
    title: "Embedded & Robotics",
    text: "I integrate microcontrollers, flight controllers, sensors, and edge compute into autonomous systems that are fast, reliable, and field-ready.",
    icon: Radar
  },
  {
    title: "Leadership & Teaching",
    text: "I lead engineering teams, run flagship workshops, and have personally mentored 400+ students — turning ideas into shipped, award-winning builds.",
    icon: Binary
  }
];

/* Capabilities — the six hover cards. Expanded from the three
   pillars above so each card names one thing done end to end. ---- */

export type Capability = { title: string; text: string; icon: LucideIcon };

export const capabilities: Capability[] = [
  {
    title: "AI & Computer Vision",
    text: "From lane detection to LiDAR-based SLAM, I architect perception pipelines that stay performant in real-world noise on edge hardware.",
    icon: BrainCircuit
  },
  {
    title: "Embedded Systems",
    text: "Microcontroller firmware, deterministic motor control, and sensor integration in Embedded C — the deterministic layer beneath every autonomous build.",
    icon: Cpu
  },
  {
    title: "Robotics & Autonomy",
    text: "ROS architectures, SLAM, path planning, and flight control on Pixhawk — ground rovers and UAVs that navigate without a human in the loop.",
    icon: Bot
  },
  {
    title: "IoT & Edge AI",
    text: "Long-range LoRaWAN and MQTT links, ESP32 and Raspberry Pi nodes, and models compressed to run on the device rather than in a datacentre.",
    icon: Radar
  },
  {
    title: "Full-Stack Development",
    text: "Secure profiles, structured data capture, and AI-assisted analysis — the application layer that turns a working prototype into a usable product.",
    icon: Globe
  },
  {
    title: "Leadership & Mentoring",
    text: "I lead engineering teams, run flagship workshops, and have personally mentored 400+ students — turning ideas into shipped, award-winning builds.",
    icon: Users
  }
];

/* Education icon used by the About tab strip. */
export const educationIcon = GraduationCap;

/* Skills — three evidence-based tiers ---------------------- */

export type SkillTier = {
  tier: string;
  caption: string;
  icon: LucideIcon;
  skills: string[];
};

/* Accents are derived from the cyan→purple system at render time,
   so the palette stays disciplined rather than rainbow. */
export const skillTiers: SkillTier[] = [
  {
    tier: "Core",
    caption: "Daily drivers, proven in shipped builds",
    icon: Zap,
    skills: [
      "Python",
      "OpenCV",
      "Raspberry Pi",
      "Arduino",
      "ROS",
      "Embedded C",
      "Pixhawk / Mission Planner",
      "Sensor Integration",
      "Git & GitHub",
      "Linux"
    ]
  },
  {
    tier: "Working Knowledge",
    caption: "Used in projects, comfortable and productive",
    icon: Cpu,
    skills: [
      "TensorFlow",
      "PyTorch",
      "LiDAR / SLAM",
      "ESP32 / NodeMCU",
      "MQTT",
      "LoRaWAN",
      "Docker",
      "C / C++",
      "Gazebo / RViz",
      "Edge AI"
    ]
  },
  {
    tier: "Exploring",
    caption: "Actively learning through coursework and side builds",
    icon: Sparkles,
    skills: ["Kubernetes", "Terraform", "LangChain", "RAG Pipelines", "Fine-Tuning", "AWS"]
  }
];

export const softSkills: { label: string; icon: LucideIcon }[] = [
  { label: "Leadership", icon: Users },
  { label: "Problem Solving", icon: Lightbulb },
  { label: "Public Speaking", icon: Mic },
  { label: "Team Collaboration", icon: Users },
  { label: "Communication", icon: MessageCircle },
  { label: "Quick Learner", icon: Zap },
  { label: "Project Management", icon: Wrench },
  { label: "Mentoring", icon: Sparkles }
];

/* Projects ------------------------------------------------- */

export type Domain = "all" | "iot" | "ai-ml" | "web";

export const domains: { key: Domain; label: string; dir: string; icon: LucideIcon }[] = [
  { key: "all", label: "All Projects", dir: "./all", icon: Folder },
  { key: "iot", label: "IoT & Robotics", dir: "./iot", icon: Cpu },
  { key: "ai-ml", label: "AI / Vision", dir: "./ai-ml", icon: Brain },
  { key: "web", label: "Full-Stack", dir: "./web", icon: Globe }
];

export type Medal = "gold" | "silver" | "bronze" | "select";

export type Project = {
  title: string;
  slug: string;
  tagline: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  role: string;
  team?: string;
  award?: { label: string; medal: Medal };
  metric: string;
  tags: string[];
  domain: Exclude<Domain, "all">;
  date: string;
  year: number;
  featured?: boolean;
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    title: "AAROI",
    slug: "aaroi",
    tagline: "AI-Powered Autonomous Robotic Assistant",
    summary:
      "A modular ROS rover that maps unknown spaces with LiDAR SLAM, self-navigates to voice-commanded goals, and stays reachable over long-range LoRaWAN — no internet required.",
    problem:
      "Real-world robots in disaster zones, warehouses, and campuses must understand unfamiliar surroundings, navigate safely, and communicate over long distances with minimal human control.",
    approach:
      "Built a Raspberry Pi (ROS master) ↔ Arduino (slave) architecture: the Pi runs LiDAR SLAM, localization, path planning, and voice commands; the Arduino handles deterministic motor control. Serial communication synchronizes AI decisions with real-time actuation, and LoRaWAN adds secure off-grid comms.",
    result:
      "Won 2nd Place (Hardware) at the Google DevHouse Hackathon 2025, VIT Chennai — recognized for a robust distributed robotics architecture combining perception, autonomy, and long-range communication.",
    role: "Hardware & Embedded Systems Lead",
    award: { label: "2nd Place · Google DevHouse", medal: "silver" },
    metric: "Real-time 2D SLAM + autonomous navigation",
    tags: ["ROS", "LiDAR SLAM", "Raspberry Pi", "Arduino", "LoRaWAN", "Python"],
    domain: "ai-ml",
    date: "Apr 2025",
    year: 2025,
    featured: true
  },
  {
    title: "SARV",
    slug: "sarv",
    tagline: "Surveillance Armed Rescue Vehicle",
    summary:
      "A remotely operated unmanned ground vehicle for reconnaissance and disaster response — streaming live video and environmental telemetry while carrying mission-specific payloads.",
    problem:
      "Military and disaster-response teams need situational awareness in hazardous environments before putting personnel at risk during border surveillance and search-and-rescue.",
    approach:
      "Engineered the full hardware stack around a Raspberry Pi 4 with OpenCV vision — integrating gas, thermal, ultrasonic, and GPS sensors, an L298N/BO-motor drivetrain, and a modular chassis able to mount robotic arms or first-aid kits.",
    result:
      "Won 1st Place at Tech-Expo, demonstrating how low-cost embedded systems, computer vision, and IoT combine into a practical unmanned reconnaissance and rescue platform.",
    role: "Hardware Systems Lead",
    award: { label: "1st Place · Tech-Expo", medal: "gold" },
    metric: "Live video + multi-sensor hazard telemetry",
    tags: ["Raspberry Pi", "OpenCV", "Sensor Fusion", "GPS", "Embedded C"],
    domain: "iot",
    date: "2024–2025",
    year: 2024
  },
  {
    title: "GARUDA",
    slug: "garuda",
    tagline: "Autonomous Payload Delivery Quadcopter",
    summary:
      "A payload-capable quadcopter built on Pixhawk and Mission Planner that lifts and transports lightweight cargo with GPS-assisted stable flight.",
    problem:
      "Payload-carrying UAVs must balance lift capacity, flight stability, power consumption, and precise flight control — far harder than a camera drone.",
    approach:
      "Assembled the complete airframe and integrated propulsion (4× 1000KV BLDC + ESCs), Pixhawk 2.4.8 flight control, GPS/compass, telemetry, and Li-Po power distribution — then calibrated the stack in Mission Planner for reliable loaded flight.",
    result:
      "Became a flagship attraction of GLA University's Annual Technical Fest: during the inauguration, GARUDA carried and hoisted the university flag into the sky.",
    role: "Hardware Engineering & Integration",
    metric: "Flag-hoisting flight at fest inauguration",
    tags: ["Pixhawk", "Mission Planner", "BLDC + ESC", "GPS", "UAV"],
    domain: "iot",
    date: "2025",
    year: 2025
  },
  {
    title: "ADAS Kit",
    slug: "adas-kit",
    tagline: "Affordable Retrofit Driver-Assistance System",
    summary:
      "A low-cost retrofit kit that brings lane detection, forward-collision warnings, and blind-spot monitoring to conventional vehicles through edge computer vision.",
    problem:
      "Factory ADAS is expensive and limited to newer cars. Older vehicles get none of the safety benefits of intelligent driver assistance.",
    approach:
      "Designed a Raspberry Pi edge-computing architecture with a forward camera and OpenCV pipelines processing live frames for lane detection, vehicle-ahead identification, and low-latency driver alerts — all in a modular, sensor-expandable enclosure.",
    result:
      "Won 2nd Place at the Field Project Competition, judged on engineering depth, system architecture, and real-world commercialization potential.",
    role: "Hardware Architecture & CV Implementation",
    award: { label: "2nd Place · Field Project", medal: "silver" },
    metric: "Real-time lane + collision alerts on edge",
    tags: ["OpenCV", "Raspberry Pi", "Edge AI", "Computer Vision", "Embedded"],
    domain: "ai-ml",
    date: "2025",
    year: 2025
  },
  {
    title: "Mentify",
    slug: "mentify",
    tagline: "AI-Based Mental Wellness Checking System",
    summary:
      "A full-stack AI wellness platform that guides students through structured self-assessment and generates personalized wellness summaries — an awareness tool, not a diagnosis.",
    problem:
      "Students moving away for college face loneliness, academic pressure, and stress, yet often hesitate to seek help or recognize early signs of burnout.",
    approach:
      "Led a team of five to build secure profiles, a structured wellness questionnaire, and rule-based + AI-assisted analysis that turns responses into personalized reports and healthy-habit recommendations — with a modular architecture ready for conversational AI and mood tracking.",
    result:
      "Earned College-Level Selection at Smart India Hackathon 2023 — built just three weeks into my B.Tech, my first major engineering project and leadership experience.",
    role: "Team Lead",
    team: "5 members",
    award: { label: "SIH 2023 Selection", medal: "select" },
    metric: "Built 3 weeks into B.Tech · team of 5",
    tags: ["Python", "Machine Learning", "HTML/CSS/JS", "SQLite", "Full-Stack"],
    domain: "web",
    date: "Sep 2023",
    year: 2023
  }
];

/* Achievements --------------------------------------------- */

export type Achievement = {
  title: string;
  event: string;
  date: string;
  medal: Medal;
  description: string;
  projectSlug?: string;
};

export const achievements: Achievement[] = [
  {
    title: "1st Place — Tech-Expo",
    event: "SARV · Surveillance Armed Rescue Vehicle",
    date: "2024–2025",
    medal: "gold",
    description:
      "Top prize for an unmanned ground vehicle fusing embedded systems, computer vision, and IoT into a practical reconnaissance and rescue platform.",
    projectSlug: "sarv"
  },
  {
    title: "2nd Place — Hardware Category",
    event: "Google DevHouse Hackathon · VIT Chennai",
    date: "Apr 2025",
    medal: "silver",
    description:
      "Recognized for AAROI, an autonomous ROS rover combining LiDAR SLAM, voice-controlled navigation, and long-range LoRaWAN communication.",
    projectSlug: "aaroi"
  },
  {
    title: "2nd Place — Field Project Competition",
    event: "ADAS Kit · Retrofit Driver Assistance",
    date: "2025",
    medal: "silver",
    description:
      "Awarded for an affordable edge-CV retrofit bringing lane detection and collision alerts to conventional vehicles — judged on engineering depth and scalability.",
    projectSlug: "adas-kit"
  },
  {
    title: "College-Level Selection — SIH 2023",
    event: "Mentify · Smart India Hackathon",
    date: "Sep 2023",
    medal: "select",
    description:
      "Selected at the Smart India Hackathon for an AI mental-wellness platform — achieved leading a team of five just three weeks into engineering.",
    projectSlug: "mentify"
  }
];

/* Journey — chronological, interleaving builds, wins,
   leadership, workshops, and milestones -------------------- */

export type JourneyType = "leadership" | "achievement" | "milestone" | "workshop" | "project";

export type JourneyEntry = {
  date: string;
  year: number;
  order: number; // month-level ordering within the timeline
  title: string;
  org: string;
  detail: string;
  type: JourneyType;
};

export const journeyIcons: Record<JourneyType, LucideIcon> = {
  leadership: Users,
  achievement: Trophy,
  milestone: Target,
  workshop: Mic,
  project: Rocket
};

export const journeyLabels: Record<JourneyType, string> = {
  leadership: "Leadership",
  achievement: "Achievement",
  milestone: "Milestone",
  workshop: "Workshop",
  project: "Project"
};

/* Sorted newest-first for display. */
export const journey: JourneyEntry[] = [
  {
    date: "Dec 2025",
    year: 2025,
    order: 202512,
    title: "Promoted to General Secretary",
    org: "CSED Club, GLA University",
    detail:
      "Recognized for consistently organizing large-scale events and mentoring, I stepped up to coordinate the executive committee, technical teams, and the club's annual roadmap.",
    type: "leadership"
  },
  {
    date: "Apr 2025",
    year: 2025,
    order: 202504,
    title: "2nd Place — Google DevHouse Hackathon",
    org: "AAROI · VIT Chennai",
    detail:
      "Led hardware and embedded integration for AAROI, an autonomous ROS rover with LiDAR SLAM and LoRaWAN — placing 2nd in the Hardware category.",
    type: "achievement"
  },
  {
    date: "Mar 2025",
    year: 2025,
    order: 202503,
    title: "Student-by-Student Initiative",
    org: "GLA University · guided by the Vice Chancellor",
    detail:
      "Founding student mentor for a peer-learning program on Industry 4.0 tech. Personally mentored 200+ students across AI, IoT, Git, Docker, and embedded systems.",
    type: "leadership"
  },
  {
    date: "Jan 2025",
    year: 2025,
    order: 202501,
    title: "AI-IoT Survival Challenge — Squid Game Edition",
    org: "CSED Club · 200+ students",
    detail:
      "Lead organizer and lead technical speaker for a flagship immersive workshop teaching AI & IoT through hands-on Arduino, NodeMCU, and Raspberry Pi challenges.",
    type: "workshop"
  },
  {
    date: "2025",
    year: 2025,
    order: 202500,
    title: "GARUDA Quadcopter — Fest Flagship",
    org: "GLA University Annual Technical Fest",
    detail:
      "Engineered a payload-capable Pixhawk quadcopter that hoisted the university flag at the inauguration — one of the most memorable attractions of the fest.",
    type: "project"
  },
  {
    date: "Dec 2024",
    year: 2024,
    order: 202412,
    title: "Met Prof. Anil D. Sahasrabudhe",
    org: "Chairman, NETF · NAAC & NBA",
    detail:
      "Presented my projects and startup ideas to the NETF Chairman, discussing how AI, IoT, and robotics can reshape project-based engineering education.",
    type: "milestone"
  },
  {
    date: "2024–2025",
    year: 2024,
    order: 202410,
    title: "1st Place — Tech-Expo",
    org: "SARV · Surveillance Armed Rescue Vehicle",
    detail:
      "Led the hardware architecture for a surveillance and rescue rover — winning first place for a practical, low-cost unmanned reconnaissance platform.",
    type: "achievement"
  },
  {
    date: "Sep 2024",
    year: 2024,
    order: 202409,
    title: "Versio Custodia — Git & GitHub Workshop",
    org: "CSED Club · joined as PR Member",
    detail:
      "My first experience as both technical speaker and event organizer — teaching version control and DevOps fundamentals and beginning my leadership journey in the club.",
    type: "workshop"
  },
  {
    date: "2024",
    year: 2024,
    order: 202403,
    title: "Startup Mahakumbh 2024",
    org: "New Delhi",
    detail:
      "Attended one of India's largest startup gatherings — engaging with founders and leaders from Google, Flipkart, and Zomato, a turning point for my product thinking.",
    type: "milestone"
  },
  {
    date: "Sep 2023",
    year: 2023,
    order: 202309,
    title: "Mentify — SIH 2023 Selection",
    org: "Smart India Hackathon",
    detail:
      "Led a team of five to build an AI mental-wellness platform just three weeks into my B.Tech — my first major project, earning college-level selection at SIH.",
    type: "project"
  }
];

/* Medal tints ---------------------------------------------- */

/* Warm and cool greys rather than literal metals — the palette is
   monochrome, so rank reads as temperature, not colour. `select`
   borrows the one accent in the system. */
export const medalColors: Record<Medal, string> = {
  gold: "#d9c9a3",
  silver: "#c6cbd1",
  bronze: "#c0a08a",
  select: "#059400"
};

/* Project media -------------------------------------------- */

/* Drop an MP4 at public/videos/<slug>.mp4 and that project's carousel
   face and lightbox switch from the typographic poster to the clip.
   List the slugs you have supplied here. */
export const projectVideos: Partial<Record<string, string>> = {};

export const projectVideoSrc = (slug: string): string | undefined =>
  projectVideos[slug];

/* Marquee -------------------------------------------------- */

export const tickerItems = [
  "COMPUTER VISION", "ROS", "LiDAR SLAM", "AUTONOMOUS SYSTEMS", "EDGE AI",
  "EMBEDDED C", "RASPBERRY PI", "PIXHAWK", "SENSOR FUSION", "OPENCV",
  "LoRaWAN", "ROBOTICS", "IoT ENGINEERING", "HARDWARE + SOFTWARE CO-DESIGN"
];
