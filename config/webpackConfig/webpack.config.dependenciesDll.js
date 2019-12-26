const path = require('path');
const webpack = require('webpack');
const packageJson = require('../package.json');

const dependencies = packageJson.dependencies;

let dependenciesVendor = {};

Object.keys( dependencies ).forEach(( name )=>{
  dependenciesVendor[name] = [name]
})
console.log( JSON.parse(JSON.stringify(dependenciesVendor)) )


let entry1 = { 
  fastclick: [ 'fastclick' ],
  mobx: [ 'mobx' ],
  mobxReact: [ 'mobx-react' ],
  rcForm: [ 'rc-form' ],
  'react': [ 'react' ],
  'reactDom': [ 'react-dom' ],
  'reactRouterDom': [ 'react-router-dom' ],
  'rmcFeedback': [ 'rmc-feedback' ] 
}

let entry2Values = Object.keys( dependencies ).map(( name )=>{
  return name;
})
let entry2 = {
  dependencies:entry2Values
}

module.exports = {
  mode: 'production',
  entry: entry2,
  output: {
    path: path.join(__dirname, '../dependenciesDll'), //放在项目的static/js目录下面
    filename: '[name].dll.js', //打包文件的名字
    library: '[name]_library', //可选 暴露出的全局变量名
    libraryTarget: 'this'
    // vendor.dll.js中暴露出的全局变量名。
    // 主要是给DllPlugin中的name使用，
    // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      context: process.cwd(),
      path: path.resolve(__dirname, '../dependenciesDll/[name]-manifest.json'), //生成上文说到清单文件，放在当前build文件下面，这个看你自己想放哪里了。
      name: '[name]_library'
    })
  ],
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  }
};
