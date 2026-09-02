import { Fragment } from "react";
import { tickerItems } from "../../data/portfolio";

export default function Marquee() {
  const loop = [...tickerItems, ...tickerItems];
  return (
    <section className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <Fragment key={i}>
            <span className="marquee-item">{item}</span>
            <span className="marquee-dot" />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
