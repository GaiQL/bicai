
import {StoreExtends} from 'Common/Plugins/store.extends'



class Deposit extends StoreExtends{
    getHoldInfo = async (data) => {
        return await this.apiBank.apiQryHoldInfo(data)
    }
    getMyInvestOver = async (data) => {
        return await this.apiBank.getMyInvestOver(data)
    }
    apiQryEleTransDetailFn = async (data) => {
        return this.apiBank.apiQryEleTransDetail(data)
    }
    apiIsShelvesFn = async (data) => {
        return this.apiBank.apiIsShelves(data)
    }
    idCardStatusFn = async () => {
        return this.apiBank.idCardStatus()
    }
    apiRedemptionValidFn = async (data) => {
        return this.apiBank.apiRedemptionValid(data)
    }
}
export default Deposit