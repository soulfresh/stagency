const path = require('path');
const webpack = require('webpack');
const webpackKarmaWarningsPlugin = require('./webpack-karma-warnings-plugin');

var cssLoaderOptions = {
  importLoaders: 3,
  sourceMap: true,
  modules: {
    compileType: 'module',
    exportOnlyLocals: false,
  },
};

var sassLoaderOptions = {
  sassOptions: {
    includePaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src')
    ],
  }
};

// Set the React environment to 'test'.
// This is required by babel-preset-react-app
// but does not seem to set the .env to test.
process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

module.exports = function (config) {
  const paths = {
    src: path.resolve(__dirname, 'src'),
  };

  // console.log('---- FILES:', config.testPathPattern);

  const files = [
    './src/karma-setup.js',
    // './src/setupTests.js',
    config.testPathPattern
      ? `./src/**/*${config.testPathPattern}*.test.*`
      : './src/**/*.test.*',
  ];

  config.set({
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-jasmine-html-reporter'),
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: files.map(f => ({pattern: f, watched: false})),

    // preprocess matching files before serving them to the browser
    preprocessors: files.reduce((acc, curr) => {
      acc[curr] = ['webpack', 'sourcemap'];
      return acc;
    }, {}),

    browsers: ['Chrome'],

    // This is useful if you want Karma to launch Chrome for you. However,
    // iTerm2 sometimes steals keyboard focus when it launches Chrome so I find
    // it easier to manually open the page served by Karma in my standard
    // browser by visiting the URL shown by the Karma CLI.
    // customLaunchers: {
    //   ChromeDev: {
    //     base: 'Chrome',
    //     flags: ['--user-data-dir=./.karma/config/.chrome_dev_user']
    //   }
    // },

    // Jasmine configuration
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
        failFast: false,
        timeoutInterval: 200000
      }
    },

    browserDisconnectTimeout: 200000,
    browserNoActivityTimeout: 200000,
    pingTimeout: 200000,

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      devServer: {
        hot: true,
      },
      watch: true,
      stats: {
        colors: true,
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env),
        }),
        // webpackKarmaWarningsPlugin,
      ],
      resolve: {
        alias: {
          '~': path.resolve(__dirname, 'src/'),
        }
      },
      module: {
        rules: [
          // handles graphql-tools .mjs files
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
          },

          // handles jest-message-utils importing 'graceful-fs'
          { test: /graceful-fs/, use: 'null-loader' },

          // React rules
          {
            oneOf: [
              // Process application JS with Babel.
              // The preset includes JSX, Flow, TypeScript, and some ESnext features.
              {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                // exclude: /node_modules/,
                include: paths.src,
                use: [
                  {
                    loader: 'babel-loader',
                    options: {
                      presets: ['react-app']
                    }
                  },
                  'source-map-loader',
                ]
              },
              {
                test: /\.svg$/,
                include: paths.src,
                // Load SVG as ReactComponent
                use: [
                  {
                    loader: '@svgr/webpack',
                    options: {
                      svgoConfig: {
                        plugins: {
                          prefixIds: false,
                        }
                      },
                    }
                  },
                  'url-loader'
                ],
              },
              {
                test: /\.(png|svg|jpg|gif)$/,
                include: paths.src,
                use: [
                  'file-loader'
                ]
              },
              {
                test: /\.(graphql|txt)$/i,
                include: paths.src,
                use: 'raw-loader',
              },
              // {
              //   test: /\.module.(scss|css)$/,
              //   include: paths.src,
              //   use: [
              //     "style-loader", // creates style nodes from JS strings
              //     {
              //       loader: 'css-loader', // translates CSS into CommonJS
              //       options: cssLoaderOptions
              //     },
              //     {
              //       loader: 'sass-loader',
              //       options: sassLoaderOptions,
              //     },
              //   ]
              // },
              {
                test: /(?!\.module).(scss|css)$/,
                use: [
                  "style-loader", // creates style nodes from JS strings
                  // "css-loader", // translates CSS into CommonJS
                  {
                    loader: 'css-loader', // translates CSS into CommonJS
                    options: cssLoaderOptions
                  },
                  {
                    loader: 'resolve-url-loader',
                    options: {
                      sourceMap: true,
                      root: paths.src
                    }
                  },
                  {
                    loader: 'sass-loader',
                    options: sassLoaderOptions,
                  },
                ]
              }
            ]
          }
        ]
      }
    }
  });
};
