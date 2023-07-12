# <img src="https://raw.githubusercontent.com/SPIEGEL-GUI/assets/master/logo_one_letter.svg" height="26" /> svelte-action-templates
DER SPIEGEL templates for Svelte actions


## Content

### [cssVars](./cssVars.js)

Set CSS variables from List (Object) on an element. Useful handling a bunch of values.

`<div use:cssVars={{color: "red"}}>` results in `<div style="--color: red">`

### [intersectionObserver](./intersectionObserver.js)

Observe intersection of an element with the viewport. Individual options possible for each element.
With uniform options, only one instance of the IntersectionObserver object is created.

Params: `callback` (required), `rootMargin` (optional, default: "0px"), `thresholds` und `root`.

`<div use:intersectonObserver={{callback: () => {}, rootMargin: "20px"}}>`


### [outsideClickable](./outsideClickable.js)

Capture click outside of element. Useful for closing dropdowns or tooltips.

Fires `click_outside`, event.detail: `{clicked: [target of click], not_clicked: node`.

`<div use:clickOutside on:click_outside={e => console.log(e)}>`


### [Slidable](./slidable.js)

Make an HTML element slidable along horizontal axis.
