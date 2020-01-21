var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Template } = _webpack.default;
const pluginName = "chunk-loading-plugin";

class ChunkLoadingPlugin {

    constructor(){
        
        this.recomposeOnoff = false;

    }

    apply(compiler) {

        compiler.hooks.compilation.tap(pluginName, compilation => {

            compilation.mainTemplate.hooks.requireEnsure.tap(pluginName, (source, chunk, hash) => {

                const startCondition = new RegExp("start chunk loading");

                if( startCondition.test( source ) ){   //  && !this.recomposeOnoff

                    this.recomposeOnoff = true;
                    const sourceArr = source.split('\n')
                    const startIndex = sourceArr.findIndex( e => startCondition.test(e) );
                    const endIndex = sourceArr.findIndex( e => e == "\t}" );   // 97
                    let startPart = sourceArr.slice(0,startIndex);
                    let chunkLoadingPart = sourceArr.slice(startIndex,endIndex);
                    let endPart = sourceArr.slice(endIndex,sourceArr.length);

                    return Template.asString([
                        ...startPart,
                        // "let chunksArr = chunkGroupsStore[chunkId];",
                        // // "if(/Common_/.test(chunkId)){",
                        // //     Template.indent("chunksArr = chunkGroupsStore[chunkId];"),
                        // // "}",
                        // "",
                        // "chunksArr.forEach(( chunkId )=>{",
                        //     ,
                        // "})",
                        "console.log( chunkId )",
                        Template.indent([...chunkLoadingPart]),
                        ...endPart
                    ])
                    
                }

                return source;

            })

        })

    }

}

module.exports = ChunkLoadingPlugin;