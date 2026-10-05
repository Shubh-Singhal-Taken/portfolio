import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LENSES, identity, lenses } from "../../content";
import { useI18n } from "../../lib/i18n";
import { onScrollChange } from "../../lib/scroll";

/* The bar every page shares: the name (home), the three profile lenses,
   and room on the right for the menu button. Transparent over the hero;
   once the page scrolls it gains a frosted ground so it stays legible
   over content. */

export default function TopBar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => onScrollChange(({ y }) => setScrolled(y > 12)), []);

  return (
    <header className={`top-bar${scrolled ? " is-scrolled" : ""}`}>
      <Link to="/" className="top-bar__home">
        {identity.name}
      </Link>

      <nav className="top-bar__lenses" aria-label={t("PROFILES-LABEL")}>
        {LENSES.map((id) => (
          <NavLink key={id} to={lenses[id].path} className="top-bar__lens">
            {lenses[id].label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
