import type { LensRanks } from "./lenses";

/* Every build, once. `lenses` says which profile pages show it and in
   what order; `order` is its place on the front page. Write-ups use only
   facts from the resumes and the original portfolio content. */

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
  date: string;
  /** Front-page order. */
  order: number;
  lenses: LensRanks;
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    title: "HackEval",
    slug: "hackeval",
    tagline: "AI-powered hackathon management and evaluation",
    summary:
      "A multi-tenant SaaS platform that runs a hackathon end to end and evaluates submissions automatically, scoring slide decks and GitHub repositories with LLM-based assessment.",
    problem:
      "Hackathon judging doesn't scale. Dozens of teams submit decks and repositories at once, judges get minutes per team, and copied work slips through.",
    approach:
      "Role-based workflows for admins, judges, mentors and participants, on Node.js, Express and FastAPI services over MongoDB. The long-running work (document processing, GitHub repository analysis, plagiarism detection and AI-generated evaluation reports) runs as Redis and BullMQ jobs, and every service is containerised with Docker.",
    result:
      "The first version won 1st place at Venturathon 2025. It then grew into a production multi-tenant platform, built and deployed in 2026.",
    role: "Solo build: architecture, backend, AI pipeline and deployment",
    award: { label: "1st Place · Venturathon 2025", medal: "gold" },
    metric: "LLM scoring of decks and repositories",
    tags: ["React", "Node.js", "Express", "FastAPI", "MongoDB", "Redis", "BullMQ", "Docker", "LLMs"],
    date: "2025 – 2026",
    order: 1,
    lenses: { software: 2, ai: 1 },
  },
  {
    title: "BitBench",
    slug: "bitbench",
    tagline: "Cross-platform developer benchmarking",
    summary:
      "A backend that pulls a developer's activity from six external services and turns it into one fair, comparable score.",
    problem:
      "Developer activity is scattered across platforms that measure different things in different units, so there is no fair way to compare one profile with another.",
    approach:
      "A multi-tier TypeScript and Express service with 50 REST APIs and 10 data models over MongoDB. Ingestion runs through a BullMQ pipeline with bounded concurrency, exponential-backoff retries, rate limiting and idempotent upserts, batching 50 users per GraphQL request behind a Redis cache.",
    result:
      "Up to 50× fewer GraphQL round trips. A scoring engine built on percentile normalisation, exponential time decay and weighted geometric means makes very different kinds of activity comparable. Deployed on AWS with Docker.",
    role: "Solo build: API design, ingestion pipeline, scoring engine",
    metric: "Up to 50× fewer API round trips",
    tags: ["TypeScript", "Node.js", "Express", "MongoDB", "Redis", "BullMQ", "Docker", "AWS"],
    date: "Mar – Apr 2026",
    order: 2,
    lenses: { software: 1 },
  },
  {
    title: "Automatic Water Management System",
    slug: "water-management",
    tagline: "Life-scale IoT water distribution",
    summary:
      "ESP32 controllers that monitor water flow and drive pumps on their own, deployed on a physical life-scale setup and connected to a ThingWorx cloud dashboard.",
    problem:
      "Water distribution on campus-scale setups still depends on someone watching the tanks and switching pumps by hand.",
    approach:
      "ESP32 controllers wired to water-flow sensors and motorised pumps, with a device-control and telemetry pipeline over MQTT into the ThingWorx IoT platform for real-time flow monitoring, pump control and system status.",
    result:
      "Validated on a life-scale installation (sensor readings, actuator response, device communication and cloud visualisation under real operating conditions) and presented at the National Semiconductor Summit at GLA University.",
    role: "Solo build: hardware, firmware, telemetry and dashboard",
    award: { label: "National Semiconductor Summit", medal: "select" },
    metric: "Deployed at life scale",
    tags: ["ESP32", "Flow sensors", "Pumps", "MQTT", "ThingWorx"],
    date: "Jan 2026",
    order: 3,
    lenses: { iot: 1 },
  },
  {
    title: "AI Smart Irrigation System",
    slug: "smart-irrigation",
    tagline: "Predictive irrigation with IoT sensing and an LSTM",
    summary:
      "Sensors in the soil and air feed an LSTM model that decides when to water, so irrigation runs on prediction instead of a timer.",
    problem:
      "Fixed irrigation schedules waste water on wet days and miss dry spells, and checking a field by hand doesn't scale.",
    approach:
      "An ESP32 sensor network (soil moisture, DHT22, DS18B20 and water flow) streaming into ThingWorx, with an LSTM model served through FastAPI on Azure that forecasts demand and schedules the pump.",
    result:
      "A closed loop from sensing to inference to automated pump control with minimal human intervention, applying Industry 4.0 principles to smart agriculture.",
    role: "Solo build: sensor network, model, serving and control loop",
    metric: "LSTM-driven pump scheduling",
    tags: ["ESP32", "Python", "LSTM", "FastAPI", "Azure ML", "ThingWorx", "Docker"],
    date: "Aug – Dec 2025",
    order: 4,
    lenses: { iot: 2, ai: 3 },
  },
  {
    title: "JobForge",
    slug: "jobforge",
    tagline: "Cloud-native career platform",
    summary:
      "One place for job discovery, resumes, ATS analysis, tasks and applications, with AI features that keep working when a model provider goes down.",
    problem:
      "A job search is spread across boards, documents, inboxes and calendars, and AI tools built on a single model provider fail whenever that provider does.",
    approach:
      "React 19, FastAPI and MongoDB Atlas, with compound, sparse, full-text and TTL indexes for user isolation, automatic expiry and search. AI runs through the OpenAI SDK with failover across five LLM providers, alongside Gmail, Calendar, Tasks and Firebase Cloud Messaging integrations.",
    result:
      "Deployed on GCP Cloud Run through GitHub Actions with Workload Identity Federation, Cloud Scheduler, Artifact Registry and Secret Manager, plus automated tests, security scanning and deployment checks. Packaged for mobile with Capacitor.",
    role: "Solo build: product, backend, AI integration and cloud deployment",
    metric: "5-provider LLM failover",
    tags: ["React 19", "FastAPI", "Python", "MongoDB Atlas", "Docker", "GCP Cloud Run", "GitHub Actions", "Capacitor"],
    date: "Jun – Aug 2026",
    order: 5,
    lenses: { software: 3, ai: 2 },
  },
  {
    title: "SARV",
    slug: "sarv",
    tagline: "Surveillance Armed Rescue Vehicle",
    summary:
      "A remotely operated unmanned ground vehicle for reconnaissance and disaster response, streaming live video and environmental telemetry while carrying mission-specific payloads.",
    problem:
      "Military and disaster-response teams need situational awareness in hazardous environments before putting personnel at risk during border surveillance and search and rescue.",
    approach:
      "The full hardware stack around a Raspberry Pi 4 with OpenCV vision: gas, thermal, ultrasonic and GPS sensors, an L298N and BO-motor drivetrain, and a modular chassis that can mount a robotic arm or a first-aid kit.",
    result:
      "Won 1st place at Tech-Expo, showing how low-cost embedded systems, computer vision and IoT combine into a practical unmanned reconnaissance and rescue platform.",
    role: "Hardware systems lead",
    award: { label: "1st Place · Tech-Expo", medal: "gold" },
    metric: "Live video and multi-sensor hazard telemetry",
    tags: ["Raspberry Pi", "OpenCV", "Sensor fusion", "GPS", "Embedded C"],
    date: "2024 – 2025",
    order: 6,
    lenses: { iot: 3 },
  },
  {
    title: "AAROI",
    slug: "aaroi",
    tagline: "AI-powered autonomous robotic assistant",
    summary:
      "A modular ROS rover that maps unknown spaces with LiDAR SLAM, navigates itself to voice-commanded goals, and stays reachable over long-range LoRaWAN with no internet.",
    problem:
      "Robots in disaster zones, warehouses and campuses have to understand unfamiliar surroundings, navigate safely and communicate over long distances with minimal human control.",
    approach:
      "A Raspberry Pi (ROS master) and Arduino (slave) architecture: the Pi runs LiDAR SLAM, localisation, path planning and voice commands while the Arduino handles deterministic motor control. Serial links keep AI decisions in step with real-time actuation, and LoRaWAN adds secure off-grid communication.",
    result:
      "Won 2nd place (Hardware) at the Google DevHouse Hackathon 2025 at VIT Chennai, recognised for a robust distributed robotics architecture combining perception, autonomy and long-range communication.",
    role: "Hardware & embedded systems lead",
    award: { label: "2nd Place · Google DevHouse", medal: "silver" },
    metric: "Real-time 2D SLAM and autonomous navigation",
    tags: ["ROS", "LiDAR SLAM", "Raspberry Pi", "Arduino", "LoRaWAN", "Python"],
    date: "Apr 2025",
    order: 7,
    lenses: { iot: 4, ai: 4 },
  },
  {
    title: "ADAS Kit",
    slug: "adas-kit",
    tagline: "Affordable retrofit driver-assistance system",
    summary:
      "A low-cost retrofit kit that brings lane detection, forward-collision warnings and blind-spot monitoring to conventional vehicles through edge computer vision.",
    problem:
      "Factory driver assistance is expensive and limited to newer cars, so older vehicles get none of its safety benefits.",
    approach:
      "A Raspberry Pi edge-computing architecture with a forward camera and OpenCV pipelines processing live frames for lane detection, vehicle-ahead identification and low-latency driver alerts, all in a modular enclosure that can take more sensors.",
    result:
      "Won 2nd place at the Field Project Competition, judged on engineering depth, system architecture and real-world commercialisation potential.",
    role: "Hardware architecture & CV implementation",
    award: { label: "2nd Place · Field Project", medal: "silver" },
    metric: "Real-time lane and collision alerts on the edge",
    tags: ["OpenCV", "Raspberry Pi", "Edge AI", "Computer vision", "Embedded"],
    date: "2025",
    order: 8,
    lenses: { iot: 5, ai: 5 },
  },
  {
    title: "GARUDA",
    slug: "garuda",
    tagline: "Autonomous payload delivery quadcopter",
    summary:
      "A payload-capable quadcopter built on Pixhawk and Mission Planner that lifts and carries lightweight cargo in stable, GPS-assisted flight.",
    problem:
      "Payload-carrying drones have to balance lift, stability, power and precise flight control, which is far harder than flying a camera.",
    approach:
      "Assembled the airframe and integrated propulsion (four 1000KV BLDC motors with ESCs), Pixhawk 2.4.8 flight control, GPS and compass, telemetry and Li-Po power distribution, then calibrated the stack in Mission Planner for reliable loaded flight.",
    result:
      "Became a flagship attraction of GLA University's annual technical fest: at the inauguration, GARUDA carried and hoisted the university flag.",
    role: "Hardware engineering & integration",
    metric: "Flag-hoisting flight at the fest inauguration",
    tags: ["Pixhawk", "Mission Planner", "BLDC + ESC", "GPS", "UAV"],
    date: "2025",
    order: 9,
    lenses: { iot: 6 },
  },
  {
    title: "Mentify",
    slug: "mentify",
    tagline: "AI-based mental wellness checking system",
    summary:
      "A full-stack AI wellness platform that guides students through structured self-assessment and produces personalised wellness summaries. An awareness tool, not a diagnosis.",
    problem:
      "Students moving away for college face loneliness, academic pressure and stress, yet often hesitate to ask for help or notice the early signs of burnout.",
    approach:
      "Led a team of five to build secure profiles, a structured wellness questionnaire, and rule-based plus AI-assisted analysis that turns answers into personalised reports and habit recommendations, on a modular base ready for conversational AI and mood tracking.",
    result:
      "College-level selection at Smart India Hackathon 2023, built three weeks into my B.Tech: my first major project and first time leading a team.",
    role: "Team lead",
    team: "5 members",
    award: { label: "SIH 2023 Selection", medal: "select" },
    metric: "Built three weeks into B.Tech with a team of five",
    tags: ["Python", "Machine learning", "HTML/CSS/JS", "SQLite", "Full-stack"],
    date: "Sep 2023",
    order: 10,
    lenses: { software: 4, ai: 6 },
  },
];

/** Projects in front-page order. */
export const projectsInOrder = [...projects].sort((a, b) => a.order - b.order);

/* Drop an MP4 at public/videos/<slug>.mp4 and list the slug here; that
   project's carousel face and lightbox switch from poster to video. */
export const projectVideos: Partial<Record<string, string>> = {};

export const projectVideoSrc = (slug: string): string | undefined => projectVideos[slug];
