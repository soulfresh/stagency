/**
 * This module outputs markdown from the given
 * Typedoc JSON.
 */
module.exports = {
  format: (json, debug = false) => {
    const docs = require(json)

    const modulePackage = (m) => {
      let name = ''
      if (m.sources) {
        // Get the path to the file and use that as the
        // module name. Files in the root of the entry
        // point will be named "".
        name = m.sources[0].fileName.split('/').slice(0, -1).join('.')
      }
      return name
    }

    /**
     * Given a package name like foo.bar.baz, add
     * the given module to that deeply nested object
     * while creating any nodes that don't exist yet.
     */
    const addToPackage = (
      name,
      m,
      package,
      path,
      debugging = false,
      blacklist = ['node_modules'],
    ) => {
      const parts = name.split('.')
      const currentName = parts[0]

      if (!blacklist.includes(currentName)) {
        const next = parts.slice(1).join('.')

        let current = package.find((n) => n.name === currentName)

        if (!current) {
          current = {
            name: currentName,
            kind: 1,
            kindString: 'Module',
            children: [],
          }
          package.push(current)
        }

        if (next) {
          addToPackage(next, m, current.children, path, debugging)
        } else {
          current.children.push(m)
        }
      }
    }

    const parseModule = (m, package, debugging = false) => {
      const name = modulePackage(m)

      const recurse = () => {
        if (m.children?.length > 0) {
          m.children.forEach((child) => parseModule(child, package, debugging))
        }
      }

      const add = () => {
        addToPackage(name, m, package, name, debugging)
      }

      switch (m.kindString) {
        case 'Module':
        case 'Project':
        case undefined:
          recurse()
          break
        case 'Class':
          add()
          break
        default:
          add()
          recurse()
          break
      }

      return package
    }

    const result = parseModule(docs, [])
    if (debug) console.log(JSON.stringify(result, null, 2))
    return result
  },
}
