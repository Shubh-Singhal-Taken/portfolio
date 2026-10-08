import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";
import CarouselItem from "./CarouselItem";

type Props = {
  projects: Project[];
  index: number;
  onIndexChange: (index: number) => void;
  onOpen: (slug: string) => void;
};

export default function Carousel3D({
  projects,
  index,
  onIndexChange,
  onOpen,
}: Props) {
  const { t } = useI18n();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  // One slide's travel distance: its own width plus both 20px margins.
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const measure = () => {
      const first = slider.querySelector<HTMLElement>(".carousel__slider__item");
      if (first) setStep(first.offsetWidth + 40);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(slider);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [projects.length]);

  const go = useCallback(
    (delta: number) => {
      const next = (index + delta + projects.length) % projects.length;
      onIndexChange(next);
    },
    [index, projects.length, onIndexChange]
  );

  // Swipe
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let startX = 0;
    let tracking = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      startX = e.clientX;
      tracking = true;
    };

    const onUp = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;

      const dx = e.clientX - startX;
      if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    };

    slider.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      slider.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [go]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  return (
    <div
      className="carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={t("PROJECT-TITLE")}
      onKeyDown={onKeyDown}
    >
      <div className="carousel__body">
        <div
          className="carousel__slider"
          ref={sliderRef}
          style={{ transform: `translateX(${-index * step}px)` }}
        >
          {projects.map((project, i) => {
            const offset = i - index;
            const position =
              Math.abs(offset) > 1 ? ("far" as const) : offset;

            return (
              <CarouselItem
                key={project.slug}
                project={project}
                position={position}
                active={offset === 0}
                onOpen={() => onOpen(project.slug)}
              />
            );
          })}
        </div>
      </div>

      <div className="carousel__nav">
        <button
          type="button"
          className="carousel__prev"
          onClick={() => go(-1)}
          aria-label={t("PROJECT-PREV")}
        >
          <ChevronLeft size={20} />
        </button>

        <span className="carousel__counter" aria-live="polite">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>

        <button
          type="button"
          className="carousel__next"
          onClick={() => go(1)}
          aria-label={t("PROJECT-NEXT")}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
