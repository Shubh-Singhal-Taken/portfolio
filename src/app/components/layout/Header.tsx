import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, Command as CommandIcon, Menu, X } from "lucide-react";
import { nav } from "../../data/portfolio";
import { EASE } from "../../lib/motion";
import Magnetic from "../primitives/Magnetic";

const isMac =
  typeof navigator !== "undefined" && /mac/i.test(navigator.platform || navigator.userAgent);

/* Brand logo already links home, so the desktop bar shows the 6 content links. */
const navLinks = nav.filter((n) => n.href !== "#home");

export default function Header({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#home" className="brand" aria-label="Shubh Singhal home">
          <span className="brand-mark">SS</span>
          <span className="brand-name">SHUBH SINGHAL</span>
        </a>

        <nav className="nav" aria-label="Primary">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${active === item.href ? "nav-link--active" : ""}`}
              aria-current={active === item.href ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
          <button type="button" className="cmdk-hint" onClick={onOpenCommand} aria-label="Open command menu">
            <CommandIcon size={13} />
            <kbd>{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <Magnetic>
            <a href="#contact" className="btn btn-solid nav-cta">
              Hire Me <ArrowUpRight size={15} />
            </a>
          </Magnetic>
        </nav>

        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="btn btn-solid"
              style={{ marginTop: "0.5rem" }}
              onClick={() => setOpen(false)}
            >
              Hire Me <ArrowUpRight size={15} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
