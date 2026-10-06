import type { NavItem } from "../../lib/navigation";
import { useI18n } from "../../lib/i18n";
import { scrollToSection } from "../../lib/scroll";

type Props = { items: NavItem[]; activeId: string };

export default function DotNav({ items, activeId }: Props) {
  const { t } = useI18n();

  return (
    // A pointer shortcut only: the overlay menu offers the same jumps to
    // keyboard and screen-reader users, so these stay out of the tab order
    // instead of putting six stops before the content.
    <ul className="nav__dot" aria-hidden="true">
      {items.map((item) => {
        const label = t(item.key);
        const current = activeId === item.id;

        return (
          <li key={item.id} data-nav-href={item.href}>
            <button
              type="button"
              tabIndex={-1}
              aria-current={current}
              title={label}
              onClick={() => scrollToSection(item.href)}
            />
          </li>
        );
      })}
    </ul>
  );
}
