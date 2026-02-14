import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Binary,
  BrainCircuit,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  Radar,
  Send,
  Sparkles,
  X,
  Terminal,
  ExternalLink,
  Folder,
  Cpu,
  Brain,
  Globe,
  Code2,
  Cloud,
  Database,
  Wrench,
  Users,
  Lightbulb,
  Target,
  MessageCircle,
  Zap
} from "lucide-react";

/* ── Data ───────────────────────────────────────────── */

const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

const stats = [
  { value: "15+", label: "Flagship Builds" },
  { value: "8+", label: "Awards & Selections" },
  { value: "350+", label: "Developers Impacted" },
  { value: "2026", label: "Graduation Target" }
];

const pillars = [
  {
    title: "AI Vision Engineering",
    text: "From object detection to adaptive tracking, I architect perception pipelines that stay performant in real-world noise.",
    icon: BrainCircuit
  },
  {
    title: "Embedded Intelligence",
    text: "I integrate microcontrollers, sensors, and edge compute into systems that are fast, reliable, and field-ready.",
    icon: Radar
  },
  {
    title: "Product-Led Delivery",
    text: "I prioritize measurable outcomes, clean architecture, and iteration velocity to move products from prototype to production.",
    icon: Binary
  }
];

const technicalSkillGroups = [
  {
    category: "Embedded & IoT",
    icon: Cpu,
    accent: "#64deff",
    skills: [
      "Arduino", "Raspberry Pi", "ESP32", "ESP8266/NodeMCU", "STM32", "ATmega328",
      "ROS", "LiDAR", "Pixhawk", "Embedded C",
      "DHT11/22", "MPU6050", "BMP280", "HC-SR04", "IR Sensor", "PIR Sensor", "MQ Gas Sensors",
      "Servo Motor", "Stepper Motor", "Relay Module", "L298N Motor Driver",
      "MQTT", "I2C", "SPI", "UART", "Bluetooth/BLE", "LoRa", "Zigbee", "Wi-Fi",
      "Sensor Fusion", "FreeRTOS", "PlatformIO", "Blynk", "ThingSpeak", "Node-RED"
    ]
  },
  {
    category: "AI / ML",
    icon: Brain,
    accent: "#a78bfa",
    skills: [
      "Python", "TensorFlow", "PyTorch", "OpenCV", "Scikit-Learn", "YOLO", "Pandas", "NumPy",
      "LangChain", "LlamaIndex", "Hugging Face", "OpenAI API", "CrewAI", "AutoGen",
      "RAG Pipelines", "Vector Databases", "Pinecone", "ChromaDB", "FAISS",
      "Prompt Engineering", "Fine-Tuning", "LoRA/QLoRA", "Transformers",
      "Stable Diffusion", "LLM Orchestration", "Agentic Workflows", "Semantic Search"
    ]
  },
  {
    category: "DevOps & Cloud",
    icon: Cloud,
    accent: "#34d399",
    skills: ["Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "AWS", "CI/CD", "Linux", "Nginx", "Git"]
  },
  {
    category: "Languages",
    icon: Code2,
    accent: "#f59e0b",
    skills: ["Python", "C/C++", "JavaScript", "TypeScript", "Bash", "SQL"]
  },
  {
    category: "Web & Tools",
    icon: Globe,
    accent: "#fb7185",
    skills: ["React", "Node.js", "HTML/CSS", "REST APIs", "Figma", "VS Code", "Postman"]
  }
];

const softSkills = [
  { label: "Leadership", icon: Users },
  { label: "Problem Solving", icon: Lightbulb },
  { label: "Strategic Thinking", icon: Target },
  { label: "Team Collaboration", icon: Users },
  { label: "Communication", icon: MessageCircle },
  { label: "Quick Learner", icon: Zap },
  { label: "Project Management", icon: Wrench },
  { label: "Mentoring", icon: Sparkles }
];

type Domain = "all" | "iot" | "ai-ml" | "web";

const domains: { key: Domain; label: string; dir: string; icon: typeof Folder; accent: string }[] = [
  { key: "all", label: "All Projects", dir: "./all", icon: Folder, accent: "#64deff" },
  { key: "iot", label: "IoT & Embedded", dir: "./iot", icon: Cpu, accent: "#34d399" },
  { key: "ai-ml", label: "AI / ML", dir: "./ai-ml", icon: Brain, accent: "#a78bfa" },
  { key: "web", label: "Web & Software", dir: "./web", icon: Globe, accent: "#f59e0b" }
];

const projects: {
  title: string;
  summary: string;
  impact: string;
  tags: string[];
  domain: Domain;
}[] = [
    {
      title: "AAROI Autonomous Rover",
      summary:
        "Built an autonomous rover with LiDAR obstacle mapping and OpenCV tracking for controlled navigation in dynamic terrain.",
      impact: "Achieved stable autonomous routing under multi-obstacle test scenarios.",
      tags: ["ROS", "OpenCV", "LiDAR", "Embedded C"],
      domain: "iot"
    },
    {
      title: "GARUDA Surveillance Drone",
      summary:
        "Designed a surveillance stack combining Pixhawk control, Raspberry Pi edge processing, and real-time visual detection.",
      impact: "Delivered consistent aerial target detection with live inference feedback.",
      tags: ["Pixhawk", "Raspberry Pi", "Python", "Mission Planner"],
      domain: "iot"
    },
    {
      title: "ADAS Retrofit Suite",
      summary:
        "Engineered an ADAS kit for legacy vehicles with lane awareness and hazard alerting via edge computer vision.",
      impact: "Recognized at Tech-Expo for practical, scalable road-safety innovation.",
      tags: ["Computer Vision", "Sensor Fusion", "Edge Alerts", "Embedded Systems"],
      domain: "ai-ml"
    }
  ];

const timeline = [
  {
    period: "2025 — Present",
    role: "President, CSED Club",
    detail: "Leading strategy, mentoring teams, and scaling AI/IoT initiatives across the technical community."
  },
  {
    period: "2024 — 2025",
    role: "General Secretary, CSED Club",
    detail: "Drove workshops, hackathons, and hands-on project mentoring for junior developers."
  },
  {
    period: "2024",
    role: "Winner, Tech-Expo",
    detail: "Awarded for delivering an applied ADAS innovation with strong real-world safety value."
  }
];

const tickerItems = [
  "EDGE AI", "DOCKER", "AUTONOMOUS SYSTEMS", "KUBERNETES", "COMPUTER VISION",
  "CI/CD PIPELINES", "EMBEDDED ARCHITECTURE", "TERRAFORM", "SENSOR FUSION",
  "AWS", "DEEP LEARNING", "JENKINS", "IoT ENGINEERING", "ANSIBLE",
  "HARDWARE + SOFTWARE CO-DESIGN", "LINUX ADMINISTRATION",
  // duplicate for seamless loop
  "EDGE AI", "DOCKER", "AUTONOMOUS SYSTEMS", "KUBERNETES", "COMPUTER VISION",
  "CI/CD PIPELINES", "EMBEDDED ARCHITECTURE", "TERRAFORM", "SENSOR FUSION",
  "AWS", "DEEP LEARNING", "JENKINS", "IoT ENGINEERING", "ANSIBLE",
  "HARDWARE + SOFTWARE CO-DESIGN", "LINUX ADMINISTRATION"
];

/* ── Animation variants ─────────────────────────────── */

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay }
  })
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease }
  }
};

/* ── Component ──────────────────────────────────────── */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState<Domain>("all");

  const filteredProjects = activeDomain === "all"
    ? projects
    : projects.filter((p) => p.domain === activeDomain);

  const activeDomainData = domains.find((d) => d.key === activeDomain)!;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert("Message sent! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* ── Loading Screen ── */}
      <div className={`loading-screen ${!loading ? "loaded" : ""}`}>
        <p className="loader-text">
          <span className="prompt">&gt;</span> initializing system
          <span className="cursor-blink">_</span>
        </p>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" />
        </div>
        <p className="loader-name">SHUBH SINGHAL</p>
      </div>

      {/* ── Main Shell ── */}
      <div className="portfolio-shell" style={{ opacity: loading ? 0 : 1, transition: "opacity 0.5s ease 0.3s" }}>
        <div className="ambient-layer" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="scan-line" />
        <div className="grid-layer" />
        <div className="noise-layer" />

        {/* ── Header ── */}
        <header className="main-header">
          <div className="container-row">
            <a href="#home" className="brand">
              <span className="brand-block">SS</span>
              <span className="brand-text">SHUBH SINGHAL</span>
            </a>

            <nav className="nav-desktop">
              {nav.map((item) => (
                <a key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </a>
              ))}
              <a href="#contact" className="btn-solid" style={{ marginLeft: "0.5rem" }}>
                Hire Me
              </a>
            </nav>

            <button
              className="nav-toggle"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {menuOpen && (
            <div className="mobile-nav">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a href="#contact" className="btn-solid" style={{ marginTop: "0.5rem" }}>
                Hire Me
              </a>
            </div>
          )}
        </header>

        <main>
          {/* ── Hero ── */}
          <section id="home" className="hero container-grid">
            <div className="hero-inner">
              <motion.div
                className="hero-content"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={staggerChild}>
                  <p className="kicker">
                    <Sparkles size={13} /> AVAILABLE FOR AI & IOT ROLES
                  </p>
                </motion.div>

                <motion.h1 className="hero-name" variants={staggerChild}>
                  SHUBH<br />
                  <span className="accent">SINGHAL</span>
                </motion.h1>

                <motion.p className="hero-tagline" variants={staggerChild}>
                  Systems Architect · AI/ML Engineer
                </motion.p>

                <motion.p className="hero-description" variants={staggerChild}>
                  I build elite intelligent systems that transform complex ideas into production
                  reality — blending sensing, intelligence, and control with product-grade rigor.
                </motion.p>

                <motion.div className="hero-actions" variants={staggerChild}>
                  <a href="#projects" className="btn-solid">
                    View Work <ArrowUpRight size={15} />
                  </a>
                  <a href="#contact" className="btn-ghost">
                    Let's Talk <Send size={15} />
                  </a>
                </motion.div>
              </motion.div>

              {/* Terminal Card */}
              <motion.div
                className="hero-visual"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="terminal-card">
                  <div className="terminal-header">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                    <span className="terminal-title">
                      <Terminal size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                      profile.ts
                    </span>
                  </div>
                  <div className="terminal-body">
                    <div><span className="comment">// whoami</span></div>
                    <div><span className="prompt">const</span> name <span className="prompt">=</span> <span className="string">"Shubh Singhal"</span>;</div>
                    <div><span className="prompt">const</span> role <span className="prompt">=</span> <span className="string">"AI/ML & IoT Engineer"</span>;</div>
                    <div><span className="prompt">const</span> focus <span className="prompt">=</span> <span className="value">[</span></div>
                    <div>&nbsp;&nbsp;<span className="string">"Edge AI"</span>,</div>
                    <div>&nbsp;&nbsp;<span className="string">"Autonomous Systems"</span>,</div>
                    <div>&nbsp;&nbsp;<span className="string">"Computer Vision"</span></div>
                    <div><span className="value">]</span>;</div>
                    <div><span className="prompt">const</span> status <span className="prompt">=</span> <span className="string">"Open to work"</span>;</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="stats-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {stats.map((stat) => (
                <motion.article key={stat.label} className="stat-card" variants={staggerChild}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </motion.article>
              ))}
            </motion.div>
          </section>

          {/* ── Tech Ticker ── */}
          <section className="tech-ticker">
            <div className="ticker-track">
              {tickerItems.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </section>

          {/* ── About ── */}
          <motion.section
            id="about"
            className="container-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <p className="section-label">ABOUT</p>
            <h2 className="section-title">Engineering systems that think, sense, and act.</h2>
            <p className="section-subtitle">
              I'm a multi-disciplinary engineer at the intersection of AI and embedded systems.
              Whether architecting perception pipelines or deploying edge compute, I build
              systems that transcend the gap between prototype and production.
            </p>

            <motion.div
              className="pillars-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.article key={item.title} className="pillar-card" variants={staggerChild}>
                    <div className="pillar-icon">
                      <Icon size={18} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.section>

          {/* ── Skills ── */}
          <motion.section
            id="skills"
            className="container-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <p className="section-label">SKILLS</p>
            <h2 className="section-title">Technologies and strengths I bring to every build.</h2>

            {/* Technical Skills */}
            <motion.div
              className="skills-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
            >
              {technicalSkillGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <motion.div
                    key={group.category}
                    className="skill-group"
                    variants={staggerChild}
                    style={{ "--skill-accent": group.accent } as React.CSSProperties}
                  >
                    <div className="skill-group-header">
                      <div className="skill-group-icon">
                        <Icon size={16} />
                      </div>
                      <h3>{group.category}</h3>
                    </div>
                    <div className="skill-chips">
                      {group.skills.map((skill) => (
                        <span key={skill} className="skill-chip">{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Soft Skills */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
            >
              <p className="soft-skills-label">Soft Skills</p>
              <div className="soft-skills-row">
                {softSkills.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.span key={s.label} className="soft-chip" variants={staggerChild}>
                      <Icon size={13} /> {s.label}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>

          {/* ── Projects ── */}
          <motion.section
            id="projects"
            className="container-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <p className="section-label">PROJECTS</p>
            <h2 className="section-title">Signature builds that demonstrate engineering excellence.</h2>

            {/* Domain Filter Tabs */}
            <div className="domain-filter">
              <span className="domain-prompt">~/projects $</span>
              <div className="domain-tabs">
                {domains.map((d) => {
                  const Icon = d.icon;
                  const isActive = activeDomain === d.key;
                  return (
                    <button
                      key={d.key}
                      className={`domain-tab ${isActive ? "active" : ""}`}
                      onClick={() => setActiveDomain(d.key)}
                      style={{ "--tab-accent": d.accent } as React.CSSProperties}
                    >
                      <Icon size={13} />
                      <span className="domain-dir">{d.dir}</span>
                      <span className="domain-label">{d.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="domain-result-count">
                <span className="domain-prompt">→</span> {filteredProjects.length} result{filteredProjects.length !== 1 ? "s" : ""} found
              </div>
            </div>

            {/* Filtered project cards with layout animation */}
            <motion.div className="projects-list" layout>
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.article
                    key={project.title}
                    className="project-card"
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="project-card-header">
                      <span className="project-number">0{index + 1}</span>
                      <span
                        className="project-domain-badge"
                        style={{ "--badge-accent": domains.find((d) => d.key === project.domain)?.accent } as React.CSSProperties}
                      >
                        {domains.find((d) => d.key === project.domain)?.label}
                      </span>
                    </div>
                    <h3>{project.title}</h3>
                    <p className="project-summary">{project.summary}</p>
                    <p className="project-impact">{project.impact}</p>
                    <div className="tag-row">
                      {project.tags.map((tag) => (
                        <span key={tag} className="chip">{tag}</span>
                      ))}
                    </div>
                    <a href="#contact" className="project-link">
                      Discuss this build <ChevronRight size={15} />
                    </a>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <motion.div
                className="projects-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="empty-text">
                  <span className="domain-prompt">$</span> ls {activeDomainData.dir}
                </p>
                <p className="empty-sub">No projects in this directory yet. Check back soon.</p>
              </motion.div>
            )}
          </motion.section>

          {/* ── Experience ── */}
          <motion.section
            id="experience"
            className="container-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <p className="section-label">EXPERIENCE</p>
            <h2 className="section-title">Leadership and impact across technical ecosystems.</h2>

            <motion.div
              className="timeline-wrap"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
            >
              {timeline.map((item) => (
                <motion.article key={item.role} className="timeline-item" variants={staggerChild}>
                  <p className="timeline-period">{item.period}</p>
                  <h3>{item.role}</h3>
                  <p>{item.detail}</p>
                </motion.article>
              ))}
            </motion.div>
          </motion.section>

          {/* ── Contact ── */}
          <motion.section
            id="contact"
            className="container-section contact-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <div>
              <p className="section-label">CONTACT</p>
              <h2 className="section-title">Ready to build something extraordinary?</h2>
              <p className="contact-copy">
                I'm open to internships, full-time roles, and ambitious collaborations where
                applied AI and IoT can create measurable impact.
              </p>
              <div className="contact-links">
                <a href="mailto:shubhsinghal.work@gmail.com">
                  <Mail size={16} /> shubhsinghal.work@gmail.com
                </a>
                <a href="https://linkedin.com/in/shubh-singhal-" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={16} /> linkedin.com/in/shubh-singhal-
                </a>
                <a href="https://github.com/Shubh-Singhal-Taken" target="_blank" rel="noopener noreferrer">
                  <Github size={16} /> github.com/Shubh-Singhal-Taken
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send a Message</h3>
              <input
                required
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                required
                rows={5}
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <button type="submit" className="btn-solid">
                Send Message <Send size={15} />
              </button>
            </form>
          </motion.section>
        </main>

        {/* ── Footer ── */}
        <footer className="site-footer container-grid">
          <p>© 2025 Shubh Singhal — Designed & built with precision.</p>
          <div className="footer-links">
            <a href="https://github.com/Shubh-Singhal-Taken" target="_blank" rel="noopener noreferrer">
              <Github size={16} />
            </a>
            <a href="https://linkedin.com/in/shubh-singhal-" target="_blank" rel="noopener noreferrer">
              <Linkedin size={16} />
            </a>
            <a href="mailto:shubhsinghal.work@gmail.com">
              <Mail size={16} />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
