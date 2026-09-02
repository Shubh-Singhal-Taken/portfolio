import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  FileText,
  FolderGit2,
  Github,
  Home,
  Layers,
  Linkedin,
  Mail,
  Route,
  Search,
  Trophy,
  User,
  type LucideIcon
} from "lucide-react";
import { identity, nav } from "../data/portfolio";

const NAV_ICONS: Record<string, LucideIcon> = {
  "#home": Home,
  "#about": User,
  "#skills": Layers,
  "#projects": FolderGit2,
  "#achievements": Trophy,
  "#journey": Route,
  "#contact": Mail
};

export default function CommandPalette({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const goTo = (href: string) => {
    onOpenChange(false);
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const openExternal = (url: string) => {
    onOpenChange(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return createPortal(
    <div className="cmdk-overlay" role="presentation" onClick={() => onOpenChange(false)}>
      <Command
        label="Command menu"
        loop
        className="cmdk"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cmdk-input-wrap">
          <Search size={18} />
          <Command.Input autoFocus className="cmdk-input" placeholder="Jump to a section or action..." />
        </div>
        <Command.List className="cmdk-list">
          <Command.Empty className="cmdk-empty">No results found.</Command.Empty>

          <Command.Group heading="Navigate" className="cmdk-group">
            {nav.map((item) => {
              const Icon = NAV_ICONS[item.href] ?? Home;
              return (
                <Command.Item
                  key={item.href}
                  className="cmdk-item"
                  value={`go to ${item.label}`}
                  onSelect={() => goTo(item.href)}
                >
                  <Icon />
                  {item.label}
                </Command.Item>
              );
            })}
          </Command.Group>

          <Command.Group heading="Connect" className="cmdk-group">
            <Command.Item
              className="cmdk-item"
              value="email contact message"
              onSelect={() => {
                onOpenChange(false);
                window.location.href = `mailto:${identity.email}`;
              }}
            >
              <Mail />
              Email me
              <span className="cmdk-item-kbd">{identity.email}</span>
            </Command.Item>
            <Command.Item className="cmdk-item" value="github code" onSelect={() => openExternal(identity.github)}>
              <Github />
              GitHub
              <ArrowUpRight className="cmdk-item-kbd" size={14} />
            </Command.Item>
            <Command.Item className="cmdk-item" value="linkedin" onSelect={() => openExternal(identity.linkedin)}>
              <Linkedin />
              LinkedIn
              <ArrowUpRight className="cmdk-item-kbd" size={14} />
            </Command.Item>
            <Command.Item
              className="cmdk-item"
              value="download resume cv"
              onSelect={() => openExternal(identity.resume)}
            >
              <FileText />
              Download resume
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>,
    document.body
  );
}
