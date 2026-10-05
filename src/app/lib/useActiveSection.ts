import { useEffect, useState } from "react";
import type { NavItem } from "./navigation";

/* Scroll-spy shared by the overlay nav and the dot nav.
   The band is deliberately narrow: a section counts as active only once
   it occupies the middle of the viewport. */

export function useActiveSection(items: NavItem[]): string {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
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
  }, [items]);

  return activeId;
}
