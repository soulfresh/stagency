const path = require('path')
const { readFileSync, readdirSync } = require('fs')
const Handlebars = require('handlebars')
const objectGet = require('lodash/get')

module.exports = {
  generate: (package, repository, debug = false) => {
    const templateDir = path.resolve(__dirname, 'templates')

    /**
     * Get or compile a Handlebars partial.
     */
    const getPartial = (name) => {
      let partial = Handlebars.partials[name]
      if (partial && typeof partial !== 'function') {
        partial = Handlebars.compile(partial)
      }
      return partial
    }

    /**
     * Add padding to the front of a string.
     */
    const pad = (count, text = '  ') => {
      let out = ''
      for (let i = 0; i < count; i++) {
        out += text
      }
      return out
    }

    /**
     * Load a partial file and register it with Handlebars.
     * You can also replace any content in the file with custom
     * variables by using the replacement parameter.
     */
    const registerPartial = (name, file, replacements) => {
      const data = readFileSync(path.resolve(templateDir, file))
      let template = `${data}`.trim()

      if (replacements) {
        if (!Array.isArray(replacements)) replacements = [replacements]
        replacements.forEach(({ search, replacement }) => {
          const exp = new RegExp(search, 'g')
          template = template.replace(exp, replacement)
        })
      }

      Handlebars.registerPartial(name, template)
    }

    // Add all partial definitions in the partials directory.
    readdirSync(templateDir).forEach((file) => {
      try {
        const desc = path.parse(file)
        if (debug)
          console.log(`registering partial file ${file} as ${desc.name}`)
        registerPartial(desc.name, file)
      } catch (e) {
        console.log(`Failed to load partial templates/${file}`, e)
      }
    })

    // Expose the repository URL as a helper.
    Handlebars.registerHelper('repository-url', () => repository)

    // HELPERS
    /** Pad the front of a string with the given text */
    Handlebars.registerHelper('pad', (count, text = ' ') => pad(count, text))
    /** Add two numbers together */
    Handlebars.registerHelper('add', (a, b) => Number(a) + Number(b))
    /** Trim whitespace from a value */
    Handlebars.registerHelper('trim', (a) => String(a).trim())
    /** Convert the given text to lower case */
    Handlebars.registerHelper('lowercase', function (options) {
      return options.fn(this).toLowerCase()
    })
    /** Render the given text without performing HTML escaping */
    Handlebars.registerHelper('raw-helper', function (options) {
      return new Handlebars.SafeString(options.fn(this))
    })
    /** Determine if the given module has docs to link to */
    Handlebars.registerHelper(
      'hasDocs',
      (m) => m.kindString !== 'Project' && m.kindString !== 'Module',
    )
    /** Determine if the provided object has a children array with items. */
    Handlebars.registerHelper(
      'hasChildren',
      (m) => m.children && m.children.length > 0,
    )
    Handlebars.registerHelper('log', (...variables) =>
      console.log('>', ...variables.slice(0, -1)),
    )
    Handlebars.registerHelper('logJSON', (variable) =>
      console.log('>', JSON.stringify(variable, null, 2)),
    )
    /** Determine if two parameters are strictly equal */
    Handlebars.registerHelper('eq', (a, b) => a === b)
    /** Render the block if two parameters are strictly equal */
    Handlebars.registerHelper('ifEqual', function (a, b, options) {
      if (a === b) options.fn(this)
    })
    /** Get an array item at a specific index */
    Handlebars.registerHelper('array-index', (list, index) => list[index])
    /** Get an object property using lodash `objectGet` */
    Handlebars.registerHelper('with', function (thepath) {
      return objectGet(this, thepath)
    })
    /**
     * Specify the context for a partial using lodash `objectGet`
     * to get a deeply nest property from the outer context.
     */
    Handlebars.registerHelper('context', function (thepath, options) {
      const context = objectGet(this, thepath)
      if (context) return options.fn(context)
      else return undefined
    })

    Handlebars.registerHelper('module-docs', (thepackage) => {
      const renderModule = (m, level = 1) => {
        const partialName = `doc-${m.kindString.toLowerCase()}`

        try {
          const partial = getPartial(partialName)

          if (partial) {
            let out = partial({ ...m, level: level + 1 })

            return out
          } else {
            console.warn(`Partial does not exist: ${partialName}`)
          }
        } catch (e) {
          console.error(`Error loading partial ${partialName}`, e)
          return ''
        }
      }

      if (!Array.isArray(thepackage)) thepackage = [thepackage]
      return new Handlebars.SafeString(
        thepackage
          .map((m) => {
            const result = renderModule(m, 1)
            return result
          })
          .join(''),
      )
    })

    const render = Handlebars.compile('{{> main}}')
    return render({ package })
  },
}
