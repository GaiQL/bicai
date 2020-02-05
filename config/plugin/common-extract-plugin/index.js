var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Template } = _webpack.default;
const pluginName = "common-extract-plugin";
const { pathSwitch } = require("../../method");
const path = require('path');

class CommonExtractPlugin {

    constructor( mode ){
        
        switch ( mode ) {
            case "development":
                this.baseUrl = "http://localhost:3000/common/";
                this.productionOnoff = false;
                this.commonRegExp = new RegExp('Common_');
                break;
            case "production":
                this.baseUrl = "";
                this.productionOnoff = true;
                this.commonRegExp = new RegExp('Common_');
                break;
            default:break;
        }

    }

    apply(compiler) {

        let { commonRegExp } = this;

        compiler.hooks.compilation.tap(pluginName, compilation => {

            // compilation.hooks.beforeModuleAssets.tap(pluginName,()=>{
            //     // compilation.modules = compilation.modules.filter( module => !commonRegExp.test( module.name ) );
            //     compilation.modules = compilation.modules.filter(( module )=>{

            //         let _path = pathSwitch( module.context );
            //         return !new RegExp('Common').test( _path )

            //     });
            // })

            compilation.hooks.beforeChunkAssets.tap(pluginName,()=>{
                /**
                 * 
                 * store需要初始化时就进行加载，删除了Common_Store,html中不会进行加载；
                 * htmlassetpathplugin不在是修改路径，而是添加路径；
                 * 
                 */
                compilation.chunks = compilation.chunks.filter( chunk => !commonRegExp.test( chunk.name ) );
            })

            compilation.chunkTemplate.hooks.renderManifest.tap(pluginName, (result, {
                chunk
            }) => {

                // compilation.chunks = compilation.chunks.filter( chunk => !commonRegExp.test( chunk.name ) );
                // compilation.chunks = compilation.chunks.filter( ( chunk ) => {
                //     console.log( chunk.name );
                //     console.log( !commonRegExp.test( chunk.name ) );
                //     return !commonRegExp.test( chunk.name )
                // } );

                // console.log( compilation.chunks );

            })

            /**
             *  webpack/web/JsonpMainTemplatePlugin.js
             * 
             *  mainTemplate.hooks.requireEnsure 中会触发 hooks.jsonpScript
             * 
             *  mainTemplate.hooks.jsonpScript.tap -> "script.src = jsonpScriptSrc(chunkId);",
             *  
             *  compiler.hooks.thisCompilation
             *  mainTemplate.hooks.localVars.tap  中定义了  jsonpScriptSrc函数
             *  
             *  jsonpScriptSrc(){ return ... + getScriptSrcPath(); }
            */
            compilation.mainTemplate.hooks.localVars.tap(pluginName,( source )=>{

                const functionName = new RegExp("jsonpScriptSrc");
                const changSign = "// customJsonpScriptSrc" 

                if( new RegExp(changSign).test( source ) ) return source;

                if( functionName.test( source ) ){

                    let sourceArr = source.split('\n');
                    let index = (sourceArr|| []).findIndex((source) => functionName.test(source)) + 1;
                    let footSoure = sourceArr.slice(index,sourceArr.length);
                    let linkHrefPathArr = footSoure[0].split('+');
                    /**
                        development:  
                    
                            0:"\treturn __webpack_require__.p "
                            1:" "static/js/" "
                            2:" ({}[chunkId]||chunkId) "
                            3:" ".chunk.js""

                        production:

                            0:"\treturn __webpack_require__.p "
                            1:" "static/js/" "
                            2:" ({}[chunkId]||chunkId) "
                            3:" "." "
                            4:" {"1":"05936921"}[chunkId] "
                            5:" ".chunk.js""  
                    */
                    let chunkNamePart = linkHrefPathArr[2]
                    const jsChunkNameStore = chunkNamePart.substr( chunkNamePart.indexOf('{'),chunkNamePart.indexOf('}')-1 );
                    linkHrefPathArr[0] = `return (commonJsChunkOnoff?'${this.baseUrl}':${linkHrefPathArr[0].split('return')[1]})`
                    linkHrefPathArr[2] = `currenJsChunkName`;
                    if( compiler.options.mode == "production" ){ linkHrefPathArr[4] = `currenJsChunkHash`; }
                    footSoure[0] = linkHrefPathArr.join('+');

                    return Template.asString([
                        ...sourceArr.slice(0,index), 
                        `${changSign};`,
                        `var jsChunkNameStore = ${ jsChunkNameStore };`,
                        `var currenJsChunkName = (jsChunkNameStore[chunkId]||chunkId);`,
                        `var commonJsChunkOnoff = ${commonRegExp.toString()}.test(currenJsChunkName);`,
                        `var currenJsChunkHash = (fileHashStore.jsHash[chunkId]||chunkId);`,
                        ...footSoure
                    ]);

                }

                return source

            })

            // 修改 mini-css-extract-plugin

            compilation.mainTemplate.hooks.requireEnsure.tap(pluginName, (source, chunk, hash) => {

                // 没有css模块需要处理时，source不会添加Loading css;
                if( !/mini-css-extract-plugin/.test(source) ){ return source };

                let sourceArr = source.split('\n');
                let hrefIndex = sourceArr.findIndex( e => /var href/.test(e) );
                let hrefValue = sourceArr[hrefIndex];

                let linkHrefPathArr = hrefValue.split('+');
                let chunkNamePart = linkHrefPathArr[1]
                const cssChunkNameStore = chunkNamePart.substr( chunkNamePart.indexOf('{'),chunkNamePart.indexOf('}')-1 );
                linkHrefPathArr[1] = `currenCssChunkName`;
                if( compiler.options.mode == "production" ) linkHrefPathArr[3] = `currenCssChunkHash`;

                sourceArr[hrefIndex] = linkHrefPathArr.join('+');
                // fullhref
                sourceArr[hrefIndex+1] = `var fullhref = (${commonRegExp.toString()}.test(currenCssChunkName)?'${this.baseUrl}':${compilation.mainTemplate.requireFn}.p) + href;`

                let pluginIndex = sourceArr.findIndex( e => /mini-css-extract-plugin/.test(e) );

                sourceArr.splice( pluginIndex + 1, 0,
                    `var cssChunkNameStore = ${cssChunkNameStore};`,
                    `var currenCssChunkName = (cssChunkNameStore[chunkId]||chunkId);`,
                    `var currenCssChunkHash = (fileHashStore.cssHash[chunkId]||chunkId);`
                );

                return Template.asString([...sourceArr]);

            })

        })

    }

}

module.exports = CommonExtractPlugin;
