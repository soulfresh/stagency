const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const async = require('async')

// Why is this not working?
// const scriptsFolder = path.normalize(__dirname, './dev')
const scriptsFolder = __dirname + '/dev'

const files = fs.readdirSync(scriptsFolder)
const currentScript = path.parse(__filename).base

const js = files
  .map((f) => path.parse(f))
  .filter(f => f.ext === '.js' && f.base !== currentScript)
  .map((f) => f.base)

const funcs = js.map(function(js) {
  const file = path.join(scriptsFolder, js)
  console.log(`Generating ${js} ...`)
  return exec.bind(null, `node ${file}`)
})

function getResults(err, data) {
  if (err) {
    return console.log(err)
  }
  const results = data.map(function(lines){
    return lines.join('')
  })
  console.log(results)
}

// // to run your scipts in parallel use
// async.parallel(funcs, getResults)

// to run your scipts in series use
async.series(funcs, getResults)
