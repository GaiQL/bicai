import { Base64 } from "js-base64";
declare var window: any;
var u = navigator.userAgent;
export const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
export const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

interface goToOtherWebParamsInterface {
    common:Record<string,any>,
    type:string,
    params?:Object,
    closeState?:"0" | "1", // 0不关闭当前webview,1关闭webviwe；
}
export default {
    /**
     *  打开比财h5页面，
     */
    goToOtherWeb(options){
        let {common,type,params,closeState="0"} = options
        if (isAndroid) {
            try {
                if (window.native) {
                    // apiGoToOtherWeb
                    window.native.apiGoToOtherWebCommon(closeState,JSON.stringify(common),type,JSON.stringify(params))
                    return Promise.resolve('isAndroid')
                } else {
                    return Promise.reject("error isAndroid window.native")
                }
            }catch (e) {
                return Promise.reject("error isAndroid window.native>>>" + e)
            }
        } else if (isIOS) {
            try {
                if (window.webkit) {
                    window.webkit.messageHandlers.apiGoToOtherWeb.postMessage({
                        type,
                        orgId:common.orgId,
                        params,
                        common:{
                            closeState :closeState, // 0不关闭当前webview,1关闭webviwe；
                            ...common
                        }

                    })
                    return Promise.resolve('ios')
                } else {
                    return Promise.reject("error isIOS window.webkit")
                }
            } catch (e) {
                return Promise.reject('error isIOS window.webkit>>>' + e)
            }
        } else {
            return Promise.reject('')
        }
    },


    /**
     * 跳转组合购买资产持仓页
     * @param
     */
    goCombinationDetails({groupTradeProductId}){
        if(isAndroid){
            // 组合购买安卓需要改变导航颜色为蓝色
            window.native.setNavBarCorlor('#508CEE')
        }
        return this.goToOtherWeb({
            type:'combinationDetails',
            params:{
                groupTradeProductId:groupTradeProductId
            },
            common:{
                orgId: '-2', // 机构id
            }
        })
    },

}
