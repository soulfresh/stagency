

/**
 * Clamp a number between min and max.
 * **Note** that max is passed before min since it is
 * most common to use a min of 0.
 * @param {number} value - The number to clamp.
 * @param {number} [max] - The maximum of the output.
 * @param {number} [min] - The minimum of the output.
 * @return {number}
 */
export const clamp = (value = 0, max = 1, min = 0) => Math.max(min, Math.min(value, max));

/**
 * Clamp values that are defined. null and undefined
 * values are returned unchanged.
 * **Note** that max is passed before min since it is
 * most common to use a min of 0.
 * @param {number} value - The number to clamp.
 * @param {number} [max] - The maximum of the output.
 * @param {number} [min] - The minimum of the output.
 * @return {number}
 */
export const maybeClamp = (value, max, min) => value == null ? value : clamp(value, max, min);

