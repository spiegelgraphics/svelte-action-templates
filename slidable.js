/**
 * Make HTML element slidable along horizontal or vertical axis.
 * Adds event listeners to enable moving HTML elements.
 *
 * @fires  slidestart {x, y}
 * @fires  slide {x, y, dx, dy}
 * @fires  slideend {x, y, left, top}
 *
 * @listens mousedown
 * @listens touchstart
 * @listens mousemove
 * @listens touchmove
 * @listens mouseup
 * @listens touchend
 *
 * @param {Element}  node  The HTML element (with use directive).
 *
 * @example  &lt;div use:slidable on:slide={slideHandler}></div>
 */

export const slidable = (node) => {

  const eventNameHandler = {
    "mouse": {
      "move": "mousemove",
      "end": "mouseup"
    },
    "touch": {
      "move": "touchmove",
      "end": "touchend"
    }
  };

  let x;
  let y;
  let left;
  let top;
  let isTouch;

  const dispatchSlideEvent = (node, eventName, detail = {}) => {
    node.dispatchEvent(
      new CustomEvent(eventName, {
        detail: detail,
      })
    );
  };

  const getClientPosition = (e) => {
    const {clientX = 0, clientY = 0} = isTouch ? e.changedTouches[0] : e;
    return {clientX, clientY};
  };

  const handleMove = (e) => {
    e.stopPropagation();
    const {clientX, clientY} = getClientPosition(e);
    const dx = clientX - x || 0;
    const dy = clientY - y || 0;
    x = clientX;
    y = clientY;
    dispatchSlideEvent(node, "slide", {x, y, dx, dy});
  };

  const handleEnd = (e) => {
    e.stopPropagation();
    // noinspection JSUnresolvedReference
    left = node.offsetLeft;
    // noinspection JSUnresolvedReference
    top = node.offsetTop;
    const {clientX: x, clientY: y} = getClientPosition(e);

    dispatchSlideEvent(node, "slideend", {x, y, left, top});

    const eventListenerParams = isTouch ? eventNameHandler.touch : eventNameHandler.mouse;
    window.removeEventListener(eventListenerParams.move, handleMove);
    window.removeEventListener(eventListenerParams.end, handleEnd);
  };

  const handleStart = (e) => {
    e.stopPropagation();
    isTouch = e.type === "touchstart";
    const {clientX, clientY} = getClientPosition(e);

    x = clientX;
    y = clientY;

    dispatchSlideEvent(node, "slidestart", {x, y});

    const eventListenerParams = isTouch ? eventNameHandler.touch : eventNameHandler.mouse;
    window.addEventListener(eventListenerParams.move, handleMove);
    window.addEventListener(eventListenerParams.end, handleEnd);
  };


  node.addEventListener("mousedown", handleStart);
  node.addEventListener("touchstart", handleStart);

  return {
    destroy() {
      node.removeEventListener("mousedown", handleStart);
      node.addEventListener("touchstart", handleStart);
    }
  };
};
