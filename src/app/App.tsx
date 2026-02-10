import { useState } from "react";
import { ProjectCard } from "./components/ProjectCard";
import { SkillCategory } from "./components/SkillCategory";
import { ExperienceCard } from "./components/ExperienceCard";
import { CircuitBackground } from "./components/CircuitBackground";
import { TechGrid } from "./components/TechGrid";
import { AnimatedParticles } from "./components/AnimatedParticles";
import { Navbar } from "./components/Navbar";
import { StatsCard } from "./components/StatsCard";
import { TechOrbit } from "./components/TechOrbit";
import {
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Cpu,
  Brain,
  Code,
  Database,
  Wifi,
  Sparkles,
  Trophy,
  Award,
  Users,
  BookOpen,
  Send,
  Terminal,
  Layers,
  GitBranch,
  Server,
  Cloud,
  Smartphone,
  Activity,
  Zap,
  Rocket,
  Target,
  Code2,
  ChevronRight
} from "lucide-react";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const projects = [
    {
      title: "AAROI - Autonomous Rover",
      description: "Developed an autonomous rover using ROS for control and LiDAR for obstacle detection. Programmed hardware with Embedded C and integrated OpenCV for object tracking and environmental awareness.",
      image: "https://images.unsplash.com/photo-1761195696590-3490ea770aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MDE3OTgzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Python", "Embedded C", "OpenCV", "ROS", "LiDAR"],
      githubUrl: "#"
    },
    {
      title: "GARUDA: Surveillance Drone",
      description: "Engineered a surveillance drone using Pixhawk 2.4.8 and Mission Planner. Integrated Raspberry Pi with Python scripts for live video feeds and OpenCV-based real-time object detection and tracking.",
      image: "https://images.unsplash.com/photo-1724343025504-3afb6d67566b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBzbWFydCUyMGhvbWUlMjBhdXRvbWF0aW9ufGVufDF8fHx8MTc3MDI5MjcwNHww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Python", "Pixhawk", "OpenCV", "Raspberry Pi"],
      githubUrl: "#"
    },
    {
      title: "ADAS Kit for Legacy Vehicles",
      description: "Designed and implemented Advanced Driver Assistance System using Raspberry Pi and sensors. Integrated OpenCV-based computer vision for lane detection, object tracking, and real-time alert generation.",
      image: "https://images.unsplash.com/photo-1758577515333-e71b713059f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHNlbnNvcnMlMjBjaXJjdWl0JTIwYm9hcmQ8ZW58MXx8fHwxNzcwMjkyNzA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Python", "Embedded C", "OpenCV", "Raspberry Pi", "LoRaWAN"],
      githubUrl: "#"
    }
  ];

  const iotSkills = [
    { name: "Raspberry Pi", icon: Server },
    { name: "Arduino", icon: Cpu },
    { name: "ESP8266", icon: Cpu },
    { name: "Node MCU", icon: Wifi },
    { name: "LiDAR", icon: Sparkles },
    { name: "Pixhawk", icon: Cloud }
  ];

  const aimlSkills = [
    { name: "OpenCV", icon: Sparkles },
    { name: "Python", icon: Code },
    { name: "ROS", icon: Brain },
    { name: "Computer Vision", icon: Brain },
    { name: "Embedded Systems", icon: Layers },
    { name: "Machine Learning", icon: Database }
  ];

  const programmingSkills = [
    { name: "Python", icon: Code },
    { name: "Embedded C", icon: Terminal },
    { name: "Java", icon: Code },
    { name: "Git", icon: GitBranch },
    { name: "Docker", icon: Server },
    { name: "VS Code", icon: Terminal }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
      {/* Background Effects */}
      <CircuitBackground />
      <TechGrid />
      <AnimatedParticles />

      {/* Navigation */}
      <Navbar />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 group hover:bg-cyan-500/20 transition-all">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm text-cyan-400 font-mono">Available for opportunities</span>
                </div>

                <h1 className="text-5xl md:text-7xl mb-4">
                  <span className="block text-gray-400 text-2xl md:text-3xl mb-2 font-mono">
                    {'<'}Hello World{' />'}
                  </span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Shubh Singhal
                  </span>
                </h1>

                {/* Typing Effect Title */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xl md:text-2xl">
                    <ChevronRight className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span className="text-cyan-400 font-mono">IoT & AI/ML Developer</span>
                    <span className="w-2 h-6 bg-cyan-400 animate-pulse"></span>
                  </div>
                </div>

                <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
                  Building the future at the intersection of{" "}
                  <span className="text-cyan-400 font-semibold">Artificial Intelligence</span>,{" "}
                  <span className="text-purple-400 font-semibold">Machine Learning</span>, and{" "}
                  <span className="text-pink-400 font-semibold">Internet of Things</span>.
                  Creating intelligent systems that bridge physical and digital worlds.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <a
                    href="#projects"
                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      View Projects
                      <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </a>
                  <a
                    href="#contact"
                    className="px-8 py-4 bg-white/5 backdrop-blur-xl border-2 border-cyan-500/30 rounded-lg hover:border-cyan-400 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                  >
                    Contact Me
                    <Send className="w-5 h-5" />
                  </a>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-lg">
                    <div className="text-2xl font-mono text-cyan-400">15+</div>
                    <div className="text-xs text-gray-400">Projects</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-lg">
                    <div className="text-2xl font-mono text-purple-400">3</div>
                    <div className="text-xs text-gray-400">Hackathons</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 backdrop-blur-xl border border-pink-500/20 rounded-lg">
                    <div className="text-2xl font-mono text-pink-400">5+</div>
                    <div className="text-xs text-gray-400">Certifications</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Tech Orbit */}
              <div className="hidden lg:block">
                <TechOrbit />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard icon={Code2} value={10000} suffix="+" label="Lines of Code" />
              <StatsCard icon={Zap} value={25} suffix="+" label="IoT Devices Built" />
              <StatsCard icon={Brain} value={12} suffix="+" label="ML Models Trained" />
              <StatsCard icon={Trophy} value={8} suffix="+" label="Awards Won" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-8 h-8 text-cyan-400" />
                <h2 className="text-4xl md:text-5xl">
                  <span className="text-gray-400 font-mono">01.</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    About Me
                  </span>
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl border border-cyan-500/30">
                      <BookOpen className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl text-white">Education</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                        <div className="w-px h-full bg-gradient-to-b from-cyan-500 to-transparent"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="text-cyan-400 font-semibold mb-1">B.Tech Computer Science & Engineering</div>
                        <div className="text-gray-400 text-sm mb-2">Specialization: AI/ML & IoT</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Activity className="w-3 h-3" />
                          <span>3rd Year • Expected 2026</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cyan-500/20">
                      <div className="text-center p-3 bg-cyan-500/10 rounded-lg">
                        <div className="text-xl text-cyan-400 font-mono">8.7</div>
                        <div className="text-xs text-gray-400">CGPA</div>
                      </div>
                      <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                        <div className="text-xl text-purple-400 font-mono">Top 5%</div>
                        <div className="text-xs text-gray-400">Class Rank</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl text-white">Goals & Interests</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Smart IoT systems & edge computing",
                      "Deep learning & computer vision",
                      "Robotics & autonomous systems",
                      "Building scalable AI applications",
                      "Research in Industry 4.0",
                      "Contributing to open-source projects"
                    ].map((goal, index) => (
                      <div key={index} className="flex items-start gap-3 group/item">
                        <ChevronRight className="w-5 h-5 text-purple-400 mt-0.5 group-hover/item:translate-x-1 transition-transform" />
                        <span className="text-gray-300 text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <p className="text-gray-300 leading-relaxed">
                  I'm a passionate developer dedicated to creating innovative solutions at the intersection of AI, ML, and IoT.
                  My journey involves building intelligent systems that solve real-world problems, from smart home automation
                  to predictive analytics. I'm constantly exploring new technologies and looking forward to contributing to
                  cutting-edge projects in the tech industry. Currently seeking opportunities in AI/IoT startups and research labs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-8 h-8 text-cyan-400" />
                <h2 className="text-4xl md:text-5xl">
                  <span className="text-gray-400 font-mono">02.</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Skills & Technologies
                  </span>
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkillCategory title="IoT & Hardware" skills={iotSkills} />
              <SkillCategory title="AI & Machine Learning" skills={aimlSkills} />
              <SkillCategory title="Programming & Tools" skills={programmingSkills} />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-8 h-8 text-cyan-400" />
                <h2 className="text-4xl md:text-5xl">
                  <span className="text-gray-400 font-mono">03.</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Featured Projects
                  </span>
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
              </div>
              <p className="text-gray-400 text-lg">Innovative solutions leveraging IoT and AI/ML technologies</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-cyan-400" />
                <h2 className="text-4xl md:text-5xl">
                  <span className="text-gray-400 font-mono">04.</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Experience & Achievements
                  </span>
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
              </div>
            </div>

            <div className="space-y-0">
              <ExperienceCard
                title="President - CSED CLUB"
                organization="GLA University"
                period="May 2025 - Present"
                description="Leading the CSED Club to foster innovation and technical excellence. Overseeing all club initiatives, mentoring independent teams, and driving strategic growth for the student community."
                icon={<Trophy className="w-4 h-4 text-white" />}
              />

              <ExperienceCard
                title="General Secretary - CSED CLUB"
                organization="GLA University"
                period="December 2024 - May 2025"
                description="Spearheaded technical initiatives, organizing workshops, seminars, and hackathons to promote innovation in AI, IoT, and software development. Mentored junior students on project development, Git practices, and technical career-building."
                icon={<Users className="w-4 h-4 text-white" />}
              />

              <ExperienceCard
                title="Winner - Tech-Expo 2024"
                organization="Project SARV"
                period="2024"
                description="Won the Tech-Expo 2024 for developing Project SARV. Recognized with Best Innovation Award for the external ADAS Kit project demonstration showcasing advanced driver assistance capabilities."
                icon={<Trophy className="w-4 h-4 text-white" />}
              />

              <ExperienceCard
                title="Selected - Google Dev House Hackathon"
                organization="VIT Chennai"
                period="2025"
                description="Selected for the prestigious Google Dev House Hackathon 2025 held at VIT Chennai. Competing among top developers nationwide to build innovative solutions."
                icon={<Sparkles className="w-4 h-4 text-white" />}
              />

              <ExperienceCard
                title="Workshop Organizer & Mentor"
                organization="GLA University"
                period="2024 - 2025"
                description="Organized and mentored a university-wide AI-IoT Workshop attended by 150+ participants. Conducted online IIoT Workshop with 200+ participants, sharing expertise in embedded systems and IoT."
                icon={<Award className="w-4 h-4 text-white" />}
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-8 h-8 text-cyan-400" />
                <h2 className="text-4xl md:text-5xl">
                  <span className="text-gray-400 font-mono">05.</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Get In Touch
                  </span>
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
              </div>
              <p className="text-gray-400 text-lg">Let's collaborate on exciting projects!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8">
                  <h3 className="text-2xl mb-6 flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-cyan-400" />
                    Send Message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-mono">{'> '}Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white font-mono"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-mono">{'> '}Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white font-mono"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 font-mono">{'> '}Message</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors resize-none text-white font-mono"
                        placeholder="Your message..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      Send Message
                      <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
                    <h3 className="text-2xl mb-6 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      Connect
                    </h3>
                    <div className="space-y-4">
                      <a
                        href="mailto:shubhsinghal.work@gmail.com"
                        className="flex items-center gap-4 p-4 bg-black/30 border border-cyan-500/20 rounded-lg hover:border-cyan-400 hover:bg-black/50 transition-all group/link"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center group-hover/link:scale-110 transition-transform">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-mono">EMAIL</p>
                          <p className="text-white group-hover/link:text-cyan-400 transition-colors font-mono text-sm">shubhsinghal.work@gmail.com</p>
                        </div>
                      </a>

                      <a
                        href="https://linkedin.com/in/shubh-singhal-"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-black/30 border border-purple-500/20 rounded-lg hover:border-purple-400 hover:bg-black/50 transition-all group/link"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover/link:scale-110 transition-transform">
                          <Linkedin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-mono">LINKEDIN</p>
                          <p className="text-white group-hover/link:text-purple-400 transition-colors font-mono text-sm">/in/shubh-singhal-</p>
                        </div>
                      </a>

                      <a
                        href="tel:+918938063307"
                        className="flex items-center gap-4 p-4 bg-black/30 border border-pink-500/20 rounded-lg hover:border-pink-400 hover:bg-black/50 transition-all group/link"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover/link:scale-110 transition-transform">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-mono">PHONE</p>
                          <p className="text-white group-hover/link:text-pink-400 transition-colors font-mono text-sm">+91 8938063307</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 rounded-2xl p-6 text-center">
                    <Zap className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Open to <span className="text-cyan-400 font-semibold">internships</span>, <span className="text-purple-400 font-semibold">collaborations</span>, and exciting project opportunities in AI/ML and IoT!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-mono text-gray-400">shubhsinghal.in</span>
              </div>
              <p className="text-gray-400 text-sm font-mono">
                © 2026 Shubh Singhal • Built with React & Tailwind CSS
              </p>
              <p className="text-gray-500 text-xs font-mono">
                {'<'}Designed for innovation, crafted with passion{' />'}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}