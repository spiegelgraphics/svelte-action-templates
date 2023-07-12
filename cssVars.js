/**
 * Set CSS variables in style-attribute on a node
 *
 * @param {Element}  node  The HTML element (with use directive).
 * @param {Object}  variables  List of CSS-Variables (key-value-pairs). CSS-Var-Names (keys) without leading "--".
 */

const setCssVariables = (node, variables) => {

  Object.entries(variables).forEach(([name, value]) => {
    if (value !== undefined) {
      node.style.setProperty(`--${name}`, value);
    }
  });

};

export const cssVars = (node, variables) => {
  setCssVariables(node, variables);

  return {
    update(variables) {
      setCssVariables(node, variables);
    }
  };
};
