
/**
 * Convert a CSS time string (like 3s or 250ms) into
 * a Number in milliseconds.
 * @param {string} time
 * @return {number}
 */
export function cssTimeToMS(time) {
  if (typeof(time) === 'number') {
    return time;
  }
  else if (typeof(time) === 'string') {
    let out;
    time = time.trim();
    if (time.endsWith('ms')) {
      out = Number(time.replace('ms', ''));
    } else if (time.endsWith('s')) {
      out = Number(time.replace('s', ''));
      if (!isNaN(out)) out *= 1000;
    } else {
      out = Number(time);
    }
    return out || 0;
  }
  else {
    return 0;
  }
}
