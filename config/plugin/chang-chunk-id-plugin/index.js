const pluginName = "chang-chunk-id-plugin";

class ChangeChunkIdPlugin {

    apply(compiler) {

        compiler.hooks.thisCompilation.tap(pluginName, compilation => {

            compilation.hooks.beforeChunkIds.tap(pluginName, chunks => {
                
                chunks.forEach(( chunk )=>{
                    /*
                    
                        webpack/JavascriptModulesPlugin.js

                        const filenameTemplate = chunk.filenameTemplate || outputOptions.chunkFilename;
                    
                    */
                    if( chunk.name && /Common_/.test(chunk.name) ){
                        chunk.id = chunk.name;
                    }
                })

            })

        })
    }

}

module.exports = ChangeChunkIdPlugin;
