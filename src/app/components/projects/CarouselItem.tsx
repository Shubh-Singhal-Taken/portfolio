import type { CSSProperties } from "react";
import { medalColors, projectVideoSrc, type Project } from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";

type Props = {
  project: Project;
  /** -1, 0, 1 for the neighbours and the active slide; "far" beyond that. */
  position: number | "far";
  active: boolean;
  onOpen: () => void;
};

export default function CarouselItem({ project, position, active, onOpen }: Props) {
  const { t } = useI18n();
  const video = projectVideoSrc(project.slug);

  return (
    <div
      className="carousel__slider__item"
      data-pos={position}
      aria-hidden={!active}
    >
      <div
        className="item__3d-frame"
        role={active ? "button" : undefined}
        tabIndex={active ? 0 : -1}
        onClick={active ? onOpen : undefined}
        onKeyDown={
          active
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen();
                }
              }
            : undefined
        }
        aria-label={active ? `${project.title} — ${t("PROJECT-OPEN")}` : undefined}
      >
        <div className="item__3d-frame__box item__3d-frame__box--left" />
        <div className="item__3d-frame__box item__3d-frame__box--right" />

        <div className="item__3d-frame__box item__3d-frame__box--front">
          {video ? (
            <video src={video} autoPlay muted loop playsInline preload="metadata" />
          ) : (
            <div
              className="project-poster"
              style={
                project.award
                  ? ({ "--medal": medalColors[project.award.medal] } as CSSProperties)
                  : undefined
              }
            >
              {project.award ? (
                <span className="project-poster__award">
                  {project.award.label}
                </span>
              ) : null}

              <h3 className="project-poster__title">{project.title}</h3>
              <p className="project-poster__tagline">{project.tagline}</p>

              <div className="project-poster__tags">
                {project.tags.slice(0, 5).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p className="project-poster__cue">{t("PROJECT-OPEN")}</p>
            </div>
          )}
        </div>
      </div>

      <div className="card-info">
        <h3>{project.title}</h3>
        <p>
          {project.role} · {project.date}
        </p>
      </div>
    </div>
  );
}
