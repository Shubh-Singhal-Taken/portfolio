import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { projectVideoSrc, type Project } from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";
import { lockScroll } from "../../lib/scrollLock";

type Props = {
  project: Project;
  onClose: () => void;
};

export default function ProjectLightbox({ project, onClose }: Props) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const video = projectVideoSrc(project.slug);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const release = lockScroll();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      // Keep focus inside the dialog while it is open.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      release();
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <>
      <div
        id="lightboxBackdrop"
        className="lightbox-backdrop"
        onClick={onClose}
      />

      <div
        id="videoLightbox"
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} — ${project.tagline}`}
      >
        <div className="lightbox-grid" ref={panelRef}>
          <button
            ref={closeRef}
            type="button"
            className="close"
            onClick={onClose}
            aria-label={t("PROJECT-CLOSE")}
          >
            <X size={18} />
          </button>

          <div className="lightbox-video-area">
            {video ? (
              <video src={video} autoPlay muted loop playsInline controls />
            ) : (
              <div className="project-poster">
                <h3 className="project-poster__title">{project.title}</h3>
                <p className="project-poster__tagline">{project.tagline}</p>
              </div>
            )}
          </div>

          <div className="project-description-container">
            <h3 className="project-name">{project.title}</h3>
            <p className="project-role">
              {project.role}
              {project.team ? ` · ${project.team}` : ""} · {project.date}
            </p>

            <p className="project-description-text">{project.summary}</p>

            <div className="project-case">
              <section>
                <h4>{t("PROJECT-PROBLEM")}</h4>
                <p>{project.problem}</p>
              </section>
              <section>
                <h4>{t("PROJECT-APPROACH")}</h4>
                <p>{project.approach}</p>
              </section>
              <section>
                <h4>{t("PROJECT-RESULT")}</h4>
                <p>{project.result}</p>
              </section>
            </div>
          </div>

          <div className="project-meta">
            <p className="project-metric">
              <span>{t("PROJECT-METRIC")}</span>
              {project.metric}
            </p>

            <div className="project-tags">
              {project.tags.map((tag) => (
                <div className="tag" key={tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
