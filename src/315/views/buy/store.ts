import {PgBuy} from 'Common/pages/PgBuy/store'
import { observable, action, autorun, runInAction } from "mobx";
import {apiBank} from "../../api/bank";
import {Toast } from 'antd-mobile';
import help from 'Common/utils/Tool'
import { session } from "Common/utils/store";
import { tradingStatus } from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
import { PgTradingCode } from "Common/pages/store"
const { errHandle } = new PgTradingCode();

class Buy extends PgBuy {
    apiBank = apiBank

    @observable buyMax = Infinity // 无限制

    @observable needMsgCode = true
    @observable whetherNeedMsg = true // 购买调起收银台充值是否需要验证码
    @observable status = 0  // 0：银行发 1：比财发（3.0）

}
export default new Buy()