const merge = require('webpack-merge');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const asyncImportPluginFactory = require('../plugin/async-import-plugin');
const CommonExtractPlugin = require('../plugin/common-extract-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ChunkLoadingPlugin = require('../plugin/chunk-loading-plugin');
const CreateChunkGruopFilePlugin = require('../plugin/create-chunkGruop-file-plugin');
const createPaths = require('../paths');
const getClientEnvironment = require('../env');

module.exports = ( bankId ) => {

  const baseConfig = require('./webpack.config.dev')(bankId);
  let paths = createPaths( bankId );

    // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  const publicPath = paths.servedPath;
  // Source maps are resource heavy and can cause out of memory issue for large source files.
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // const publicUrl = publicPath.slice(0, -1);
  const publicUrl = publicPath.slice(0, -1);
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(publicUrl);

  // baseConfig.module.rules[0].oneOf.forEach(( e,i )=>{
  //   if( e.loader == "awesome-typescript-loader" ){

  //     let getCustomTransformers = e.options.getCustomTransformers();
  //     getCustomTransformers.before.unshift( asyncImportPluginFactory() );
  //     e.options.getCustomTransformers = () => ({
  //       ...getCustomTransformers
  //     })

  //   }
  // })

  return merge(baseConfig,{

    plugins:[
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: {
          // removeComments: true,
          // collapseWhitespace: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeStyleLinkTypeAttributes: true,
          // keepClosingSlash: true,
          // minifyJS: true,  
          // minifyCSS: true,
          // minifyURLs: true,
        },
        commonResourcePath:'../common'
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      // new CreateChunkGruopFilePlugin( bankId ),
      // new ChunkLoadingPlugin(),
      // new CommonExtractPlugin( baseConfig.mode )
    ]

  })

}
