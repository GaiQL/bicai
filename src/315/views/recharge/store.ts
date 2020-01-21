import {PgRecharge} from 'Common/pages/PgRecharge/store'
import {apiBank} from "315/api/bank";
import help from 'Common/utils/Tool'
import {commonStore} from 'Common/pages/store'
import { observable, action, autorun, runInAction } from "mobx";


class Recharge extends PgRecharge{
    apiBank = apiBank
    @observable needMsgCode = true
}

export default new Recharge()