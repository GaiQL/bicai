import { observable } from "mobx";
import {PgRedeem} from 'Common/pages/PgRedeem/store'

class Redeem extends PgRedeem{
    @observable isEditInput = false; // 是否可以编辑input
    @observable needMsgCode = true;
    @observable hiddenRateNum = true;
    @observable tipText = '预计利息仅供参考，实际利息以银行到账为准'
}
export default new Redeem()