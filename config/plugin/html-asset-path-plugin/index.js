const pluginName = "html-asset-path-plugin";
const getHtmlWebpackPluginHooks = require('html-webpack-plugin/lib/hooks.js').getHtmlWebpackPluginHooks;

class HtmlAssetPathPlugin {

    apply(compiler) {

        compiler.hooks.afterCompile.tap( pluginName,compilation => {

            getHtmlWebpackPluginHooks( compilation ).alterAssetTags.tapPromise(pluginName,( asset )=>{
                console.log( asset.assetTags.scripts );
                asset.assetTags.scripts.forEach( assetTag => {
                    if( /Common_/.test(assetTag.attributes.src) ){
                        let arr = assetTag.attributes.src.split('/');
                        assetTag.attributes.src = '/common/static/js/'+ arr[arr.length-1];
                    }
                })
                return Promise.resolve( asset );
            })

        })

    }

}

module.exports = HtmlAssetPathPlugin;