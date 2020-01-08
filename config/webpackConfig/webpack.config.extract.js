const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('../plugin/mini-css-extract-plugin');
const CreateHashFilePlugin = require('../plugin/create-hash-file-plugin');

let paths = require('../paths');

module.exports = ( bankId ) => {

  const baseConfig = require('./webpack.config.common')(bankId);

  paths = paths( bankId );

  return merge(baseConfig,{

    output: {
      filename: 'static/js/[name].[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    },
    
    plugins: [

      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
      }),
      new CreateHashFilePlugin()

    ]

  })

}
