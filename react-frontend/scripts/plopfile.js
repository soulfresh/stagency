const fs = require('fs')
const path = require('path')
const colors = require('colors')

function makeFolderPath(...args) {
  return path.normalize(args.filter((f) => !!f).join('/'))
}

/**
 * @param {string} componentType - Whether to generate a page or a generic component.
 * @param {boolean} pageSpecific - If true, then this component is specific to a page
 *   and should be created in the page package.
 * @param {string} fullName - The component name including subpackage folders.
 * @param {object} plop - The Plop.js API
 */
function makeComponentActions(componentType, pageSpecific, fullName, plop) {
  const root = pageSpecific ? 'page' : 'component'
  let name
  let subPackage = []
  const p = fullName.split('/')
  if (p.length > 0) name = p[p.length - 1]
  if (p.length > 1) subPackage = p.slice(0, p.length - 1)

  const src = makeFolderPath(process.cwd(), 'src')
  const rootDir = `${root}s`
  const dir = makeFolderPath(src, rootDir, ...subPackage)

  const data = { name, subPackage, componentType }

  const actions = [
    {
      // Name.tsx
      type: 'add',
      data: data,
      // Plop will create directories for us if they do not exist
      // so it's okay to add files in nested locations.
      path: `${dir}/{{dashCase '${name}'}}/{{pascalCase '${name}'}}.tsx`,
      templateFile: `plop-templates/component/{{pascalCase '${componentType}'}}.tsx.hbs`,
    },
    {
      // Name.module.scss
      type        : 'add',
      data        : data,
      path        : `${dir}/{{dashCase '${name}'}}/{{pascalCase '${name}'}}.module.scss`,
      templateFile: `plop-templates/component/Component.module.scss.hbs`,
    },
    {
      // Name.test.tsx
      type: 'add',
      data: data,
      path: `${dir}/{{dashCase '${name}'}}/{{pascalCase '${name}'}}.test.tsx`,
      templateFile: `plop-templates/component/Component.test.tsx.hbs`,
    },
    {
      // Name.page-object.ts
      type: 'add',
      data: data,
      path: `${dir}/{{dashCase '${name}'}}/{{pascalCase '${name}'}}.page-object.ts`,
      templateFile: `plop-templates/component/Component.page-object.ts.hbs`,
    },
    {
      // Name.stories.ts (Web component documentation)
      type: 'add',
      data: data,
      path: `${dir}/{{dashCase '${name}'}}/{{pascalCase '${name}'}}.stories.tsx`,
      templateFile: `plop-templates/component/Component.stories.tsx.hbs`,
    },
    // TODO Move these into the "create if exists and append" loop
    {
      // components/name/index.ts
      type: 'add',
      data: data,
      abortOnFail: false,
      path: `${dir}/{{dashCase '${name}'}}/index.ts`,
      templateFile: `plop-templates/component/component-index.ts.hbs`,
    },
    {
      // components/name/page-objects.ts
      type: 'add',
      data: data,
      abortOnFail: false,
      path: `${dir}/{{dashCase '${name}'}}/page-objects.ts`,
      templateFile: `plop-templates/component/page-objects-index.ts.hbs`,
    },
  ]

  const appendIfUnique = (actions, file, template, data) => {
    // Hmmm...unique is not working
    actions.push({
      type: 'append',
      data,
      path: file,
      template: plop.renderString(template, data),
      pattern: '/* PLOP_INJECT_EXPORT */',
      unique: true,
    })
  }

  // If there are sub packages, update the index file in each of them
  // to include the new component.
  subPackage?.forEach((current, i, folders) => {
    const currentPackageFolders = folders.slice(0, i + 1)
    const currentDirectory = makeFolderPath(
      src,
      rootDir,
      ...currentPackageFolders,
    )
    const nextImport =
      i === folders.length - 1
        ? `{{dashCase '${name}'}}`
        : `{{dashCase '${folders[i + 1]}'}}`

    // Adds an index.ts file to the current subpackage if it does not already exist
    actions.push({
      type: 'add',
      data: data,
      path: `${currentDirectory}/index.ts`,
      templateFile: `plop-templates/injectable-index.ts.hbs`,
      // If index.ts already exists in this location, skip this action
      skipIfExists: true,
    })

    // Adds an page-objects.ts file to the current subpackage if it does not already exist
    actions.push({
      type: 'add',
      data: data,
      path: `${currentDirectory}/page-objects.ts`,
      templateFile: `plop-templates/injectable-index.ts.hbs`,
      // If index.ts already exists in this location, skip this action
      skipIfExists: true,
    })

    // Append to the current sub package index file.
    appendIfUnique(
      actions,
      `${currentDirectory}/index.ts`,
      `export * from './${nextImport}';`,
      data,
    )

    // Append to the current sub package page-objects file.
    appendIfUnique(
      actions,
      `${currentDirectory}/page-objects.ts`,
      `export * from './${nextImport}/page-objects';`,
      data,
    )
  })

  const componentTypeFolder = makeFolderPath(src, rootDir)
  let rootImport = subPackage?.length
    ? `{{dashCase '${subPackage[0]}'}}`
    : `{{dashCase '${name}'}}`

  // Append to the root package index file.
  appendIfUnique(
    actions,
    `${componentTypeFolder}/index.ts`,
    `export * from './${rootImport}';`,
    data,
  )

  // Append to the root package page-objects file.
  appendIfUnique(
    actions,
    `${componentTypeFolder}/page-objects.ts`,
    `export * from './${rootImport}/page-objects';`,
    data,
  )

  return actions
}

module.exports = (plop) => {
  // Create generic components under either the `components/` or `pages/` folder.
  plop.setGenerator('component', {
    description: 'Create a reusable component in the "components/" folder',
    prompts: [
      {
        name: 'fullName',
        message: `What is your component name? This can include the subpackage name (ex. ${colors.green(
          'foo/bar/my-component',
        )})`,
        type: 'input',
      },
      {
        name: 'type',
        message:
          'Is this a page specific component?' +
          ' If yes, then it will be created in the page package'.green,
        type: 'confirm',
        default: false,
      },
    ],
    actions: (data) =>
      makeComponentActions('component', data.type, data.fullName, plop),
  })

  // Create Page components in the `pages/` folder.
  plop.setGenerator('page', {
    description: 'Create a page component in the "pages/" folder',
    prompts: [
      {
        name: 'fullName',
        message: 'What is your page name?',
        type: 'input',
      },
    ],
    actions: (data) => makeComponentActions('page', true, data.fullName, plop),
  })
}
