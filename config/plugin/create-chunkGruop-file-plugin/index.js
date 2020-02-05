const pluginName = "create-chunkGruop-file-plugin";
const path = require("path");
const fs = require("fs");
const { createDir,readFileList } = require("../../method");
const chunkGroupClass = require('webpack/lib/ChunkGroup');
class CreateChunkGruopFilePlugin {

    constructor( bankId ){

        this.hashFilePath = '';
        this.chunkGroupsPath = '';
        this.publicName = 'public';
        this.publicPath = path.resolve(__dirname,`../../../${this.publicName}`);
        this.bankPath = path.resolve(__dirname,`../../../${bankId}`);
        this.fileHashStore = { jsHash:{},cssHash:{} };
        this.bankId = bankId
        
    }

    apply(compiler) {

        compiler.hooks.thisCompilation.tap(pluginName, compilation => {
            compilation.mainTemplate.hooks.assetPath.tap(pluginName, (filename,data) => {
                this.chunkGroupsPath = compiler.outputPath + path.sep + 'chunkGroupsFile.js';
            })
            compilation.hooks.beforeChunkAssets.tap(pluginName, () => {

                // compilation.chunkGroups.forEach( chunkGroup => {
                //     if( chunkGroup.name == "main" ){
                //         chunkGroup.chunks = chunkGroup.chunks.filter( chunk => !/Common_page/.test(chunk.id) )
                //     }
                // })

            })
        })

        compiler.hooks.afterEmit.tap(pluginName, compilation => {

            let chunkGroupsData = {};
            compilation.chunkGroups.forEach(( chunkGroup )=>{

                // if( chunkGroup.name != "main" ){
                    let arr = chunkGroup.id.split('+');
                    chunkGroupsData[arr[arr.length-1]] = arr;
                // }
                
                
            })
            let data = `var chunkGroupsStore = ${JSON.stringify(chunkGroupsData)}`;
            compiler.outputFileSystem.writeFile(this.chunkGroupsPath,data,(err)=>{
                if (err) throw err;
                console.log( 'chunkGroupsFile创建成功' );
            })

        })

    }

}

module.exports = CreateChunkGruopFilePlugin;