# react-website-template

## Technologies used:

- [Create React App](https://create-react-app.dev/)
- [Craco](https://www.npmjs.com/package/@craco/craco)
  Allows customization of Create React App webpack settings without ejecting.
  In this project, customization includes an alias for referencing the root
  source folder (`~`) and a loader embedded into the index file a build time.
- [Jest](https://jestjs.io/)
  For testing
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
  Helpers for DOM testing
- [Stylelint](https://stylelint.io/)
  With CSS and SCSS configuration
- [Plop](https://plopjs.com/)
  For scaffolding components, pages and services
- [Storybook with MDX](https://storybook.js.org/docs/react/writing-docs/mdx)
  For component development and documentation.
- [jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown)
  For generating non-component docs to add to your Storybook.
- [normalize.css](https://necolas.github.io/normalize.css/)
- [SASS](https://sass-lang.com/documentation)
- [sassdoc-to-markdown](https://www.npmjs.com/package/@hidoo/sassdoc-to-markdown)
  For adding documentation from your SASS files into your Storybook.
- [Theming Tools for SASS](https://github.com/soulfresh/sass-theming)
- [SourceMap Explorer](https://www.npmjs.com/package/source-map-explorer)
  For bundle size analysis.
- [ReactRouter](https://reactrouter.com/web/guides/quick-start)
  For page routing
- [Apollo](https://www.apollographql.com/docs/react/)
  For GraphQL (if you want it)
- [@thesoulfresh/utils](https://www.npmjs.com/package/@thesoulfresh/utils)
  Utilities I use often
- [@thesoulfresh/react-tools](https://www.npmjs.com/package/@thesoulfresh/react-tools)
  Useful and ultra slim hooks and base components

## Environments

### Storybook

Component documentation can be found at https://stagency.gitlab.io/stagency-web-app/?path=/docs/design-system-theme--foregrounds

### Merge Request Environments

All merge requests in GitLab will receive a custom test environment.
The GitLab UI will have a link to your environment.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode against the staging environment.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `yarn start-mock`

Runs the app in static mode which uses mock data instead of hitting a
real server.

### `yarn start-local`

Runs the app against a locally running backend. See the README in the project root
for directions on starting the local backend.

### `yarn test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test-unit`

Run all tests that don't have the `.integration.test` extension. This is useful for skipping slow tests
for a faster development cycle.

### `yarn test-debug`

This will start tests in a debug session. Next open the Chrome DevTools and click the NodeJS icon
in the top left corner. This will open a debugger connected to the tests. You can press the play
button to start the tests. To break in a specific test, add a `debugger;` statement where you want
the debugger to pause.

### `yarn test-browser --testPathPattern={SOME_TEST_PATTERN}`

Run a specific test in Chrome. This is helpful during debugging to see the DOM output.
The test name pattern needs to be the name of a test file without the `.test.jsx` extensions
(ex: use `--testPathPattern=Expenses` to run the `Expenses.test.jsx` file).

### `yarn coverage`

Generate a test coverage report locally.

### `yarn generate`

Generate new components in the `src/` directory. This will create the component
using the templates defined in `scripts/plop-templates/`. This generator will
guide you through the process of generating the new component.

For more information, see https://plopjs.com/documentation/#bypassing-prompts

### `yarn storybook`

Run the Storybook locally.

See https://storybook.js.org/

### `yarn analyze`

Analyze and visualize the size of your app bundle size.

### `yarn lint`

Lint all files.

### `yarn lint-fix`

Autofix an lint issues that can be autofixed.

### `yarn validate`

Verify your code before pushing or releasing. This will run lint tasks,
tests and ensure the app and storybook build. This is the same task that
should be used on your CI environment.

### `yarn update-schemas`

Download the latest version of the Hasura schema from your locally running Docker.
This is important if you've made changes to the database or Hasura metadata inside
Hasura console. In that situation, you'll need to update the schema checked into the
`src` folder which is used during testing and `yarn start-mock`.

### `yarn release`

Release the app to production. This will run the tests, generate a production
build, create a version tag and the deploy your code into the production
environment.

See the `scripts/release` file to customize the release process.

### `yarn deploy-storybook`

Build and deploy the Storybook to gh-pages.

See https://github.com/storybookjs/storybook-deployer

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn clean`

Clean generated files in the working directory.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
