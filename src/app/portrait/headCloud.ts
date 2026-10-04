/* Loads the baked head point cloud written by scripts/sculpt-head.mts.
   See that script for the binary layout. */

export type HeadCloud = {
  positions: Float32Array;
  normals: Float32Array;
  shade: Float32Array;
  kind: Uint8Array;
  count: number;
};

const MAGIC = 0x48454144; // "HEAD"

/** Fetch the cloud and decode at most `limit` points. */
export async function loadHeadCloud(url: string, limit: number): Promise<HeadCloud> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== MAGIC) throw new Error(`${url}: not a head cloud`);

  const total = view.getUint32(4, true);
  // Points are stored in random sampling order, so a prefix is an even
  // subsample of the whole bust.
  const n = Math.min(total, limit);

  const rawPositions = new Int16Array(buffer, 8, total * 3);
  const rawNormals = new Int8Array(buffer, 8 + total * 6, total * 3);
  const rawShade = new Uint8Array(buffer, 8 + total * 9, total);
  const rawKind = new Uint8Array(buffer, 8 + total * 10, total);

  const positions = new Float32Array(n * 3);
  const normals = new Float32Array(n * 3);
  const shade = new Float32Array(n);

  for (let i = 0; i < n * 3; i++) {
    positions[i] = rawPositions[i] / 10000;
    normals[i] = rawNormals[i] / 127;
  }
  for (let i = 0; i < n; i++) shade[i] = rawShade[i] / 255;

  return { positions, normals, shade, kind: rawKind.slice(0, n), count: n };
}

/* Material codes; must match SKIN / HAIR / EYE in headSculpt.ts. */
export const HAIR = 1;
export const EYE = 2;
