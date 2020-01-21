import { observable, action, runInAction } from "mobx";
import { Toast } from 'antd-mobile'
// import { local } from 'Common/utils/store'
// import { ComParams } from 'Common/config/index'
import { StoreExtends } from 'Common/Plugins/store.extends'

export class PgBankDetail extends StoreExtends {
    @observable result: any = {}
    @observable isHide = false
    initData = async () => {
        const res: any = await this.apiBank.apiQryAsset()
        if (res) {
            runInAction(() => {
                this.result = res
                this.isHide = res.visibleState == 1
            })
        }
    }
    //更新状态
    updateStatus = async (type) => {
        try {
            const res: any = await this.apiBank.bankHomeMessageStatus({ type })
            runInAction(() => {
                //his.isHide = res == 2 ? false : true
                this.isHide = res.visibleState == 1 //
            })
        } catch (e) {
            Toast.info('网络异常，请稍后再试', 3)
        }
    }

    setHide = async () => {
        // this.isHide=!this.isHide
        await this.updateStatus(2)
    }

    // 身份证状态校验
    idCardStatusFn = async () => {
        return this.apiBank.idCardStatus()
    }

    // 充值提现校验
    apiTradeCheckFn = (params) => {
        return this.apiBank.apiTradeCheck(params)
    }

}

export default new PgBankDetail()
