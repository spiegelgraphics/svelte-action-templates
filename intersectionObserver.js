/**
 * Dank an CaptainCodeman: https://github.com/CaptainCodeman/svelte-intersection-observer-action
 */

// track association callback and element; params: node, callback
const intersectionCallbacks = new WeakMap();
// single intersection observer instance per options; params: options, IntersectionObserver
const intersectionObservers = new WeakMap();


const createObserver = (options) => {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const callback = intersectionCallbacks.get(entry.target);
      if (callback) {
        callback(entry);
      }
    }
  }, options);
  intersectionObservers.set(options, observer);
  return observer;
};

const observe = (target, options) => {

  const {callback} = options;
  const observer = intersectionObservers.get(options) || createObserver(options);

  intersectionCallbacks.set(target, callback);
  observer.observe(target);

  return () => {
    observer.unobserve(target);
    intersectionCallbacks.delete(target);
  };
};


/**
 * Intersection Observer als Svelte-Action
 * @param {Element} target
 * @param {Object} options - IntersectionObserver options ("root", "rootMargin", "thresholds") + "callback"
 * @returns {{update(*): void, destroy(): void}}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export const intersectionObserver = (target, options) => {

  let unobserve = observe(target, options);

  return {
    update(options) {
      unobserve();
      unobserve = observe(target, options);
    },
    destroy() {
      unobserve();
    }
  };
};
