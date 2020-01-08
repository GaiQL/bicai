const pluginName = "chang-build-id-plugin";
const ConcatenatedModule = require("webpack/lib/optimize/ConcatenatedModule");
const NormalModule = require("webpack/lib/NormalModule");

class ChangeBuildIdPlugin {

    apply(compiler) {

        compiler.hooks.thisCompilation.tap(pluginName, compilation => {

            /**

                    finsh() -> finishModules 
                    seal() -> beforeModuleIds 
                    
                    finsh阶段finishModules可以拿到所有模块
                    finsh完成后到seal阶段beforeModuleIds前模块已经被优化过了

            */
            compilation.hooks.beforeModuleIds.tap(pluginName, modules => {
                
                modules.forEach(( module )=>{

                    let identifier = "";
                    if( module instanceof ConcatenatedModule ){
                        identifier = module.rootModule.resource;
                    }else if( module instanceof NormalModule ){
                        identifier = module.resource;
                    }

                    if( identifier ){
                        let identifierArr = identifier.split('src');
                        module.id = identifierArr[identifierArr.length - 1];
                    }

                    /**
                        ConcatenatedModule
                        _identifier : "e:\open-api-bank-all\open-api-bank-3.0-eject\node_modules\awesome-typescript-loader\dist\entry.js??ref--4-oneOf-2!e:\open-api-bank-all\open-api-bank-3.0-eject\src\Common\Pgtest\index.tsx efee892b2357ea82d35bbbd23a092ed5"

                        dependencies  array 18
                        Array(18) [
                            HarmonyCompatibilityDependency, 
                            HarmonyInitDependency, 
                            HarmonyExportHeaderDependency,
                            HarmonyExportSpecifierDependency,
                            ConstDependency
                            HarmonyExportExpressionDependency
                            HarmonyImportSideEffectDependency
                            ....
                        ]
                        
                        modules array NormalModule 3
                        "Common\utils\method.ts"
                        "Common\Pgtest\store.ts"
                        "Common\Pgtest\index.tsx" 
                     
                     */

                })

            })

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

module.exports = ChangeBuildIdPlugin;

/**

    webpack/web/JsonpMainTemplatePlugin.js

    webpackJsonpCallback

    "var chunkIds = data[0];",
    "var moreModules = data[1];",
    withDefer ? "var executeModules = data[2];" : "",
    withPrefetch ? "var prefetchChunks = data[3] || [];" : "",

    chunk.js 
    
    (window.webpackJsonp=window.webpackJsonp||[]).push([
        []  ->  chunkIds ,
        [] || {}  ->  moreModules,
        []  ->  executeModules,
        []  ->  prefetchChunks
    ])


    HarmonyImportSpecifierDependency
 */