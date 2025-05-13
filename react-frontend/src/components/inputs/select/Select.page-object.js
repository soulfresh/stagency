import {
  buildQueries,
  queryHelpers,
  getByText,
  getByTestId,
  queryAllByText,
} from '@testing-library/react';

/**
 * @name getSelectMenuByTrigger
 * @function
 * @description Find the Select menu associated with the given trigger
 * element. The element passed should be the trigger button
 * which has an id that matches the aria-labelledby attribute
 * of the select.
 * @param {HTMLElement} [container] - An element within which to constrain
 *   searching for the menu element.
 * @param {HTMLElement} element - The trigger button with a valid id.
 * @param {object} [options]
 * @return {HTMLElement}
 */
export const [
  querySelectMenuByTrigger,
  getAllSelectMenusByTrigger,
  getSelectMenuByTrigger,
  findAllSelectMenusByTrigger,
  findSelectMenuByTrigger,
] = buildQueries(
  (container, trigger, options) => {
    return queryHelpers.queryAllByAttribute(
      'aria-labelledby',
      container,
      trigger.id,
      options
    );
  },
  (container, trigger) => {
    return `Found multiple elements matching the trigger id ${trigger.id}`;
  },
  (container, trigger) => {
    return `Found no elements matching the trigger id ${trigger.id}`;
  }
);

/**
 * @name getSelectMenuByTriggerText
 * @function
 * @description Get the menu element associated with a select trigger by
 * searching for the given trigger text.
 * @param {HTMLElement} [container] - An element within which to constrain
 *   searching for the menu element.
 * @param {string} text - The text in the trigger you are looking for.
 * @param {object} [options]
 * @return {HTMLElement}
 */
export const [
  querySelectMenuByTriggerText,
  getAllSelectMenusByTriggerText,
  getSelectMenuByTriggerText,
  findAllSelectMenusByTriggerText,
  findSelectMenuByTriggerText,
] = buildQueries(
  (container, text, options) => {
    return getAllSelectMenusByTrigger(
      container,
      getByText(container, text),
      options
    );
  },
  (container, text) => {
    return `Found multiple Select menus matching the trigger text ${text}`;
  },
  (container, text) => {
    return `Found no Select menus matching the trigger text ${text}`;
  }
);

/**
 * @name getSelectMenuByTriggerTestId
 * @function
 * @description
 * Get the menu element associated with a select trigger by
 * searching for the given trigger's test id.
 * @param {string} id - The test id of the trigger you are looking for.
 * @param {HTMLElement} [container] - An element within which to constrain
 *   searching for the menu element.
 * @return {HTMLElement}
 */
export const [
  querySelectMenuByTriggerTestId,
  getAllSelectMenusByTriggerTestId,
  getSelectMenuByTriggerTestId,
  findAllSelectMenusByTriggerTestId,
  findSelectMenuByTriggerTestId,
] = buildQueries(
  (container, id, options) => {
    return getAllSelectMenusByTrigger(
      container,
      getByTestId(container, id),
      options
    );
  },
  (container, id) => {
    return `Found multiple Select menus matching the trigger id ${id}`;
  },
  (container, id) => {
    return `Found no Select menus matching the trigger id ${id}`;
  }
);

/**
 * @name getSelectMenuOptionByTrigger
 * @function
 * @description
 * Get an option element from the menu associated with
 * a Select by the trigger element and option text.
 * @param {HTMLElement} [container] - An element within which to constrain
 *   searching for the menu element.
 * @param {HTMLElement} element - The trigger element for the select
 * @param {string} optionText - The text of the option you want to select
 *   from the menu.
 * @param {object} [options]
 * @return {HTMLElement}
 */
export const [
  querySelectMenuOptionByTrigger,
  getAllSelectMenuOptionsByTrigger,
  getSelectMenuOptionByTrigger,
  findAllSelectMenuOptionsByTrigger,
  findSelectMenuOptionByTrigger,
] = buildQueries(
  (container, trigger, optionText, options) => {
    const menu = getSelectMenuByTrigger(container, trigger, options);
    return queryAllByText(
      menu,
      optionText,
      options
    );
  },
  (container, trigger, text) => {
    return `Found multiple Select menu options matching the text ${text}`;
  },
  (container, trigger, text) => {
    return `Found no Select menu options matching the text ${text}`;
  }
);


/**
 * @name getSelectMenuOptionByTriggerText
 * @function
 * @description
 * Get an option element from the menu associated with
 * a Select trigger by the trigger's text and the option text.
 * @param {HTMLElement} [container] - An element within which to constrain
 *   searching for the menu element.
 * @param {string} triggerText - The text in the trigger you are looking for.
 * @param {string} optionText - The text of the option you want to select
 *   from the menu.
 * @param {object} [options]
 * @return {HTMLElement}
 */
export const [
  querySelectMenuOptionByTriggerText,
  getAllSelectMenuOptionsByTriggerText,
  getSelectMenuOptionByTriggerText,
  findAllSelectMenuOptionsByTriggerText,
  findSelectMenuOptionByTriggerText,
] = buildQueries(
  (container, triggerText, optionText, options) => {
    const menu = getSelectMenuByTriggerText(container, triggerText, options);
    return queryAllByText(
      menu,
      optionText,
      options
    );
  },
  (container, trigger, text) => {
    return `Found multiple Select menu options matching the text "${text}"`;
  },
  (container, trigger, text) => {
    return `Found no Select menu options matching the text "${text}"`;
  }
);

/**
 * @name getSelectMenuOptionByTriggerTestId
 * @function
 * @description
 * Get an option element from the menu associated with
 * a select trigger by the trigger's test id.
 * @param {string} id - The test id of the trigger you are looking for.
 * @param {string} optionText - The text of the option you want to select
 *   from the menu.
 * @param {HTMLElement} [container] - An element within which to constrain
 *   searching for the menu element.
 * @return {HTMLElement}
 */
export const [
  querySelectMenuOptionByTriggerTestId,
  getAllSelectMenuOptionsByTriggerTestId,
  getSelectMenuOptionByTriggerTestId,
  findAllSelectMenuOptionsByTriggerTestId,
  findSelectMenuOptionByTriggerTestId,
] = buildQueries(
  (container, triggerTestId, optionText, options) => {
    const menu = getSelectMenuByTriggerTestId(container, triggerTestId, options);
    return queryAllByText(
      menu,
      optionText,
      options
    );
  },
  (container, trigger, text) => {
    return `Found multiple Select menu options matching the text ${text}`;
  },
  (container, trigger, text) => {
    return `Found no Select menu options matching the text ${text}`;
  }
);

