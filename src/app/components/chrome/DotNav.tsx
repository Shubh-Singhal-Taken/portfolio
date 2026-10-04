import { navItems } from "../../lib/navigation";
import { useI18n } from "../../lib/i18n";
import { scrollToSection } from "../../lib/scroll";

type Props = { activeId: string };

export default function DotNav({ activeId }: Props) {
  const { t } = useI18n();

  return (
    <ul className="nav__dot" aria-label="Section navigation">
      {navItems.map((item) => {
        const label = t(item.key);
        const current = activeId === item.id;

        return (
          <li key={item.id} data-nav-href={item.href}>
            <button
              type="button"
              aria-label={label}
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
