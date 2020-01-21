import { PgWithdraw } from 'Common/pages/PgWithdraw/store'
import { observable } from "mobx";
import { apiBank } from "315/api/bank";

class Withdraw extends PgWithdraw{
    apiBank = apiBank
    @observable isShowArrow = true
    @observable needMsgCode = true
  }
  export default new Withdraw()
