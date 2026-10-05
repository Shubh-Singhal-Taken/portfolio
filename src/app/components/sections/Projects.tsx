import { projectsInOrder } from "../../content";
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

  return (
    <section className="section" id="projects" data-nav>
      <SectionTitle title={t("PROJECT-TITLE")} lead={t("PROJECT-TEXT")} />

      <Carousel3D
        projects={projectsInOrder}
        index={index}
        onIndexChange={onIndexChange}
        onOpen={onOpen}
      />
    </section>
  );
}
