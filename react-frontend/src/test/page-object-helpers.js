import { prettyDOM } from '@testing-library/react';
import { elementText } from '@thesoulfresh/interactors';

/**
 * Print an element DOM to the console.
 * @param {HTMLElement|HTMLElement[]|NodeList} el
 */
export function printElements(el) {
  if (el?.length !== undefined) {
    el.forEach(e => console.log(prettyDOM(e)));
  } else {
    console.log(prettyDOM(el));
  }
}

/**
 * Get the label text associated with an element.
 * If the element has multiple objects that define it's
 * label, they will be combined with a space.
 */
export function getLabel(el) {
  let labels = [];

  // NOTE el.ariaLabels does not work in jsDOM
  if (el.hasAttribute('aria-label')) labels.push(el.getAttribute('aria-label'));

  if (el.labels) {
    try {
      const l = Array.from(el.labels).map(label => {
        let labelText = elementText(label);
        if (label.contains(el)) {
          // Remove the element's text from the label.
          return labelText.replace(elementText(el), '').trim();
        } else {
          return labelText;
        }
      });
      labels = labels.concat(l);
    } catch(e) { }
  }

  return labels.join(' ');
}
