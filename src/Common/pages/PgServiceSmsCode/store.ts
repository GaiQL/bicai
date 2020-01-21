import { observable, runInAction } from "mobx";
import { commonStore } from 'Common/pages/store'
import { StoreExtends } from 'Common/Plugins/store.extends'
import { PgChangePhone, PgChangeBank } from 'Common/pages/store'
import { BIZ_TYPE } from "Common/config/params.enum";
import { session } from "Common/utils/store";
export class PgServiceSmsCode extends StoreExtends {
    @observable page = '' // 用于判断是银行卡相关过来的还是手机号相关过来的
    @observable flag = false
    @observable queryData: any = {}
    @observable validateCodeSerialNum = ''
    @observable yzm = ''
    @observable phone = ''
    @observable status = 1
    @observable bankCardNum = ''
    bankNamePY = '';
    initData = () => {
        let { queryData, page }: any = commonStore.query()
        let query: any = queryData ? JSON.parse(queryData) : {}
        let { newPhone, phone, bankCardPhone } = query
        runInAction(() => {
            this.queryData = query
            this.page = page  // addBank changeBank changePhone
            session.set("messagePhone", (newPhone || phone))
            this.phone = newPhone || phone || bankCardPhone
            this.yzm = ''
        })
    }
    // clear yzm
    clearYzm = () => {
        runInAction(() => {
            this.yzm = ''
        })
    }


    /**
     * 获取验证码  判断验证码类型 
     */
    getSecurityCode = async (reqType?) => {
        let bizType
        let realName
        let userCardId
        if (this.page == 'changeBank') {
            bizType = BIZ_TYPE.changeBankCard
            let { oldCardInfo }: any = this.queryData
            console.log( this.queryData,"ooo")
            realName = JSON.parse(oldCardInfo).cardList.realName
            userCardId = this.queryData.userCardId

        }
        if (this.page == 'addBank') {
            bizType = BIZ_TYPE.changeBankCard

        }
        if (this.page == 'changePhone') {
            realName = this.queryData.name
            userCardId = this.queryData.idCard
            bizType = BIZ_TYPE.changePhone
        }

        this.apiSendPhoneCodeFn(bizType, realName, userCardId)
    }
    //
    /**
     * 发送验证码接口。可重写 更换手机号建议重写
     * @param bizType
     */
    async apiSendPhoneCodeFn(bizType, realName?, userCardId?) {
        let { phone, newBank, bankCardPhone, oldCardInfo}: any = this.queryData
        console.log(this.queryData,"0000oooo")
        let { bankCardNum }: any = newBank ? JSON.parse(newBank) : {}
        try {

            let res: any = await this.apiBank.apiSendPhoneCode({
                bizType,
                oldTelephone: "",
                bankCardPhone: phone || bankCardPhone || '', //手机号
                status: this.status, // 发送验证码的类型
                bankCardNum: bankCardNum,//  新增的银行卡号。
                bankNamePY: this.bankNamePY, //
                userName: realName, //姓名
                userCardId: userCardId,// 银行卡
            })
            let { validateCodeSerialNum } = res
            session.set("reqSerial", res)
            runInAction(() => {
                this.validateCodeSerialNum = validateCodeSerialNum
            })
            this.resetFlag(true)
        } catch (e) {
            console.log(e)
            this.resetFlag(false)
        }
    }
    // 可重写。
    confirm = async () => {
        runInAction(() => {
            this.queryData.validateCodeSerialNum = this.validateCodeSerialNum;
            this.queryData.yzm = this.yzm;
        })
        if (this.page == 'changeBank') {
            PgChangeBank.bankHandle(this.queryData, this.page)
        }
        if (this.page == 'addBank') {
            PgChangeBank.bankHandle(this.queryData, this.page)
        }
        if (this.page == 'changePhone') {
            PgChangePhone.changePhone(this.queryData)
        } else {

        }
    }
    changeYzm = (el) => {
        runInAction(() => {
            this.yzm = el
        })
    }
    //验证码内部倒计时为0的时候重置父组件传入的验证码倒计时状态
    resetFlag = (flag) => {
        runInAction(() => {
            this.flag = flag
        })
    }
    //在一次发送验证码
    againGetYzm = (callback?) => {
        //判断接口验证码标识发送成功执行
        if (this.flag) {
            callback();
        }
        this.getSecurityCode()
    }
}
export default new PgServiceSmsCode()
