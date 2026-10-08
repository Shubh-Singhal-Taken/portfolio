import type { StringKey } from "./i18n";

/* Section order is the scroll order, the overlay-nav order and the
   dot-nav order. One list drives all three. */

export type NavItem = {
  id: string;
  href: string;
  key: StringKey;
};

export const navItems: NavItem[] = [
  { id: "section-home", href: "#section-home", key: "HOME-MENU" },
  { id: "about", href: "#about", key: "ABOUT-MENU" },
  { id: "service", href: "#service", key: "SERVICE-MENU" },
  { id: "projects", href: "#projects", key: "PROJECTS-MENU" },
  { id: "achievements", href: "#achievements", key: "AWARDS-MENU" },
  { id: "journey", href: "#journey", key: "JOURNEY-MENU" },
  { id: "contact", href: "#contact", key: "CONTACT-MENU" },
];
