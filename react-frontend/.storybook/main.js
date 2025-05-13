const path = require('path');
const cracoConfig = require('../craco.config');

const package = (p = '') => `../src/${p ? p + '/' : ''}**/*.stories.@(js|jsx|ts|tsx|mdx)`;

module.exports = {
  staticDirs: ['../public'],
  stories: [
    package('components'),
    package('pages'),
    package('test'),
    // Anything else
    package(),
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  refs: {
    'react-tools': {
      title: 'React Tools Lib',
      url: 'https://soulfresh.github.io/react-tools',
    },
    'design-system': {
      title: "SASS Theming Lib",
      url: "https://soulfresh.github.io/sass-theming"
    }
  },
  webpackFinal(baseConfig, options) {
    const config = {
      ...baseConfig,
      module: {
        ...(baseConfig.module ?? {}),
        rules: [...(baseConfig.module?.rules ?? [])],
      },
      resolve: {
        ...(baseConfig.resolve ?? {}),
        alias: {
          ...(baseConfig.alias ?? {}),
          ...cracoConfig.webpack.alias,
        },
      },
    };

    if (options.configType === 'DEVELOPMENT') {
      config.module.rules.push({
        test: /,css&/,
        use: [
          {
            loader: 'postcss-loader',
            ident: 'postcss',
            options: {
              plugins: [],
              verbose: true,
            },
          },
        ],
        include: path.resolve(__dirname, '../'),
      });
    }

    return config;
  },
};

