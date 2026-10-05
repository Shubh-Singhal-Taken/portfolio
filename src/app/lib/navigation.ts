import type { StringKey } from "./i18n";

/* In-page sections for each kind of page. Order is the scroll order, the
   overlay-nav order and the dot-nav order; one list drives all three. */

export type NavItem = {
  id: string;
  href: string;
  key: StringKey;
};

const item = (id: string, key: StringKey): NavItem => ({ id, href: `#${id}`, key });

export const homeSections: NavItem[] = [
  item("section-home", "HOME-MENU"),
  item("about", "ABOUT-MENU"),
  item("service", "SERVICE-MENU"),
  item("projects", "PROJECTS-MENU"),
  item("achievements", "AWARDS-MENU"),
  item("journey", "JOURNEY-MENU"),
  item("contact", "CONTACT-MENU"),
];

export const lensSections: NavItem[] = [
  item("lens-top", "INTRO-MENU"),
  item("work", "WORK-MENU"),
  item("experience", "EXPERIENCE-MENU"),
  item("skills", "SKILLS-MENU"),
  item("achievements", "AWARDS-MENU"),
  item("contact", "CONTACT-MENU"),
];
