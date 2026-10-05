import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";
import { LENSES, identity, lenses } from "../content";

/* Served for any path that isn't a page. Built as 404.html so the host
   answers with a real 404 instead of a soft "200, here's the home page". */

export default function NotFound() {
  return (
    <>
      <PageMeta
        title={`Page not found | ${identity.name}`}
        description="This page doesn't exist."
        path="/404"
        noindex
      />

      <main id="main" className="not-found">
        <section className="section not-found__body">
          <p className="not-found__code">404</p>
          <h1 className="not-found__title">This page drifted out of orbit.</h1>
          <p className="not-found__text">
            The link may be old or mistyped. Here's where you can go instead:
          </p>

          <nav className="not-found__links" aria-label="Pages">
            <Link to="/">{identity.name}</Link>
            {LENSES.map((id) => (
              <Link key={id} to={lenses[id].path}>
                {lenses[id].role}
              </Link>
            ))}
          </nav>
        </section>
      </main>
    </>
  );
}
