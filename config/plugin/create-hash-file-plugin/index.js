const pluginName = "create-hash-file-plugin";
const fs = require('fs');

class CommonExtractPlugin {

    constructor(){

        this.hashFilePath = './common/hashFile.js';
        this.chunkGroups = './common/chunkGroupsFile.js'
        this.fileHashStore = {
            jsHash:{},
            cssHash:{}
        };
        
    }

    apply(compiler) {

        compiler.hooks.thisCompilation.tap(pluginName, compilation => {

            compilation.hooks.additionalChunkAssets.tap(pluginName, chunks => {

                chunks.forEach(( chunk )=>{ 
                    this.fileHashStore.jsHash[chunk.name] = chunk.hash.substr(0,8);
                })

            })

            compilation.chunkTemplate.hooks.renderManifest.tap(pluginName, (result, {
                chunk
            }) => {
    
                const CSSMODULE_TYPE = 'css/mini-extract';
                const renderedModules = Array.from(chunk.modulesIterable).filter(module => module.type === CSSMODULE_TYPE);
    
                if (renderedModules.length > 0) {
                    this.fileHashStore.cssHash[chunk.name] = chunk.contentHash[CSSMODULE_TYPE].substr(0,8)
                }
    
            })

        })

        compiler.hooks.afterEmit.tap(pluginName, compilation => {

            let chunkGroupsData = {};
            compilation.chunkGroups.forEach(( chunkGroup )=>{
                chunkGroupsData[chunkGroup.name] = chunkGroup.id.split('+');
            })
            let data = `var chunkGroupsStore = ${JSON.stringify(chunkGroupsData)}`;
            fs.writeFile(this.chunkGroups,data,(err)=>{
                if (err) throw err;
                console.log('chunkGroupsFile创建成功');
            })

        })

        compiler.hooks.done.tap(pluginName, stats => {

            let data = `var fileHashStore = ${JSON.stringify(this.fileHashStore)}`;
            fs.writeFile(this.hashFilePath,data,(err)=>{
                if (err) throw err;
                console.log('hashFile创建成功');
            })

        })

    }

}

module.exports = CommonExtractPlugin;