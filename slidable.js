/**
 * Make an HTML element slidable along horizontal axis.
 *
 * Adds event listeners to be able to move HTML elements.
 *
 * @fires  slidestart
 * @fires  slide
 * @fires  slideend
 * 
 * @listens mousedown
 * @listens touchstart
 * @listens mousemove
 * @listens touchmove
 * @listens mouseup
 * @listens touchend
 *
 * @param {Element}  node  The HTML element (with use directive).
 */

export const slidable = (node) => {
    let x;
    let left;
  
    function handleMousedown(e) {
        e.stopPropagation();
        x = e.clientX;
    
        node.dispatchEvent(
            new CustomEvent('slidestart', {
                detail: { x },
            })
        );
    
        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
    }
  
    function handleTouchstart(e) {
        e.stopPropagation();
        x = e.changedTouches[0].clientX;
    
        node.dispatchEvent(
            new CustomEvent('slidestart', {
                detail: { x },
            })
        );
    
        window.addEventListener('touchmove', handleTouchmove);
        window.addEventListener('touchend', handleTouchend);
    }
  
    function handleMousemove(e) {
        e.stopPropagation();
        const dx = e.clientX - x;
        x = e.clientX;
    
        node.dispatchEvent(
            new CustomEvent('slide', {
                detail: { x, dx },
            })
        );
    }
  
    function handleTouchmove(e) {
        e.stopPropagation();
        const dx = e.changedTouches[0].clientX - x;
        x = e.changedTouches[0].clientX;
    
        node.dispatchEvent(
            new CustomEvent('slide', {
                detail: { x, dx },
            })
        );
    }
  
    function handleMouseup(e) {
      e.stopPropagation();
      x = e.clientX;
      left = node.offsetLeft;
  
      node.dispatchEvent(
          new CustomEvent('slideend', {
              detail: { x, left },
          })
      );
  
      window.removeEventListener('mousemove', handleMousemove);
      window.removeEventListener('mouseup', handleMouseup);
    }
  
    function handleTouchend(e) {
      e.stopPropagation();
      x = e.changedTouches[0].clientX;
      left = node.offsetLeft;
  
      node.dispatchEvent(
          new CustomEvent('slideend', {
              detail: { x, left },
          })
      );
  
      window.removeEventListener('touchmove', handleTouchmove);
      window.removeEventListener('touchend', handleTouchend);
    }
  
    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('touchstart', handleTouchstart);
  
    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
            node.addEventListener('touchstart', handleTouchstart);
        }
    };
};