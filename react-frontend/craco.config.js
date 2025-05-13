const path = require('path');
const fs = require('fs');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');

function readFile(filepath) {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
}

// Data to inject into the index.html file during build time.
const resource = {
  css:  { loader: readFile('src/components/loader/icon/loader.css') },
  html: { loader: readFile('src/components/loader/icon/loader.svg') },
};

// Templates used during the HtmlReplaceWebpackPlugin step
const tpl = {
  css: '<style>%s</style>',
  html: '%s',
};

/**
 * Update the given webpack config to insert the HtmlReplaceWebpackPlugin
 * before the HtmlWebpackPlugin configuration that comes with create-react-app.
 * This also makes some modifications to the HtmlWebpackPlugin configuration
 * from create-react-app.
 *
 * @param {object} config - The full webpack config
 * @return {object} The updated webpack config
 */
function addHtmlReplaceWebpackPlugin(config) {
  // Replace html contents with string or regex patterns
  const plugin = new HtmlReplaceWebpackPlugin([{
    pattern: /(<!--\s*|@@)(html|css):([\w-\/]+)(\s*-->)?/g,
    replacement: function(match, $1, type, file, $4, index, input) {
      // those formal parameters could be:
      // match: <-- css:bootstrap-->
      // type: css
      // file: bootstrap
      // Then fetch css link from some resource object
      // var url = resources['css']['bootstrap']

      var url = resource[type][file];

      // $1==='@@' <--EQ--> $4===undefined
      return $4 == undefined ? url : tpl[type].replace('%s', url);
    }
  }]);

  // If you ever find the loader stops working, it's probably because
  // create react app has stripped the html comments before our plugin
  // was able to use them. To fix that, you'll need to do something like
  // the following which turns off CRA's html comment minification.
  //
  // Modify the existing HTML plugin.
  // const existingHTMLPlugin = config.plugins[0];
  // existingHTMLPlugin.options.minify = {
  //   ...existingHTMLPlugin.options.minify,
  //   removeComments: false,
  //   // For debugging you can...
  //   // collapseWhitespace: false,
  // };

  // Add our new HTML plugin.
  config.plugins.splice(1, 0, plugin);

  return config;
}

// See more options at
// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-file
// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-helpers
module.exports = {
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src')
          ]
        }
      }
    },
  },
  webpack: {
    alias: {
      '~' : path.resolve(__dirname, 'src/'),
    },
    configure: (config) => {
      const withHTMLReplacements = addHtmlReplaceWebpackPlugin(config);

      // Something with graphql-tag (transitive dependency
      // of @apollo/client) and yarn workspaces causes compilation
      // to fail with a message about .mjs files needing to be
      // fully qualified paths. To get around this for now, we
      // will add a rule relaxing that requirement in Webpack.
      // I have no idea if this is a safe or permenant fix.
      withHTMLReplacements.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        resolve: {
          fullySpecified: false
        }
      });

      return withHTMLReplacements;
    }
  }
}
