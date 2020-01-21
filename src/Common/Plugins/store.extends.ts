import { commonStore } from 'Common/pages/store'
import { apiFactory, apiVersion } from 'Common/api/bank'

export class StoreExtends {
    constructor(){
    }
    Store = commonStore
    apiVersion: apiVersion = 'v2'
    apiBank: any = apiFactory(this.apiVersion)
}
