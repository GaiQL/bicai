var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Template } = _webpack.default;
const pluginName = "common-extract-plugin";

class CommonExtractPlugin {

    apply(compiler) {

        compiler.hooks.compilation.tap(pluginName, compilation => {

            compilation.chunkTemplate.hooks.renderManifest.tap(pluginName, (result, {
                chunk
            }) => {

                compilation.chunks = compilation.chunks.filter( chunk => !/Common/.test( chunk.name ) );

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
                    let chunkNamePart = linkHrefPathArr[2]
                    const jsChunkNameStore = chunkNamePart.substr( chunkNamePart.indexOf('{'),chunkNamePart.indexOf('}')-1 );
                    linkHrefPathArr[1] = `(/Common_/.test(currenJsChunkName)?"../Common/static/js/":"static/js/")`;
                    linkHrefPathArr[2] = `currenJsChunkName`;
                    linkHrefPathArr[4] = `currenJsChunkHash`;
                    footSoure[0] = linkHrefPathArr.join('+');

                    return Template.asString([
                        ...sourceArr.slice(0,index), 
                        `${changSign};`,
                        `var jsChunkNameStore = ${ jsChunkNameStore };`,
                        `var currenJsChunkName = (jsChunkNameStore[chunkId]||chunkId);`,
                        `var currenJsChunkHash = (fileHashStore.jsHash[chunkId]||chunkId);`,
                        ...footSoure
                    ]);

                }

                return source

            })

            // 修改 mini-css-extract-plugin

            compilation.mainTemplate.hooks.requireEnsure.tap(pluginName, (source, chunk, hash) => {

                let sourceArr = source.split('\n');
                let hrefIndex = sourceArr.findIndex( e => /var href/.test(e) );
                let hrefValue = sourceArr[hrefIndex];

                let linkHrefPathArr = hrefValue.split('+');
                let chunkNamePart = linkHrefPathArr[1]
                const cssChunkNameStore = chunkNamePart.substr( chunkNamePart.indexOf('{'),chunkNamePart.indexOf('}')-1 );
                let variablePart = linkHrefPathArr[0].split('=');
                variablePart[1] = `(/Common_/.test(currenCssChunkName)?"../Common/static/css/":"static/css/")`;
                linkHrefPathArr[0] = variablePart.join('=');
                linkHrefPathArr[1] = `currenCssChunkName`;
                linkHrefPathArr[3] = `currenCssChunkHash`;

                sourceArr[hrefIndex] = linkHrefPathArr.join('+');

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
