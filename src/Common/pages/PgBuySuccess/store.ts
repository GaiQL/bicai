import {StoreExtends} from 'Common/Plugins/store.extends'
import {commonStore} from "Common/pages/store"
import {session} from 'Common/utils/store'
import {Native} from "Common/utils/appBridge"
import {Toast} from "antd-mobile";
import {logBuySuccessLookMyAsset} from 'Common/Plugins/recordLogInfo'

export class PgBuySuccess extends StoreExtends{
    query = commonStore.query()
    lookAssets = () => {
        try{
            logBuySuccessLookMyAsset()
        } catch(err) {}
        let flag: boolean = session.get('comBuyParams') ? (session.get('comBuyParams').groupPrdFlag == '1' ? false : true) : true
        if (!flag) {
            Native.closeWebView()
            return
        } else {
            commonStore.Hash.history.replace(`/bankDetail`)
        }
    }
    complete = async () => {
        try{
            logBuySuccessLookMyAsset('购买完成')
        } catch(err) {}
        const params: any = commonStore.query()
        // 判断是否为组合购买进入【平衡购买】

        let flag: boolean = session.get('comBuyParams') ? (session.get('comBuyParams').groupPrdFlag == '1' ? false : true) : true
        if (!flag) {
            Native.closeWebView()
            return
        } else {
            if (session.get('isAddBuy') == '1' && Native.isApp()) { // 说明应该时从app直接跳转来的
                try {
                    await Native.goChiC({
                        prdTypeId: params.prdType, depositTypeId: params.depositTypeId, pId: session.get('proId')
                    })
                } catch (e) {
                    Toast.info(e)
                }
            } else {
                commonStore.Hash.history.replace(`/holdProductList?prdType=${params.prdType}&depositTypeId=${params.depositTypeId}&prdTypeName=${params.prdTypeName}&toCancelPageType=500`) // 传参数
            }
        }
        


    }

}

export default new PgBuySuccess()