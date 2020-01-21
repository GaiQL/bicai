import {PgTradingDetail} from 'Common/pages/PgTradingDetail/store'
import { observable, action, autorun, runInAction } from "mobx";

class DepositDetail extends PgTradingDetail {
    @observable useTestTime = false // 是否使用测试时间数据
    @observable testTime = { // 测试时间数据
        startDate: "2030-01-01",
        endDate: "2035-12-01",
        queryType: "0",
        currentPage: "1",
        pageSize: "10"
    }
}

export default new DepositDetail()
