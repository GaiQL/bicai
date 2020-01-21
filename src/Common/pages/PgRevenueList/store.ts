import { StoreExtends } from 'Common/Plugins/store.extends'
import { observable, runInAction } from "mobx";
import { ListView, Toast } from 'antd-mobile';
import { async } from 'q';

export class PgRevenueList extends StoreExtends {
    @observable res = []
    @observable prdIndexId = ''
    @observable startDate = ''
    @observable endDate = ''
    @observable reqSerial = ''
    // init = async () => {
    //     let res = await this.apiBank.apiIncomeList({
    //         "prdIndexId":this.prdIndexId,
    //         "startDate":this.startDate ,
    //         "endDate":this.endDate ,
    //         "reqSerial":this.reqSerial
    //     })
    //     runInAction(() => {
    //         this.res = res.retList
    //     })
    // }
    comelist = async (prdIndexId, startDate, endDate, reqSerial) => {
        let res = await this.apiBank.apiIncomeList({
            "prdIndexId": prdIndexId,
            "startDate": startDate,
            "endDate": endDate,
            "reqSerial": reqSerial
            // "prdIndexId":"1000000229",
            // "startDate":"20301129",
            // "endDate":"20351129",
            // "reqSerial":"2019061914231650871791"
        })
        console.log(res,'resssss')
        runInAction(() => {
            this.res = res
        })
    }
}

export default new PgRevenueList()
