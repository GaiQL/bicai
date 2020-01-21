const fs = require('fs');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CreateHashFilePlugin = require('../plugin/create-hash-file-plugin');
const cacheGroups = require('./cacheGruops');


let createPaths = require('../paths');

module.exports = (bankId) => {

  const baseConfig = require('./webpack.config.dev')(bankId);

  let paths = createPaths(bankId);

  console.log(cacheGroups);

  return merge(baseConfig, {

    plugins: [

      new CreateHashFilePlugin()

    ],

    // optimization: {

    //   splitChunks: {
    //     chunks: 'all',
    //     name: false,
    //     // 如果name与其他chunk重合会被替换为 id；
    //     // cacheGroups
    //   },

    // }

  })

}