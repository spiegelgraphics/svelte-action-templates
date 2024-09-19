# <img src="https://raw.githubusercontent.com/SPIEGEL-GUI/assets/master/logo_one_letter.svg" height="26" /> svelte-action-templates
DER SPIEGEL templates for Svelte actions


## Content

### [cssVars](./cssVars.js)

Set CSS variables from List (Object) on an element. Useful handling a bunch of values.

`<div use:cssVars={{color: "red"}}>` results in `<div style="--color: red">`

### [intersectionObserver](./intersectionObserver.js)

Observe intersection of an element with the viewport. Individual options possible for each element.
With uniform options, only one instance of the IntersectionObserver object is created.

The config options correspond to those of the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and are extended by the ‘callback’ parameter:<br>
`callback` (type fn; required), `rootMargin`, `thresholds` und `root`.

`buildThresholdList` is a small helper that takes a number of steps and returns an array of ratio values.

```html
<script>
  import {buildThresholdList, intersectionObserver} from "$actions/intersectionObserver";
  const options = {
    rootMargin: "20px",
    threshold: buildThresholdList(2),
    callback: (entry, unobserve) => {
      const {isIntersecting = false} = entry;
      $isInView = isIntersecting;
      // When observer is no longer needed, use method unobserve().
      // Otherwise, if not used, delete the 2nd Parameter
    }}
  }
</script>

<div use:intersectonObserver={options}>...</div>
```


### [outsideClickable](./outsideClickable.js)

Capture click outside of element. Useful for closing dropdowns or tooltips.

Fires `click_outside`, event.detail: `{clicked: [target of click], not_clicked: node`.

```html
<div use:clickOutside on:click_outside={e => console.log(e)}>
```

### [slidable](./slidable.js)

Make an HTML element slidable using pointer position.
`slidable` fires the events `slidestart`, `slide` and `slideend`,
delivering information about the current pointer position (x, y, dx, dy, left, top). Set new x- or y-position within the event handler.
Also control the limitation of the sliding zone here.
```Javascript
let pos = 0;
function handleSlide(e) {
  const newPos = pos + e.detail.dx;
  pos = newPos;
  e.target.style.transform = `translateX(${newPos}px)`;
}
```
```html
<div use:slidable on:slide={handleSlide}></div>
```
