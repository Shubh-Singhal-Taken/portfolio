import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Download, Github, Linkedin, Mail, Send } from "lucide-react";
import { identity } from "../../data/portfolio";
import { useMotionPrefs, viewportOnce } from "../../lib/motion";
import SectionHeading from "../primitives/SectionHeading";
import Magnetic from "../primitives/Magnetic";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { fadeUp } = useMotionPrefs();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section container">
      <SectionHeading
        eyebrow="06 / Contact"
        title={
          <>
            Let's build something <span className="gradient-text">that ships.</span>
          </>
        }
      />

      <div className="contact-grid">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <p className="contact-lead">
            I'm open to internships, full-time roles, and ambitious collaborations where applied
            AI and IoT can create measurable impact. The fastest way to reach me is below.
          </p>

          <div className="hero-actions" style={{ marginTop: "1.8rem" }}>
            <Magnetic>
              <a href={identity.resume} className="btn btn-ghost" download>
                Download Resume <Download size={15} />
              </a>
            </Magnetic>
          </div>

          <div className="contact-links">
            <a className="contact-link" href={`mailto:${identity.email}`}>
              <Mail size={16} /> {identity.email}
            </a>
            <a
              className="contact-link"
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={16} /> linkedin.com/in/{identity.linkedinHandle}
            </a>
            <a
              className="contact-link"
              href={identity.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} /> github.com/{identity.githubHandle}
            </a>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h3>Send a message</h3>
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              required
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              required
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              required
              rows={5}
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-solid">
            Send Message <Send size={15} />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
