import type { ReactNode } from "react";

type Props = {
  title: string;
  lead?: string;
  children?: ReactNode;
};

/** The underlined grey rule every section opens with. */
export default function SectionTitle({ title, lead, children }: Props) {
  return (
    <header className="section-head" data-reveal>
      <h2 className="section-title">{title}</h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
      {children}
    </header>
  );
}
