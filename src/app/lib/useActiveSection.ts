import { useEffect, useState } from "react";
import { navItems } from "./navigation";

/* Scroll-spy shared by the overlay nav and the dot nav.
   The band is deliberately narrow — a section counts as active only
   once it occupies the middle of the viewport. */

export function useActiveSection(): string {
  const [activeId, setActiveId] = useState(navItems[0].id);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return activeId;
}
