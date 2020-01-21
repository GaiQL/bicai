import {observable, action, computed, runInAction} from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import {commonStore} from 'Common/pages/store'
import {session} from "Common/utils/store";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'

let arr = {
    a:1,
    b:2
}

interface CODEINFO {
    code: any,
    confirmTit: string,
    hist?: string
}
export interface IConfig {
    phoneType?:'bankCardPhone' | 'loginPhoneNum',
    sendCodeStatus?:'1'|'0',
    sendCodeTimes?:number
}
export class PgUpdateSmsCode extends StoreExtends {
    readonly Config:IConfig = {
        phoneType:'bankCardPhone', // 验证码发给谁验证码
        sendCodeStatus: '0', // 0：银行发 1：比财发（3.0）
        sendCodeTimes:60
    }

    @observable validateCodeSerialNum = '' //验证码返回的字段
    @observable data = null
    @observable yzm = ''
    @observable flag = false
    @observable timer = this.Config.sendCodeTimes
    @observable phoneNumTxt = '' // 展示的验证码
    @observable phoneNum = '' // 展示的验证码
    @observable loginPhoneNum = '' // 登录验证码
    @observable bankCardPhone = '' // 银行绑卡

    Store = commonStore
    //初始化说句
    initData = () => {
        const val: any = this.Store.query() || ''
        let phone = val[this.Config.phoneType]
        runInAction(() => {
            this.phoneNumTxt = phone && phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
            this.phoneNum = phone
            this.yzm = ''
        })
    }
    //获取到((新字段)validateCodeSerialNum
    getSendNo = async (params) => {
        try {
            const res: any = await this.apiBank.apiSendPhoneCode(params)
            runInAction(() => {
                this.timer = 60
            })
            this.resetFlag(true)
        } catch (e) {
            this.resetFlag(false)
        }
    }
    
    //获取验证码
    getSecurityCode = (onlyTimeDown?) => {
        const val: any = this.Store.query() || ''
        
        this.getSendNo({
            [this.Config.phoneType]: this.phoneNum,
            bizType: BIZ_TYPE.updateFaceYzm,
            status: this.Config.sendCodeStatus, // 0：银行发 1：比财发（3.0）
            bankCardNum: '',
            userName: '',
            userCardId: '',
            liveImg: session.get('faceDiscernImg')
        })
    }
    /**
     * 点击下一步
     */
    confirm = async () => {}

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

export default new PgUpdateSmsCode()
