import { useMemo, useState } from "react";
import PageMeta from "../components/PageMeta";
import { lensStructuredData } from "../lib/structuredData";
import OverlayNav from "../components/chrome/OverlayNav";
import DotNav from "../components/chrome/DotNav";
import LensHero from "../components/lens/LensHero";
import SelectedWork from "../components/lens/SelectedWork";
import ExperienceSection from "../components/lens/ExperienceSection";
import SkillsSection from "../components/lens/SkillsSection";
import Achievements from "../components/sections/Achievements";
import Contact from "../components/sections/Contact";
import {
  achievements,
  experienceFor,
  forLens,
  identity,
  lenses,
  projects,
  type Lens,
} from "../content";
import { lensSections } from "../lib/navigation";
import { useActiveSection } from "../lib/useActiveSection";
import { useRevealAnimations } from "../lib/reveal";
import { useSceneReady } from "../lib/sceneReady";

type Props = { lens: Lens };

/* One profile page: the same content as the front page, chosen and
   ordered for the role this lens presents. Proof first (selected work),
   then where that proof was earned, the tools, the wins, and contact. */

export default function LensPage({ lens }: Props) {
  const profile = lenses[lens];
  const ready = useSceneReady();
  const [navOpen, setNavOpen] = useState(false);

  const work = useMemo(() => forLens(projects, lens), [lens]);
  const roles = useMemo(() => experienceFor(lens), [lens]);
  const wins = useMemo(() => forLens(achievements, lens), [lens]);

  const activeId = useActiveSection(lensSections);
  useRevealAnimations(ready);

  return (
    <>
      <PageMeta
        title={`${identity.name} | ${profile.role}`}
        description={profile.description}
        path={profile.path}
        image={`/og/${lens}.jpg`}
        structuredData={lensStructuredData(lens)}
      />

      <DotNav items={lensSections} activeId={activeId} />
      <OverlayNav
        items={lensSections}
        open={navOpen}
        onToggle={() => setNavOpen((o) => !o)}
        onClose={() => setNavOpen(false)}
        activeId={activeId}
      />

      <main id="main" className="lens-page">
        <LensHero profile={profile} ready={ready} />
        <SelectedWork projects={work} />
        <ExperienceSection roles={roles} />
        <SkillsSection groups={profile.skills} />
        <Achievements items={wins} />
        <Contact />
      </main>
    </>
  );
}
