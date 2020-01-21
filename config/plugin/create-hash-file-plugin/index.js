const pluginName = "create-hash-file-plugin";
const path = require("path");
const fs = require("fs");
const { createDir,readFileList } = require("../../method");
class CreateHashFilePlugin {

    constructor(){

        this.hashFilePath = '';
        this.chunkGroupsPath = '';
        this.publicName = 'public';
        this.publicPath = path.resolve(__dirname,`../../../${this.publicName}`);
        this.fileHashStore = { jsHash:{},cssHash:{} };
        
    }

    apply(compiler) {

        compiler.hooks.thisCompilation.tap(pluginName, compilation => {

            /**
             * 
             * compiler.hooks.emit  outputPath = compilation.getPath(this.outputPath);
             * mainTemplate.getAssetPath
             * mainTemplate.hooks.assetPath
             * 
            */

            compilation.mainTemplate.hooks.assetPath.tap(pluginName, (filename,data) => {
                
                this.hashFilePath = compiler.outputPath + path.sep + 'hashFile.js';
                this.chunkGroupsPath = compiler.outputPath + path.sep + 'chunkGroupsFile.js';

                createDir( compiler.outputFileSystem,compiler.outputPath );

            })

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

        // compiler.hooks.afterEmit.tap(pluginName, compilation => {

        //     let chunkGroupsData = {};
        //     compilation.chunkGroups.forEach(( chunkGroup )=>{
        //         chunkGroupsData[chunkGroup.name] = chunkGroup.id.split('+');
        //     })
        //     let data = `var chunkGroupsStore = ${JSON.stringify(chunkGroupsData)}`;
        //     compiler.outputFileSystem.writeFile(this.chunkGroupsPath,data,(err)=>{
        //         if (err) throw err;
        //         console.log( 'chunkGroupsFile创建成功' );
        //     })

        // })

        compiler.hooks.done.tap(pluginName, stats => {

            let { outputFileSystem } = compiler;

            let data = `var fileHashStore = ${JSON.stringify(this.fileHashStore)}`;
            outputFileSystem.writeFile(this.hashFilePath,data,(err)=>{
                if (err) throw err;
                console.log('hashFile创建成功');
            })

            if( compiler.options.mode == "development" ){

 
                
                let publicList = readFileList( this.publicPath );

                publicList.forEach(( itempath )=>{
                    const stat = fs.statSync(itempath);
                    let nameSplit = itempath.split(this.publicName);
                    let basename = nameSplit[nameSplit.length-1];
                    let targetPath = compiler.outputPath + basename;
                    if (stat.isDirectory()) {

                        outputFileSystem.mkdirpSync( targetPath );

                    }else{

                        let fileBuffer = fs.readFileSync(itempath);
                        if( !/\.html$/.test(basename) ) outputFileSystem.writeFileSync(targetPath, fileBuffer);
                    
                    }
                })

            }

        })

    }

}

module.exports = CreateHashFilePlugin;