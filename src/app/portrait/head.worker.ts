/* Sculpting the head takes one to two seconds of pure arithmetic, so it
   runs here instead of on the main thread. The bust is only needed once
   the visitor scrolls toward About, which leaves plenty of time. */

import { sculptHead } from "./headSculpt";

self.onmessage = (event: MessageEvent<{ count: number }>) => {
  const cloud = sculptHead(event.data.count);

  // slice() gives each array its own buffer so all three can be transferred
  const positions = cloud.positions.slice();
  const normals = cloud.normals.slice();
  const shade = cloud.shade.slice();

  (self as unknown as Worker).postMessage(
    { positions, normals, shade, count: cloud.count },
    [positions.buffer, normals.buffer, shade.buffer]
  );
};
