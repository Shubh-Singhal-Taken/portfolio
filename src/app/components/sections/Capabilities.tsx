import { capabilities } from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

export default function Capabilities() {
  const { t } = useI18n();

  return (
    <section className="section service" id="service" data-nav>
      <SectionTitle title={t("SERVICE-TITLE")} lead={t("SERVICE-TEXT")} />

      <div className="service-card-wrapper">
        {capabilities.map((item) => {
          const Icon = item.icon;
          return (
            <article className="service-card" key={item.title} tabIndex={0} data-reveal>
              <div className="service-card-icon" aria-hidden="true">
                <Icon size={44} strokeWidth={1.1} />
              </div>
              <h3 className="service-card-text">{item.title}</h3>
              <div className="service-card-content">
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
