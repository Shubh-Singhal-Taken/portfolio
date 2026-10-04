/* Page scroll lock shared by everything that holds the page still: the
   loader, the overlay nav, the project lightbox and the game.

   Counted rather than toggled, so closing one of them can never unlock
   the page while another still needs it held. */

let holds = 0;

/** Lock page scroll. Returns the matching release; call it exactly once. */
export function lockScroll(): () => void {
  holds += 1;
  document.body.classList.add("no-scroll");

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holds = Math.max(0, holds - 1);
    if (holds === 0) document.body.classList.remove("no-scroll");
  };
}
