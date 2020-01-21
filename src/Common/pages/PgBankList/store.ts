
import { observable, action, runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'

export class BankList extends StoreExtends{
    @observable result = {}
     initData = async () => {
        const res = await this.apiBank.apiSupportBankCards({})
        if (res) {
            runInAction(()=>{
                this.result = res
            })
        }
    }
}
export default new BankList()