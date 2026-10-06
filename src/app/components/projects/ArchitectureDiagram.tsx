import { useId } from "react";
import type { Diagram } from "../../content";

type Props = { diagram: Diagram; title: string };

/* Draws a project's system diagram from its spec in content/diagrams.ts:
   nodes on a column × row grid, curved edges left to right. Plain SVG,
   themed through CSS classes, with the one-sentence summary as both its
   accessible description and its caption. */

const NODE_W = 200;
const NODE_H = 62;
const COL_GAP = 96;
const ROW_STRIDE = 84;
const PAD = 24;

const nodeX = (col: number) => PAD + col * (NODE_W + COL_GAP);
const nodeY = (row: number) => PAD + row * ROW_STRIDE;

export default function ArchitectureDiagram({ diagram, title }: Props) {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const markerId = `${id}-arrow`;

  const width = PAD * 2 + diagram.cols * NODE_W + (diagram.cols - 1) * COL_GAP;
  const height = PAD * 2 + (diagram.rows - 1) * ROW_STRIDE + NODE_H;
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));

  return (
    <figure className="diagram">
      <div className="diagram__scroll">
        <svg
          className="diagram__svg"
          viewBox={`0 0 ${width} ${height}`}
          // Never shrink below ~3/4 scale (labels stay ≥10px; narrower
          // screens scroll the diagram sideways instead)
          // and never grow past natural size, so type stays the same
          // size whether a diagram has three columns or five.
          style={{
            minWidth: `${Math.round(width * 0.75)}px`,
            maxWidth: `${width}px`,
          }}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
        >
          <title id={titleId}>{`${title}: system architecture`}</title>
          <desc id={descId}>{diagram.summary}</desc>

          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" className="diagram__arrow" />
            </marker>
          </defs>

          {diagram.edges.map((edge) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;

            const x1 = nodeX(a.col) + NODE_W;
            const y1 = nodeY(a.row) + NODE_H / 2;
            const x2 = nodeX(b.col) - 3;
            const y2 = nodeY(b.row) + NODE_H / 2;
            const dx = (x2 - x1) / 2;

            return (
              <g key={`${edge.from}-${edge.to}`} className="diagram__edge">
                <path
                  d={`M${x1} ${y1} C${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                  markerEnd={`url(#${markerId})`}
                />
                {edge.label ? (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 7}
                    textAnchor="middle"
                    className="diagram__edge-label"
                  >
                    {edge.label}
                  </text>
                ) : null}
              </g>
            );
          })}

          {diagram.nodes.map((node) => {
            const x = nodeX(node.col);
            const y = nodeY(node.row);
            return (
              <g key={node.id} className={`diagram__node is-${node.kind ?? "service"}`}>
                <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={8} />
                <text
                  x={x + NODE_W / 2}
                  y={node.sub ? y + 26 : y + NODE_H / 2 + 5}
                  textAnchor="middle"
                  className="diagram__label"
                >
                  {node.label}
                </text>
                {node.sub ? (
                  <text
                    x={x + NODE_W / 2}
                    y={y + 45}
                    textAnchor="middle"
                    className="diagram__sub"
                  >
                    {node.sub}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="diagram__caption">
        {diagram.summary}
        {diagram.note ? <span>{diagram.note}</span> : null}
      </figcaption>
    </figure>
  );
}
