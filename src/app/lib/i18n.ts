/* Every user-facing string in one table, so copy is edited in one place
   rather than hunted for across components. English only; a second
   language would come back as a parallel table keyed the same way. */

const strings = {
  "LOADER-TEXT": "AI / ML ENGINEER",
  HOME: "| AI/ML & IOT ENGINEER |",
  "HOME-TYPED-1": "AI/ML & IoT Engineer",
  "HOME-TYPED-2": "Autonomous Systems Builder",
  "HOME-TYPED-3": "Edge AI & Computer Vision",
  "HOME-TYPED-4": "Robotics & Embedded Engineer",
  "CONTACT-BTN": "Get In Touch",

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
  FAILED: "The message couldn't be sent. Please email me directly instead:",
  HANDOFF:
    "Your email app should open with the message ready to send. If it didn't, write to me at:",

  COPYRIGHT_TEXT: "© {year} Shubh Singhal — All rights reserved.",
  FOOTER_PRIVACY_LINK: "Back to top",

  "GAME-OPEN": "Open game",
  "GAME-BACK": "Back to portfolio",
  "MENU-OPEN": "Open menu",
  "MENU-CLOSE": "Close menu",
} as const;

export type StringKey = keyof typeof strings;

const t = (key: StringKey): string => strings[key];

/** Kept as a hook so components read copy the same way everywhere. */
export const useI18n = () => ({ t });
