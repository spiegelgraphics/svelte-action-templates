/**
 * Capture click outside of element.
 * Inspiration: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
 *
 * @fires click_outside
 * @listens click
 * @param {Element}  node  The HTML element (with use directive).
 */

export const clickOutside = (node) => {
  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent("click_outside", {detail: {clicked: event.target, not_clicked: node}})
      );
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    }
  };
};
