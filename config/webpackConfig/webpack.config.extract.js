const merge = require('webpack-merge');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const MiniCssExtractPlugin = require('../plugin/mini-css-extract-plugin');
const CreateHashFilePlugin = require('../plugin/create-hash-file-plugin')

module.exports = ( bankId ) => {

  const baseConfig = require('./webpack.config.common')(bankId);

  return merge(baseConfig,{

    output: {
      filename: '../Common/js/[name].[chunkhash:8].js',
      chunkFilename: '../Common/js/[name].[chunkhash:8].chunk.js',
    },
    
    plugins: [

      new MiniCssExtractPlugin({
        filename: '../Common/css/[name].[contenthash:8].css',
        chunkFilename: '../Common/css/[name].[contenthash:8].chunk.css'
      }),
      new CreateHashFilePlugin()

    ]

  })

}
