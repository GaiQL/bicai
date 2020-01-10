const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CreateHashFilePlugin = require('../plugin/create-hash-file-plugin');
const { pathSwitch } = require("../method");

let commonFiles = [];

const readFileList = (dir) => {

  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {

        // pages 中的文件  支拆出store
        if (/^Pg/.test(item)) {
          let name = pathSwitch( fullPath );
          commonFiles.push({
            name: name + '_common',
            test: module => new RegExp(  name + '_store' ).test( module.id )
          });
          return;
        }
        readFileList(path.join(dir, item));

    } else {

        let name = pathSwitch( fullPath );
        if (name.split('_')[1] == 'index') return;
        commonFiles.push({
          name,
          test: (module) => {
            let regExp = new RegExp( name );
            return regExp.test(module.id);
          }
        });

    }
  });

}

readFileList(path.resolve(__dirname, '../../src/Common'));

let cacheGroups = {};
commonFiles.forEach((item) => {
  let {
    name,
    test
  } = item;
  cacheGroups[item.name] = {
    name,
    test,
    minSize: 0,
    minChunks: 1,
    priority: 0
  }
})

let paths = require('../paths');

module.exports = (bankId) => {

  const baseConfig = require('./webpack.config.common')(bankId);

  paths = paths(bankId);

  console.log(cacheGroups);

  return merge(baseConfig, {

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

    ],

    optimization: {

      splitChunks: {
        chunks: 'all',
        name: false,
        // 如果name与其他chunk重合会被替换为 id；
        cacheGroups
      },

    }

  })

}