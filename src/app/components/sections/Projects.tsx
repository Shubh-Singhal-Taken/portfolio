import { useMemo } from "react";
import { projects } from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";
import Carousel3D from "../projects/Carousel3D";

type Props = {
  index: number;
  onIndexChange: (index: number) => void;
  onOpen: (slug: string) => void;
};

export default function Projects({ index, onIndexChange, onOpen }: Props) {
  const { t } = useI18n();

  // Featured project leads; the rest keep their authored order.
  const ordered = useMemo(
    () => [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)),
    []
  );

  return (
    <section className="section" id="projects" data-nav>
      <SectionTitle title={t("PROJECT-TITLE")} lead={t("PROJECT-TEXT")} />

      <Carousel3D
        projects={ordered}
        index={index}
        onIndexChange={onIndexChange}
        onOpen={onOpen}
      />
    </section>
  );
}
