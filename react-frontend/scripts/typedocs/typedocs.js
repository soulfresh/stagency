const { spawn } = require('child_process')

/**
 * This module uses Typedoc to generate JSON documentation
 * from an entry source file. It assumes the `typedoc`
 * package was installed via npm or yarn.
 */
module.exports = {
  parse: (entry, output, verbose = true) => {
    return new Promise((resolve, reject) => {
      const typedoc = spawn('node', [
        'node_modules/.bin/typedoc',
        '--json',
        output,
        entry,
      ])

      typedoc.stdout.on('data', (data) => {
        if (verbose) console.log(`${data}`.grey)
      })

      typedoc.stderr.on('data', (data) => {
        console.log('☠️  Error: failed to parse documentation...'.brightRed)
        console.error(`${data}`)
        reject(data)
      })

      typedoc.on('close', (code) => {
        resolve(code)
      })
    })
  },
}
