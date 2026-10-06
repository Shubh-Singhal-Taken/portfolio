import {
  LENSES,
  achievements,
  education,
  experience,
  identity,
  lenses,
  type Lens,
  type Project,
} from "../content";

/* schema.org JSON-LD for each kind of page, built from the same content
   the pages render, so search engines read exactly what visitors see.
   The person is defined once (on the front page) and referenced by @id
   everywhere else. */

const site = identity.site;
const personId = `${site}/#person`;

const currentRole = experience.find((role) => role.current);
const degree = education[0];

function person(jobTitle: string | string[]) {
  return {
    "@type": "Person",
    "@id": personId,
    name: identity.name,
    url: `${site}/`,
    image: `${site}/portrait.png`,
    email: `mailto:${identity.email}`,
    jobTitle,
    worksFor: currentRole
      ? { "@type": "Organization", name: currentRole.org }
      : undefined,
    alumniOf: degree
      ? { "@type": "CollegeOrUniversity", name: degree.institution.split(",")[0] }
      : undefined,
    sameAs: [identity.github, identity.linkedin],
    knowsAbout: [
      ...new Set(LENSES.flatMap((id) => lenses[id].skills[0]?.skills.slice(0, 4) ?? [])),
    ],
    award: achievements.map((a) => a.title),
  };
}

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${site}/`,
        url: `${site}/`,
        name: `${identity.name} | ${identity.role}`,
        mainEntity: { "@id": personId },
      },
      person(LENSES.map((id) => lenses[id].role)),
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: `${site}/`,
        name: identity.name,
        publisher: { "@id": personId },
      },
    ],
  };
}

export function lensStructuredData(lens: Lens) {
  const profile = lenses[lens];
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${site}${profile.path}`,
    url: `${site}${profile.path}`,
    name: `${identity.name} | ${profile.role}`,
    description: profile.description,
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      name: identity.name,
      jobTitle: profile.role,
      knowsAbout: profile.skills.flatMap((group) => group.skills).slice(0, 20),
    },
  };
}

export function projectStructuredData(project: Project) {
  const url = `${site}/projects/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    url,
    name: project.title,
    headline: `${project.title}: ${project.tagline}`,
    description: project.summary,
    creator: { "@id": personId, "@type": "Person", name: identity.name },
    keywords: project.tags.join(", "),
    award: project.award?.label,
    image: `${site}/og/projects/${project.slug}.jpg`,
  };
}
