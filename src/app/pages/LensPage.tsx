import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";
import { identity, lenses, type Lens } from "../content";

type Props = { lens: Lens };

/* Route scaffold for /software, /ai and /iot. The full lens page (hero,
   experience, selected work, skills, recognition) is built in the next
   phase; this proves routing, prerendering and per-page titles first. */

export default function LensPage({ lens }: Props) {
  const profile = lenses[lens];

  return (
    <>
      <PageMeta
        title={`${identity.name} | ${profile.role}`}
        description={profile.description}
        path={profile.path}
      />

      <main id="main">
        <section className="section">
          <p>{profile.role}</p>
          <h1>{profile.headline}</h1>
          <p>{profile.sub}</p>
          <Link to="/">{identity.name}</Link>
        </section>
      </main>
    </>
  );
}
