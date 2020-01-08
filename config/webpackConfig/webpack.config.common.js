'use strict';

const MiniCssExtractPlugin = require('../plugin/mini-css-extract-plugin');
const ChangeBuildIdPlugin = require('../plugin/chang-build-id-plugin');
const asyncImportPluginFactory = require('../plugin/async-import-plugin');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const getClientEnvironment = require('../env');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const rootDir = path.dirname(__dirname);
const Config = require('../index');
const fs = require('fs');
let paths = require('../paths');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

let dependenciesDllArr = fs.readdirSync('./dependenciesDll')
.filter( e => /manifest.json$/.test(e) )
.map( (e) => { return { manifest:path.resolve(__dirname, `../../dependenciesDll/${e}`) } } );


// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = ( bankId ) => {
  
  paths = paths( bankId );

  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  const publicPath = paths.servedPath;
  // Source maps are resource heavy and can cause out of memory issue for large source files.
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  const publicUrl = publicPath.slice(0, -1);
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(publicUrl);

  // Assert this just to be safe.
  // Development builds of React are slow and not intended for production.
  if (env.stringified['process.env'].NODE_ENV !== '"production"') {
    throw new Error('Production builds must have NODE_ENV=production.');
  }

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      MiniCssExtractPlugin.loader,
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ],
          sourceMap: shouldUseSourceMap,
        },
      },
    ];
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: shouldUseSourceMap,
        },
      });
    }
    return loaders;
  };

  return {
    mode: 'production',
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: false,
    // In production, we only want to load the app code.
    entry: [`${paths.appSrc}/index.js`],
    output: {
      path: paths.appBuild,
      // Generated JS file names (with nested folders).
      // There will be one main bundle, and one file per asynchronous chunk.
      // We don't currently advertise code splitting but Webpack supports it.
      // filename: 'static/js/[name].[chunkhash:8].js',
      // chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: publicPath,
      libraryTarget: 'umd',
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info =>
        path
          .relative(paths.appSrc, info.absoluteResourcePath)
          .replace(/\\/g, '/'),
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: shouldUseSourceMap,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: { parser: safePostCssParser },
        }),
      ],
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: 'all',
        name: false,
        // cacheGroups:{
        //   vendor: {
        //     name: "store",
        //     test: /[\\/]Common[\\/]Pgtest[\\/]store/,
        //     chunks: "all",
        //     minSize:0,
        //     minChunks:1,
        //     priority: 10
        //   }
        // }
      },
      // Keep the runtime chunk seperated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    resolve: {
      // This allows you to set a fallback for where Webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules'].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
      alias: {
        
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        "Common": path.resolve(rootDir, 'src', 'Common'),
        "src": path.resolve(rootDir, 'src'),
        "public": path.resolve(rootDir, 'public'),
        "scripts": path.resolve(rootDir, 'scripts'),
        ...Config.aliasConfig
      },
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new TsconfigPathsPlugin({
          configFile: paths.appTsConfig
        })
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [{
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]'
            },
          },
          {
            test: /\.js$/,
            include: paths.jsInclude,
            exclude: paths.jsExclude,
            use: [
                'cache-loader',
                {
                    loader: "babel-loader",
                    options: {
                        inputSourceMap: false,
                        sourceMap: false,
                        // compact: true,
                        presets: ['@babel/preset-env']
                    }
                }
            ],
          },
          {
            test: /\.(tsx|ts|js|jsx)$/,
            include: paths.src,   
            loader: 'awesome-typescript-loader',
            options: {
                useCache: true,
                transpileOnly: true,
                errorsAsWarnings: true,
                // usePrecompiledFiles: true,
                sourceMap: false,
                getCustomTransformers: ( program ) => ({
                  before: [ 
                    tsImportPluginFactory({ libraryName: 'antd-mobile', style: 'css' })
                  ]
                })
            }
          },
          {
            test: /\.(scss|css)$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../../'
                }
              },
              {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    sourceMap: false,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  sourceMap: false,
                  plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      require('autoprefixer')
                  ],
                },
              },
              {
                loader: 'sass-loader',
                options: {
                    sourceMap: false,
                    javascriptEnabled: true,
                },
              }
            ],
         },
         {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: 'file-loader',
            options: {
                name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      }]
    },
    plugins: [
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV was set to production here.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env.stringified),
      // Generate a manifest file which contains a mapping of all asset filenames
      // to their corresponding output file so that tools can pick it up without
      // having to parse `index.html`.
      // new ManifestPlugin({ 
      //   fileName: 'asset-manifest.json',
      //   publicPath: publicPath,
      // }),
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the Webpack build.
      // new SWPrecacheWebpackPlugin({
      //   // By default, a cache-busting query parameter is appended to requests
      //   // used to populate the caches, to ensure the responses are fresh.
      //   // If a URL is already hashed by Webpack, then there is no concern
      //   // about it being stale, and the cache-busting can be skipped.
      //   dontCacheBustUrlsMatching: /\.\w{8}\./,
      //   filename: 'service-worker.js',
      //   logger(message) {
      //     if (message.indexOf('Total precache size is') === 0) {
      //       // This message occurs for every build and is a bit too noisy.
      //       return;
      //     }
      //     if (message.indexOf('Skipping static resource') === 0) {
      //       // This message obscures real errors so we ignore it.
      //       // https://github.com/facebook/create-react-app/issues/2612
      //       return;
      //     }
      //     console.log(message);
      //   },
      //   minify: true,
      //   // For unknown URLs, fallback to the index page
      //   navigateFallback: publicUrl + '/index.html',
      //   // Ignores URLs starting from /__ (useful for Firebase):
      //   // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      //   navigateFallbackWhitelist: [/^(?!\/__).*/],
      //   // Don't precache sourcemaps (they're large) and build asset manifest:
      //   staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      //   // Disabling skipWaiting ensures better compatibility with web apps that
      //   // use deferred or lazy-loading, at the expense of "keeping around" the
      //   // previously cached version of your web app until all open instances have
      //   // been closed.
      //   // See https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#skip_the_waiting_phase
      //   skipWaiting: false,
      // }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ChangeBuildIdPlugin(),
      // new webpack.DllReferencePlugin(
      //   ...dependenciesDllArr
      // ),
      // new AddAssetHtmlWebpackPlugin([
      //   ...(
      //     fs.readdirSync('./dependenciesDll')
      //     .filter( e => /.js$/.test(e) )
      //     .map( (e) => { return { filepath:path.resolve(__dirname, `../../dependenciesDll/${e}`) } } )
      //   )
      // ]),
      // new CommonExtractPlugin()
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false
  }
}
