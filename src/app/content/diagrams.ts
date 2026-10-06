/* System diagrams for the project pages, drawn only from what the resumes
   state. Nodes sit on a column × row grid (rows may be fractional to
   centre a node against a taller column); edges run left to right.

   kind:
   - "client"  something a person uses
   - "service" code that runs
   - "store"   data at rest
   - "ai"      a model, emphasised in the accent colour
   - "device"  hardware */

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  col: number;
  row: number;
  kind?: "client" | "service" | "store" | "ai" | "device";
};

export type DiagramEdge = { from: string; to: string; label?: string };

export type Diagram = {
  /** One-sentence summary, also the SVG's accessible description. */
  summary: string;
  cols: number;
  rows: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  note?: string;
};

export const diagrams: Partial<Record<string, Diagram>> = {
  hackeval: {
    summary:
      "Participants, judges, mentors and admins use the web app; API services hand long-running work to Redis and BullMQ workers that analyse decks and repositories, check for plagiarism and write LLM-assessed evaluation reports into MongoDB.",
    cols: 5,
    rows: 4,
    nodes: [
      { id: "web", label: "Web app", sub: "React · four roles", col: 0, row: 1.5, kind: "client" },
      { id: "api", label: "API services", sub: "Node.js, Express, FastAPI", col: 1, row: 1.5, kind: "service" },
      { id: "queue", label: "Job queue", sub: "Redis + BullMQ", col: 2, row: 1.5, kind: "service" },
      { id: "docs", label: "Document processing", sub: "Slide decks", col: 3, row: 0, kind: "service" },
      { id: "repo", label: "Repository analysis", sub: "GitHub", col: 3, row: 1, kind: "service" },
      { id: "plag", label: "Plagiarism detection", col: 3, row: 2, kind: "service" },
      { id: "eval", label: "Evaluation reports", sub: "LLM assessment", col: 3, row: 3, kind: "ai" },
      { id: "db", label: "MongoDB", sub: "Multi-tenant data", col: 4, row: 1.5, kind: "store" },
    ],
    edges: [
      { from: "web", to: "api" },
      { from: "api", to: "queue" },
      { from: "queue", to: "docs" },
      { from: "queue", to: "repo" },
      { from: "queue", to: "plag" },
      { from: "queue", to: "eval" },
      { from: "docs", to: "db" },
      { from: "repo", to: "db" },
      { from: "plag", to: "db" },
      { from: "eval", to: "db" },
    ],
    note: "Every service runs in its own Docker container.",
  },

  bitbench: {
    summary:
      "BullMQ workers pull developer activity from six external services in GraphQL batches of fifty users behind a Redis cache, store it across ten MongoDB models, and a scoring engine turns it into comparable scores served by fifty REST APIs.",
    cols: 5,
    rows: 2,
    nodes: [
      { id: "ext", label: "6 external services", sub: "GraphQL, 50 users per batch", col: 0, row: 0.5, kind: "client" },
      { id: "ingest", label: "Ingestion workers", sub: "BullMQ, retries, rate limits", col: 1, row: 0, kind: "service" },
      { id: "cache", label: "Redis cache", sub: "Up to 50× fewer round trips", col: 1, row: 1, kind: "store" },
      { id: "db", label: "MongoDB", sub: "10 data models", col: 2, row: 0.5, kind: "store" },
      { id: "score", label: "Scoring engine", sub: "Percentiles, time decay", col: 3, row: 0.5, kind: "service" },
      { id: "api", label: "REST API", sub: "50 endpoints, Express", col: 4, row: 0.5, kind: "service" },
    ],
    edges: [
      { from: "ext", to: "ingest" },
      { from: "ext", to: "cache" },
      { from: "ingest", to: "db", label: "upserts" },
      { from: "cache", to: "db" },
      { from: "db", to: "score" },
      { from: "score", to: "api" },
    ],
    note: "TypeScript throughout, containerised with Docker and deployed on AWS.",
  },

  jobforge: {
    summary:
      "The React 19 web app and its Capacitor mobile build talk to a FastAPI backend on Cloud Run, which stores data in MongoDB Atlas, routes AI requests across five LLM providers, and integrates Gmail, Calendar, Tasks and Firebase notifications.",
    cols: 3,
    rows: 4,
    nodes: [
      { id: "web", label: "Web app", sub: "React 19", col: 0, row: 1, kind: "client" },
      { id: "mobile", label: "Mobile app", sub: "Capacitor", col: 0, row: 2, kind: "client" },
      { id: "api", label: "FastAPI", sub: "GCP Cloud Run", col: 1, row: 1.5, kind: "service" },
      { id: "db", label: "MongoDB Atlas", sub: "TTL, full-text, sparse", col: 2, row: 0, kind: "store" },
      { id: "llm", label: "LLM failover", sub: "OpenAI SDK, 5 providers", col: 2, row: 1, kind: "ai" },
      { id: "google", label: "Google APIs", sub: "Gmail, Calendar, Tasks", col: 2, row: 2, kind: "service" },
      { id: "fcm", label: "Push notifications", sub: "Firebase FCM", col: 2, row: 3, kind: "service" },
    ],
    edges: [
      { from: "web", to: "api" },
      { from: "mobile", to: "api" },
      { from: "api", to: "db" },
      { from: "api", to: "llm" },
      { from: "api", to: "google" },
      { from: "api", to: "fcm" },
    ],
    note: "Shipped by GitHub Actions through Artifact Registry with Workload Identity Federation; Cloud Scheduler runs timed jobs and Secret Manager holds the keys.",
  },

  "water-management": {
    summary:
      "Water-flow sensors feed ESP32 controllers that switch motorised pumps; telemetry and control travel over MQTT to the ThingWorx IoT platform, which drives the cloud dashboard.",
    cols: 4,
    rows: 2,
    nodes: [
      { id: "sensors", label: "Water-flow sensors", col: 0, row: 0.5, kind: "device" },
      { id: "esp", label: "ESP32 controllers", sub: "Device control", col: 1, row: 0.5, kind: "device" },
      { id: "mqtt", label: "MQTT", sub: "Telemetry and commands", col: 2, row: 0, kind: "service" },
      { id: "pumps", label: "Motorised pumps", col: 2, row: 1, kind: "device" },
      { id: "tw", label: "ThingWorx", sub: "Monitoring and dashboard", col: 3, row: 0, kind: "service" },
    ],
    edges: [
      { from: "sensors", to: "esp", label: "flow readings" },
      { from: "esp", to: "mqtt" },
      { from: "esp", to: "pumps", label: "on / off" },
      { from: "mqtt", to: "tw" },
    ],
    note: "Deployed and validated on a physical life-scale installation.",
  },

  "smart-irrigation": {
    summary:
      "Soil-moisture, DHT22, DS18B20 and water-flow sensors report through ESP32 nodes to ThingWorx; an LSTM model served by FastAPI on Azure forecasts demand and schedules the pump.",
    cols: 4,
    rows: 2,
    nodes: [
      { id: "sensors", label: "Field sensors", sub: "Soil, DHT22, DS18B20, flow", col: 0, row: 0.5, kind: "device" },
      { id: "esp", label: "ESP32 nodes", col: 1, row: 0.5, kind: "device" },
      { id: "tw", label: "ThingWorx", sub: "Continuous monitoring", col: 2, row: 0, kind: "service" },
      { id: "model", label: "LSTM model", sub: "FastAPI on Azure", col: 2, row: 1, kind: "ai" },
      { id: "pump", label: "Irrigation pump", sub: "Scheduled automatically", col: 3, row: 0.5, kind: "device" },
    ],
    edges: [
      { from: "sensors", to: "esp" },
      { from: "esp", to: "tw" },
      { from: "esp", to: "model" },
      { from: "model", to: "pump", label: "schedule" },
    ],
    note: "The inference service is containerised with Docker.",
  },
};
