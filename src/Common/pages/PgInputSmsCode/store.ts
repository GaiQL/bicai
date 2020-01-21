import { observable, action, computed, runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { commonStore } from 'Common/pages/store'
import { session } from "Common/utils/store";
import { BIZ_TYPE, INNER_CODE } from 'Common/config/params.enum'
import { openSmsSubmitBtn } from 'Common/Plugins/recordLogInfo'

interface CODEINFO {
    code: any,
    confirmTit: string,
    hist?: string
}
export interface IConfig {
    phoneType?: 'bankCardPhone' | 'loginPhoneNum',
    sendCodeStatus?: '1' | '0',
    sendCodeTimes?: number
}
export class PgInputSmsCode extends StoreExtends {
    readonly Config: IConfig = {
        phoneType: 'bankCardPhone', // 验证码发给谁验证码
        sendCodeStatus: '0', // 0：银行发 1：比财发（3.0）
        sendCodeTimes: 60
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
    @observable preBankAccountNo = '' // 确认签约短信上送标记，短信接口返回
    @observable alterTitle = '开户失败'
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
    //获取到(老字段)sendNo/(新字段)validateCodeSerialNum
    getSendNo = async (params) => {
        try {
            const res: any = await this.apiBank.apiSendPhoneCode(params)
            runInAction(() => {
                this.timer = 60
                this.validateCodeSerialNum = res.validateCodeSerialNum //新字段
                this.preBankAccountNo = res.preBankAccountNo
            })
            this.resetFlag(true)
        } catch (e) {
            switch (e.innerCode) {
                case INNER_CODE.CancelAndUpdateIdCard:
                    this.Store.openAlert(this.alterTitle, e.popMsg, [
                        { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                        {
                            text: '更新身份证', onPress: () => {
                                this.Store.Hash.history.push('/updateIdCard?openErr=' + INNER_CODE.CancelAndUpdateIdCard)
                            }
                        },
                    ])
                    break;
            }
            this.resetFlag(false)
        }
    }

    // 第一次进入 不请求验证码接口 并 让验证码倒计时
    firstGetYzm = () => {
        this.resetFlag(true)
    }

    //获取验证码
    getSecurityCode = (onlyTimeDown?) => {
        const val: any = this.Store.query() || ''
        let openSuccessData = session.get('openSuccessData') || {};
        let { identNo = '', userName = '' } = session.get('FaceDiscernData')
        this.getSendNo({
            [this.Config.phoneType]: this.phoneNum,//手机号
            reqSerial: openSuccessData.reqSerial || '', // 开户第一步返回reqSerial
            bizType: BIZ_TYPE.open,
            // bankUserId: '',
            // bankAcctNo: '',
            status: this.Config.sendCodeStatus, // 0：银行发 1：比财发（3.0）
            bankCardNum: session.get('bankInfo').bankCardNum || session.get('bankInfo').bankInfo.bankCardNum || '',
            userName: userName,
            userCardId: identNo
        })
    }
    // 开户第二步：
    sedYzm = async (params) => {
        const res: any = await this.apiBank.apiOpenAccount(params)
        session.set('openSuccessData', res)
        runInAction(() => {
            this.data = res
        })
        return res
    }
    /**
     * 点击下一步
     */
    confirm = async () => {
        this.Store.changeAlertTitle('开户失败')
        try {
            openSmsSubmitBtn()
        } catch (err) { }
        try {
            let { verifyIdentity = '', liveOrderNo = '' } = session.get('openSuccessData')
            await this.sedYzm({
                validateCodeSerialNum: this.validateCodeSerialNum, //短信验证码Token,获取调取短信接口时返回1
                validateCode: this.yzm,            // 手机收到短信验证码
                validatePhoneNum: this.phoneNum,
                verifyIdentity: verifyIdentity || '',
                preBankAccountNo: this.preBankAccountNo,
                liveOrderNo
            })
            this.Store.Hash.history.replace('/openSuccess')//页面跳转
        } catch (e) {
            console.log(e)
            this.catchAlert(e)
        }
    }
    catchAlert = (err) => {
        if (err.popType == 300 && err.innerCode && err.innerCode != INNER_CODE.SubmitOnly) {
            let { confirmTit, hist }: CODEINFO = this.Store.errCode(err.innerCode)
            console.log(hist, "hist0000")
            this.Store.openAlert('开户失败', err.popMsg, [
                { text: confirmTit, onPress: () => hist ? this.Store.Hash.history.replace(hist) : null },
            ])
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

export default new PgInputSmsCode()
