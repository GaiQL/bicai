declare var window
import { Native, isIOS, isAndroid } from "Common/utils/appBridge"
// 暂时添加
export const HeaderAppBrige = {
    androidSetHeader() {
        // if (window.native && window.native.setHeaderTitleCor) {
        //     window.native.setHeaderTitleCor("#000000") // 设置字体颜色
        // }
        if (window.native && window.native.setHeaderLeftRes && window.native.setHeaderRightRes) {
            console.log('setHeaderLeftRes');
            window.native.setHeaderLeftRes("0", "") //
            window.native.setHeaderRightRes("0", "")
            return Promise.resolve('leftOptions')
        } else {
            console.log("error 12222 window.native.setHeaderLeftRes( )")
            return Promise.reject('')
        }

    },
    /**
     *
     * @param style 0:none  1:back左返回  2:close有关闭 3：empty 左右都是空  4:自定义的 不配置1+2
     */
    apiNavBarStyleClose(style) {
        // ['none', '0'], ['back', '1'],['close', '2'], ['empty', '3'],[4]
        if (isAndroid) {
            if (window.native) {
                try {
                    window.native.apiNavBarStyleClose(style || 2);
                    this.androidSetHeader()
                } catch (err) {
                    console.log("error 12 window.native.apiNavBarStyleClose( )", err)
                }
            } else {
                console.log("error 2 window.native.nnnnnnnnn( )")
            }
        } else if (isIOS) {
            if (window.webkit) {
                let isIOS = style==='4'?{
                    rightConfig: {
                        isDefault: '0',
                        image: ""
                        // image:''
                    },
                    leftConfig: {
                        isDefault: '0',
                        image: ""
                    },
                    color: '0',
                }:{}
                try {
                    window.webkit.messageHandlers.apiNavBarStyle.postMessage(
                        {
                            style: style || '4',...isIOS
                        }
                    )
                } catch (err) {
                    console.log("error window.webkit.messageHandlers.apiNavBarStyle.postMessage( )")
                }
            } else {
                console.log("error window.webkit( )")
            }
        }
    },
}
