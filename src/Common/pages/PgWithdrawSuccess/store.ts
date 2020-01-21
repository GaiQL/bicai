
import { observable, action, runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import help from 'Common/utils/Tool'
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'


export class WithdrawSuccess extends StoreExtends{
    // Store = commonStore
    
    complate(path) { // 此处问题需要修改
        let data: any = commonStore.query();
        let page: any = data && data.page || ''

        if (path == "recharge") {
            commonStore.Hash.history.replace('/boundBank?page=recharge')
        } else {
            let type = session.get('withdrawType')
            if (type == 'boundBank') {
                commonStore.Hash.history.replace("/boundBank?page="+page);
            } else {
                commonStore.Hash.history.replace("/bankDetail");
            }
        }
    }
    
}
export default new WithdrawSuccess()