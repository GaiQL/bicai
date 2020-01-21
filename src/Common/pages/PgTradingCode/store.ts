
import { observable, action, runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends'
import help from 'Common/utils/Tool'
import { actions, tradingStatus } from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
import { commonStore } from "Common/pages/store"


class TradingCode extends StoreExtends {

    @observable prePageParam = {}// 从持有中带来的数据

    errHandle = (e, params?) => {
        if(e.popType != 300) return
        if (!e.innerCode) return
        let action = actions(e, tradingStatus.get(params.bizType * 1)[1], params)
        if(!action.has(e.innerCode)) return
        commonStore.openAlert(tradingStatus.get(params.bizType * 1)[0] + '失败', action.get(e.innerCode)[0], action.get(e.innerCode)[1])
    }

}
export default TradingCode
