import { Award, GraduationCap, type LucideIcon } from "lucide-react";

export type EducationEntry = {
  qualification: string;
  institution: string;
  period: string;
  note?: string;
};

export type Certification = {
  title: string;
  issuer: string;
  note?: string;
};

export const educationIcon: LucideIcon = GraduationCap;
export const certificationIcon: LucideIcon = Award;

export const education: EducationEntry[] = [
  {
    qualification: "B.Tech, Computer Science & Engineering",
    institution: "GLA University, Mathura",
    period: "Aug 2023 – May 2027",
    note: "Specialisation in AI/ML and IoT",
  },
  {
    qualification: "Intermediate",
    institution: "Sacred Heart Sen. Sec. Convent School, Chandausi",
    period: "Apr 2021 – May 2023",
  },
];

export const certifications: Certification[] = [
  {
    title: "Azure AI Fundamentals (AI-900)",
    issuer: "Microsoft",
  },
  {
    title: "Organisational Behaviour: Individual Dynamics in Organisation",
    issuer: "NPTEL",
    note: "Silver medal",
  },
];
