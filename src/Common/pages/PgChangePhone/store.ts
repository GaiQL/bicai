import { observable, runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { commonStore } from 'Common/pages/store'
import { session } from "Common/utils/store";

export class PgChangePhone extends StoreExtends {
    @observable name = ''
    @observable oldPhone = ''
    @observable newPhone = ''
    @observable idCard = ""
    @observable phoneType: 'bankCardPhone' | 'loginPhoneNum' = 'loginPhoneNum' // 短信验证码发送类型
    Config = {
        status: 1 // 短信类型。如需要发送验证码 和 验证码保持一致
    }
    //配置项
    verificationCodeOnoff = true;  // 是否发送验证码
    showNote = true;

    Store = commonStore
    changeAccountMobile = async (params) => {
        const res = await this.apiBank.changeAccountMobile(params)
        return Promise.resolve(res)
    }
    changePhoneCheck = async (params) => {
        const res = await this.apiBank.changeBindCardPhoneCheck(params)
        return Promise.resolve(res)
    }
    //初始化
    initData = async (bandCardInfo) => {
        runInAction(() => {
            this.name = bandCardInfo.realName
            this.oldPhone = bandCardInfo.bankCardPhone
            this.newPhone = '';
            this.idCard = '';
        })
    }
    //获取名字
    handelName = async (el) => {
        runInAction(() => {
            this.name = el
        })
    }
    //获取老手机号
    handelOldPhone = async (el) => {
        runInAction(() => {
            this.oldPhone = el
        })
    }
    //获取身份证
    handelIdCard = async (el) => {
        runInAction(() => {
            this.idCard = el
        })
    }
    //获取新手机号
    handelNewPhone = async (el) => {
        runInAction(() => {
            this.newPhone = el
        })
    }
    //下一步
    next = async () => {

        let { name, oldPhone, newPhone, idCard } = this
        try {
            await this.changePhoneCheck({
                oldTelPhone: oldPhone,
                newTelPhone: newPhone,
                realName: name,
                userCardId: idCard,
                status: 1
            })
            // 'bankCardPhone'|'loginPhoneNum'
            let queryData = {
                name, phone: newPhone, oldPhone, newPhone, idCard,
            }

            if (this.verificationCodeOnoff) {
                commonStore.Hash.history.push('/serviceInputSmsCode?page=changePhone&queryData=' + JSON.stringify(queryData))
            } else {
                this.changePhone(queryData)
            }
        } catch (e) { }
    }

    // 更换手机号
    changePhone = async (queryData) => {
        let { oldPhone, newPhone, name, idCardNo }: any = queryData
        console.log(queryData)
        try {
            await this.apiBank.changeBindCardPhone({
                oldTelPhone: oldPhone,
                newTelPhone: newPhone,
                validateCodeSerialNum: queryData.validateCodeSerialNum,
                validateCode: queryData.yzm,
                bizType: 1,
                status: this.Config.status,
                realName: name,
                preBankAccountNo: session.get("reqSerial").preBankAccountNo,
                bankCardNo: session.get("moreServer").bankCardNum

            })
            commonStore.Hash.history.replace('/moreService')
        } catch (e) {
            // Toast.info(e.popMsg)
        }
        runInAction(() => {
            this.newPhone = '',
                this.idCard = ''
        })
    }
}
export default new PgChangePhone()
