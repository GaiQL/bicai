
import { observable, action, runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import help from 'Common/utils/Tool'
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'
import { Native } from "Common/utils/appBridge"
import { Toast } from 'antd-mobile';
import { WithdrawSuccessBtn } from 'Common/Plugins/recordLogInfo'

export class RedeemSuccess extends StoreExtends{
        async complate() {
        const params:any = commonStore.query()
        try {
            WithdrawSuccessBtn(params.prdIndexId)
        } catch(err) {}
        if (session.get('appToReed') == '1' && Native.isApp()) { // 说明应该时从app直接跳转来的
            try {
                await Native.closeWebView()
            } catch (e) {
                Toast.info(e)
            }
        } else {
            // if(session.get('backUrl')){
                // let backUrl=session.get('backUrl')
            commonStore.Hash.history.replace(`/holdProductList?depositTypeId=${params.depositTypeId}&prdType=${params.prdType}&prdTypeName=${params.prdTypeName}`)
            // }
        }
    }
    
}
export default new RedeemSuccess()