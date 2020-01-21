import {PgOpenFlow} from "Common/pages/PgOpenFlow/store"
import { observable, runInAction } from "mobx";
import { Toast } from 'antd-mobile';
import { agreeOpenBtn } from 'Common/Plugins/recordLogInfo'

class OpenStore extends PgOpenFlow {
  @observable isAgeFlag = ''
    @observable openBankLimitDesc = ''

    initData = async () => {
        const res: any = await this.apiBank.openAnAccountAgreement()
        if (res) {
            this.AdapterData(res)
            runInAction(() => {
                this.isAgeFlag = res.openBankLimit
                this.openBankLimitDesc = res.openBankLimitDesc
            })
        }
    }

    agree = () => {
        console.log('鄂尔多斯银行=====')
        try {
            agreeOpenBtn()
        } catch (err) {}

        if (this.selectFlag) {
            if (this.pageData.noOpenAccResult) {
                this.Store.openAlert('提示', this.pageData.noOpenAccResult, [
                    { text: '确定', onPress: () => console.log(this) }
                ])
            } else if (this.isAgeFlag) {
                this.Store.openAlert('提示', this.openBankLimitDesc, [
                    { text: '确定', onPress: () => console.log(this) }
                ])
            } else {
                this.Store.Hash.history.push('/openPerfection')
            }
        } else {
            let argList = this.pageData.agreementList || [],
                msg = ''
            for (var i = 0; i < argList.length; i++) {
                msg += argList[i].agreementTitle + '、'
            }
            let argMsg = `请先同意${msg.substr(0, msg.length - 1)}`
            Toast.info(argMsg, 1);
        }
    }
}
export default new OpenStore()