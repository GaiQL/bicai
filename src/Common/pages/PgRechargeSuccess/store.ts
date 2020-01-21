
import { observable, action, runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import help from 'Common/utils/Tool'
import { commonStore } from "Common/pages/store"

import goBC from 'Common/utils/goBC'
import {session} from 'Common/utils/store'
import {Native} from "Common/utils/appBridge"
import { Toast } from 'antd-mobile';//ui组件


export class RechargeSuccess extends StoreExtends{
    sub(){
        commonStore.Hash.history.replace("/bankDetail")
    }
    async goBackProductList() {
        if ( Native.isApp()) { // 说明应该时从app直接跳转来的
            try {
                await Native.goBankList({
                    data: {routeKey:'bankProductList',orgId:require('Common/config/index').ORG_ID,orgName:require('Common/config/index').ORG_NAME}
                },false)   //银行列表
              //  await Native.closeWebView()
            } catch (e) {
                Toast.info(e)
            }
        } else {
            goBC({
                name: 'ProductList',
                type: 'push',
                params: {
                    CHANNEL_ID: session.get('channelId')
                }
            })
        }

    }
}
export default new RechargeSuccess()