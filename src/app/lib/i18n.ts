/* Every user-facing string in one table, so copy is edited in one place
   rather than hunted for across components. English only; a second
   language would come back as a parallel table keyed the same way. */

const strings = {
  "LOADER-TEXT": "Software · AI · IoT",
  "HOME-ROLE": "Software · AI · IoT Engineer",
  "HOME-SUB": "From the sensor on the bench to the model that reads it to the product people use.",
  "CONTACT-BTN": "Get In Touch",

  "HOME-MENU": "Home",
  "ABOUT-MENU": "About",
  "PROJECTS-MENU": "Projects",
  "AWARDS-MENU": "Recognition",
  "JOURNEY-MENU": "Journey",
  "CONTACT-MENU": "Contact",
  "INTRO-MENU": "Intro",
  "WORK-MENU": "Work",
  "EXPERIENCE-MENU": "Experience",
  "SKILLS-MENU": "Skills",
  "PAGES-LABEL": "Pages",
  "PROFILES-LABEL": "Profiles",
  "PROFILES-MENU": "Profiles",
  "PROFILES-TITLE": "Profiles",
  "PROFILES-TEXT": "Three roles, one engineer. Pick the one you're hiring for.",

  "WORK-TITLE": "Selected work",
  "WORK-TEXT": "The builds that show it best, strongest first.",
  "WORK-MORE": "More builds",
  "WORK-CASE": "Read the case study",
  "EXPERIENCE-TITLE": "Experience",
  "EXPERIENCE-PREVIOUSLY": "Previously",
  "SKILLS-TITLE": "Skills",
  "SKILLS-TEXT": "Grouped the way the work uses them.",
  "VIEW-WORK": "View the work",
  "DOWNLOAD-RESUME": "Download resume",

  "ABOUT-TITLE": "About",
  "EDU-BTN": "Education",
  "SKILL-BTN": "Skills",
  RESUME: "resume",
  "CERTS-TITLE": "Certifications",
  "SOFT-SKILLS-TITLE": "Beyond the toolkit",


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
  "JOURNEY-TEXT": "From a first hackathon to leading a 150-member community and shipping production AI.",

  "CONTACT-TITLE": "Contact",
  "CONTACT-TEXT":
    "Open to software, AI and IoT roles, research collaborations and ambitious builds. Email is the fastest way to reach me, and I reply to everything.",
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

  "GAME-OPEN": "Play the space game",
  "GAME-BACK": "Back to portfolio",
  "MENU-OPEN": "Open menu",
  "MENU-CLOSE": "Close menu",
} as const;

export type StringKey = keyof typeof strings;

const t = (key: StringKey): string => strings[key];

/** Kept as a hook so components read copy the same way everywhere. */
export const useI18n = () => ({ t });
