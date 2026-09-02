import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { identity } from "../../data/portfolio";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-copy">
          © {new Date().getFullYear()} {identity.name}. Designed & built with precision.
        </p>
        <div className="footer-social">
          <a href={identity.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <Github size={16} />
          </a>
          <a href={identity.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <Linkedin size={16} />
          </a>
          <a href={`mailto:${identity.email}`} aria-label="Send email">
            <Mail size={16} />
          </a>
          <a href="#home" aria-label="Back to top">
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
