import { createContext, useContext } from "react";

/* Mirrors the reference site's `key="..."` string table.
   English is authoritative and complete. Any locale may be partial —
   missing keys fall back to English, so the page can never render a
   raw key or an empty node. */

export const LOCALES = [
  { id: "en", label: "ENG", name: "English" },
  { id: "hi", label: "हिं", name: "हिन्दी" },
] as const;

export type LocaleId = (typeof LOCALES)[number]["id"];

const en = {
  "LOADER-TEXT": "AI / ML ENGINEER",
  "CIRCLE-LABEL": "Click To Enable Sound",
  HOME: "| AI/ML & IOT ENGINEER |",
  "HOME-TYPED-1": "AI/ML & IoT Engineer",
  "HOME-TYPED-2": "Autonomous Systems Builder",
  "HOME-TYPED-3": "Edge AI & Computer Vision",
  "HOME-TYPED-4": "Robotics & Embedded Engineer",
  "CONTACT-BTN": "Get In Touch",
  "SCROLL-CUE": "Scroll",

  "HOME-MENU": "Home",
  "ABOUT-MENU": "About",
  "SERVICE-MENU": "Capabilities",
  "PROJECTS-MENU": "Projects",
  "AWARDS-MENU": "Recognition",
  "JOURNEY-MENU": "Journey",
  "CONTACT-MENU": "Contact",

  "ABOUT-TITLE": "About",
  "EDU-BTN": "Education",
  "SKILL-BTN": "Skills",
  "DOWNLOAD-CV": "Download Resume",
  "SOFT-SKILLS-TITLE": "Beyond the toolkit",

  "SERVICE-TITLE": "Capabilities",
  "SERVICE-TEXT":
    "The engineering I do end to end — from the sensor on the bench to the model on the edge device to the team that ships it.",

  "PROJECT-TITLE": "Projects",
  "PROJECT-TEXT":
    "Signature builds, prototype to production. Select a project to open the full case study.",
  "PROJECT-PROBLEM": "The Problem",
  "PROJECT-APPROACH": "The Approach",
  "PROJECT-RESULT": "The Result",
  "PROJECT-METRIC": "Outcome",
  "PROJECT-OPEN": "Open case study",
  "PROJECT-CLOSE": "Close",
  "PROJECT-PREV": "Previous project",
  "PROJECT-NEXT": "Next project",

  "AWARDS-TITLE": "Recognition",
  "AWARDS-TEXT": "Competitions won and selections earned.",
  "AWARDS-LINK": "View the build",

  "JOURNEY-TITLE": "Journey",
  "JOURNEY-TEXT": "From first hackathon to General Secretary.",

  "CONTACT-TITLE": "Contact",
  "CONTACT-TEXT":
    "Open to AI/ML and IoT roles, research collaborations, and ambitious hardware builds. The fastest way to reach me is email — I reply to everything.",
  "FORM-NAME": "Your name",
  "FORM-EMAIL": "Your email",
  "FORM-MESSAGE": "Your message",
  "SEND-SPAN": "Send",
  "SEND-SENDING": "Sending",
  SUCCESS: "Your message has been sent — I'll get back to you as soon as I can.",
  FAILED: "Something went wrong. Please email me directly instead.",

  COPYRIGHT_TEXT: "© {year} Shubh Singhal — All rights reserved.",
  FOOTER_PRIVACY_LINK: "Back to top",

  "MUSIC-TEXT": "Ambient track",
  "SOUND-ON": "Sound on",
  "SOUND-OFF": "Sound off",
  "GAME-OPEN": "Open game",
  "GAME-BACK": "Back to portfolio",
  "MENU-OPEN": "Open menu",
  "MENU-CLOSE": "Close menu",
  "LANG-LABEL": "Language",
} as const;

export type StringKey = keyof typeof en;

/* Partial by design: fill these in and they take over automatically.
   Anything absent renders the English string. */
const hi: Partial<Record<StringKey, string>> = {
  "HOME-MENU": "होम",
  "ABOUT-MENU": "परिचय",
  "SERVICE-MENU": "क्षमताएँ",
  "PROJECTS-MENU": "प्रोजेक्ट्स",
  "AWARDS-MENU": "सम्मान",
  "JOURNEY-MENU": "यात्रा",
  "CONTACT-MENU": "संपर्क",
  "CONTACT-BTN": "संपर्क करें",
  "SEND-SPAN": "भेजें",
  "SCROLL-CUE": "स्क्रॉल",
};

const dictionaries: Record<LocaleId, Partial<Record<StringKey, string>>> = {
  en,
  hi,
};

export function translate(locale: LocaleId, key: StringKey): string {
  return dictionaries[locale]?.[key] ?? en[key];
}

export type I18n = {
  locale: LocaleId;
  setLocale: (locale: LocaleId) => void;
  t: (key: StringKey) => string;
};

export const I18nContext = createContext<I18n>({
  locale: "en",
  setLocale: () => {},
  t: (key) => en[key],
});

export const useI18n = () => useContext(I18nContext);
