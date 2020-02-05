const fs = require('fs');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CreateHashFilePlugin = require('../plugin/create-hash-file-plugin');

const createPaths = require('../paths');

module.exports = (bankId,type) => {

  const baseConfig = require(`./webpack.config.${type=="build"?'common':'dev'}`)(bankId);

  let paths = createPaths(bankId);

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