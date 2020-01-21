import { StoreExtends } from 'Common/Plugins/store.extends'
class signing extends StoreExtends{
    GetApiRechargeSignApply = (params) => {
        return this.apiBank.getApiRechargeSignApply(params)
    }
}

export default new signing()