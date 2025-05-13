
/**
 * The Storybook markdown renderer has trouble
 * handling some of the output from our doc generator.
 * This function will replace any of the characters/words
 * that Storybook chokes on.
 */
export function formatAPIDocs(docs) {
  return docs
    .replaceAll('<code>', '`')
    .replaceAll('</code>', '`')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}
