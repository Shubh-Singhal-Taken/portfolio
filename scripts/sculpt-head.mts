/* Bakes the sculpted head into public/head-cloud.bin.

   Sampling the signed-distance sculpt takes several seconds of pure
   arithmetic, far too long for a visitor's phone, so it runs here once
   and the browser downloads the result (~100 KB).

   Run after any change to src/app/portrait/headSculpt.ts:
     npm run sculpt:head

   Format (little-endian):
     u32 magic "HEAD" · u32 count
     i16 × 3 × count   positions × 10000
     i8  × 3 × count   normals × 127
     u8  × count       shade × 255
     u8  × count       kind (0 skin, 1 hair, 2 eye)

   Points are written in sampling order, which is random, so any prefix
   is an even subsample: phones read only the first few thousand. */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sculptHead } from "../src/app/portrait/headSculpt.ts";

const COUNT = 9500;
const out = fileURLToPath(new URL("../public/head-cloud.bin", import.meta.url));

const started = performance.now();
const cloud = sculptHead(COUNT);
const n = cloud.count;

const buffer = new ArrayBuffer(8 + n * 6 + n * 3 + n + n);
const view = new DataView(buffer);
view.setUint32(0, 0x48454144, true);
view.setUint32(4, n, true);

const positions = new Int16Array(buffer, 8, n * 3);
const normals = new Int8Array(buffer, 8 + n * 6, n * 3);
const shade = new Uint8Array(buffer, 8 + n * 9, n);
const kind = new Uint8Array(buffer, 8 + n * 10, n);

for (let i = 0; i < n * 3; i++) {
  positions[i] = Math.round(cloud.positions[i] * 10000);
  normals[i] = Math.round(cloud.normals[i] * 127);
}
for (let i = 0; i < n; i++) {
  shade[i] = Math.round(cloud.shade[i] * 255);
  kind[i] = cloud.kind[i];
}

writeFileSync(out, new Uint8Array(buffer));
console.log(
  `head-cloud.bin: ${n} points, ${(buffer.byteLength / 1024).toFixed(1)} KB, ` +
    `${((performance.now() - started) / 1000).toFixed(1)} s`
);
