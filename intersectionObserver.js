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
      const {callback, unobserve} = intersectionCallbacks.get(entry.target);
      if (callback) {
        callback(entry, unobserve);
      }
    }
  }, options);
  intersectionObservers.set(options, observer);
  return observer;
};

const observe = (target, options) => {

  const {callback} = options;
  const observer = intersectionObservers.get(options) || createObserver(options);
  const unobserve = () => {
    observer.unobserve(target);
    intersectionCallbacks.delete(target);
  };

  intersectionCallbacks.set(target, {callback: callback, unobserve});
  observer.observe(target);

  return unobserve;
};


/**
 * Intersection Observer als Svelte-Action
 * @param {Element} target
 * @param {Object} options - IntersectionObserver options ("rootMargin", "thresholds", "root") + "callback"
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

/**
 * Helferlein für Intersection Observer
 * @param {Number} numSteps - Anzahl der gewünschten Thresholds.
 * @returns {[]} - Array mit Thresholds, z.B. numSteps = 10 → [0, 0.1, 0.2, ..., 1]
 **/
export const buildThresholdList = (numSteps = 10) => {
  const thresholds = [0];

  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }

  return thresholds;
};
