/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 13:44:10
 * @LastEditTime: 2019-08-29 16:48:51
 * @LastEditors: Please set LastEditors
 */
import { observable, action, autorun, runInAction } from "mobx";
import help from 'Common/utils/Tool'
import { Toast, ActionSheet } from 'antd-mobile';
import { session } from "Common/utils/store";
import { publicStore, commonStore } from "Common/pages/store"
import { StoreExtends } from 'Common/Plugins/store.extends'
import { logBuyDeposit, logBuyRechargeBtn } from 'Common/Plugins/recordLogInfo'
import { TradeRequestMethod } from 'Common/pages/store'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { multiplication,Modulo } from 'Common/pages/public/calculate'

// interface buyParamsRule {
//     couponId: string,
//     couponDetailId: string,
//     teamId: string,
//     investId: string,
//     expandJson: string,
//     BUY_PARAM_KEY:any,
//     [propName: string]: any;
// }

let timer = null

export class PgBuy extends StoreExtends {

    @observable needMsgCode = true // 购买是否需要验证码
    @observable whetherNeedMsg = true // 购买调起收银台充值是否需要验证码
    @observable agreementPrdIndexId = false // 购买协议是否要传入产品id

    @observable prdIndexType = ''  // 产品类型
    @observable query:any = {}
    @observable money = null // 输入的金额
    @observable modalType = null
    @observable isRead = false // 是否同意协议
    @observable seconds = 60
    @observable btnTextTime = 3 // 充值完事之后的立即存入的倒计时时间
    @observable selectedCardInd = null // 选中银行卡的下标
    @observable proInfo: any = {} // 产品内容
    @observable bankCardInfo: any = {} // 公共接口的银行卡信息
    @observable rechargeMoney = '' // 待充值金额
    @observable codeInfo = {} // 验证码信息
    @observable agreementList = [] // 协议信息
    @observable rechargeInfo = {} // 充值返回来的信息
    @observable isShowHandleBtn = true // 是否显示添加/更换银行卡
    @observable showErrType = 0 // 展示错误的type值
    @observable isV = true // 是否有协议
    @observable defaultIsRead = true
    @observable selectFlag = 0 // 购买次数
    // @observable buyMax = 5000000 // 后台未传 前端默认值 此字段干掉已于中台沟通，都会返回最大购买值

    @observable orgName: string = '' //
    @observable orgLogo: string = '' //
    @observable buyMinLimitAmt: string = '0' // 最小购买金额（起购金额）
    @observable buyMinIncreAmt: string = '0' // 最小购买递增金额
    @observable prdName: string = ''
    @observable showBuyMinLimitAmt = '0'

    @observable useBankCardPhone = false  //是否是用银行卡手机号
    @observable status = 0  // 0：银行发 1：比财发（3.0）


    @observable isChecked = true

    @observable balance = 0.00 //二类户余额

    @observable rechargeAdditionalParameters = {} // 购买调起充值需要的额外参数【现在主要针对金城，哈密银行】



    Public = publicStore
    Store = commonStore



    apiBuyFn = async (params) => {
        return await this.apiBank.apiBuy(params)
    }
    buyAgreementFn = async ( proId ) => {
        let parames = this.agreementPrdIndexId ? { prdIndexId : proId } : {}

        return await this.apiBank.buyAgreement( parames );
    }

    // 修改错误判断值以及获取实时金钱
    changeShowErrType = (type: number, val: String) => {
        runInAction(() => {
            this.showErrType = type
            this.money = val
        })
    }

    // 实时拿取input框的内容
    changeMoney = (val, type?) => {
        let { bankCardInfo, buyMinLimitAmt, buyMinIncreAmt, changeShowErrType }: any = this
        if (val == '') { // 当输入的值为空的时候
            changeShowErrType(0, val)
            return;
        }
        if (val < buyMinLimitAmt * 1) { // 当输入的金额小于最小购买金额时
            changeShowErrType(1, val)
            return;
        }
        if (bankCardInfo.buyMaxLimitAmt * 1 && val > bankCardInfo.buyMaxLimitAmt * 1) { // 用户输入的金额超出最大化
            changeShowErrType(2, val)
            return;
        }
        if (buyMinIncreAmt * 1 > 0) { // 是否符合购买最小递增
            if( multiplication(val,100) < multiplication(buyMinIncreAmt,100) ? true :  Modulo(multiplication(val,100),multiplication(buyMinIncreAmt,100)) == 0 ? false : true){
                changeShowErrType(3, val)
                return;
            }
        }
        changeShowErrType(0, val)
    }

    // 充值键盘输入事件
    changeMoneys = (e) => {
        runInAction(() => {
            this.rechargeMoney = e
            this.rechargeMoney = this.rechargeMoney.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
            this.rechargeMoney = this.rechargeMoney.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            this.rechargeMoney = this.rechargeMoney.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            this.rechargeMoney = this.rechargeMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            if (this.rechargeMoney.indexOf(".") < 0 && this.rechargeMoney != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                this.rechargeMoney = parseFloat(this.rechargeMoney).toString();
            }
        })
    }

    // 获取购买产品的次数【只争对某些银行的特殊需求】
    getApiQueryPurchaseCount = (params) => {
        this.apiBank.getApiQueryPurchaseCount(params).then(res => {
            if (res.purchaseCount > 0) {
                runInAction(() => {
                    this.buyMinLimitAmt = '0'
                })
            }
        })
    }

    // 获取产品信息
    apiQueryPrdInfo = async ( proId, query? ) => {
        let res = await this.apiBank.apiQueryPrdInfo({
            prdIndexId: proId
        })
        session.set('proInfo', res)
        runInAction(() => {
            this.orgName = res.orgName
            this.orgLogo = res.orgLogo
            this.buyMinLimitAmt = res.buyMinLimitAmt
            this.showBuyMinLimitAmt = res.buyMinLimitAmt
            this.buyMinIncreAmt = res.buyMinIncreAmt
            this.prdIndexType = res.prdIndexType
            // if (res.prdName.length > 6) {
            //     this.prdName = res.prdName.substring(0, 6) + "...";
            // }else{
            //     this.prdName = res.prdName
            // }
            this.prdName = res.prdName
            this.query = query
        })
        return res
    }
    // 初始化变量
    initStatus = () => {
        runInAction(() => {
            this.selectedCardInd = null
            this.modalType = null
            // this.money = null
            // this.showErrType = 0
        })
    }
    // 用户机构绑定卡信息
    //BIZ_TYPE.buy
    getBankCard = async (bizType = BIZ_TYPE.buy, transAmt = '') => {
        let { apiBandCardFn } = this.Public
        let {  proId }:any = commonStore.query()
        let UserCardList = await apiBandCardFn({
            bizType,    // 排序类型 3：充值，4：提现，6：存入，7：支取，8：更多服务
            transAmt,
            queryType: "0", // 查询类型 0-全部;1-卡列表;2-二类户;3-默认卡
            prdIndexId: session.get('proId') || proId
        }).then((res: any) => {
            runInAction(() => {
                this.bankCardInfo = res // 全部数据
                this.balance = res.balance
            })
        })
        return UserCardList;
    }

    // 查询余额
    checkTheBalance = () => {
        let { apiQryEleAccountFn } = this.Public
        apiQryEleAccountFn().then((res: any) => {
            runInAction(() => {
                this.balance = res.balance
            })
        })
    }
    // 确认购买
    confirmBuy = () => {
        let { money, isRead, agreementList } = this
        try {
            logBuyDeposit(session.get('proId'))
        } catch(err) {
            runInAction(() => {
                // 调起收银台
                this.rechargeMoney = help.clearComma(help.accSub(help.clearComma(this.balance), help.clearComma(money))), // 还需在充值的金额
                this.modalType = 1
            })
        }

        if (!isRead) {
            let agreement = ''
            agreementList.forEach((ele, index) => {
                agreement += ele.agreementTitle
                agreement += index + 1 == agreementList.length ? '' : '、'
            })
            return Toast.info(`请先同意${agreement}`, 1); // 这里需要修改 写活的agreementList
        }

        // apiQryEleAccountFn().then((res: any) => {
            if (this.balance * 1 < help.clearComma(money) * 1) { // 表示余额不够 需要充值
                this.getBankCard(BIZ_TYPE.buy, help.accSub(this.balance, help.clearComma(money) * 1))
                runInAction(() => {
                    // 调起收银台
                    this.rechargeMoney = help.clearComma(help.accSub(help.clearComma(this.balance), help.clearComma(money))), // 还需在充值的金额
                    this.modalType = 1
                })
            } else {
                let { money, bankCardInfo, selectedCardInd } = this
                if (typeof money == 'string') {
                    money = help.clearComma(money)
                }
                let bankCardRes: any = bankCardInfo
                let bankPhone =  bankCardRes.cardList.length ? (bankCardRes.cardList[(selectedCardInd == null ? 0 : selectedCardInd)].bankCardPhone) : bankCardRes.bankCardPhone // 银行卡的手机号
                let params: any = {
                    prdIndexId: session.get('proId'),
                    amount: money * 1,
                    tranBackAdd: window.location.href.split("?")[0],
                    bizType: BIZ_TYPE.buy, // 1表示为购(买
                    bankCardPhone: bankPhone,
                    phoneNum: bankCardRes.bankCardPhone, // 二类户的手机号
                    expandJson: window.sessionStorage.getItem('buyParams'),
                    bankElecAccountNum: bankCardRes.bankElecAccountNum, // 二类户的卡号
                    prdPeriod:this.query.prdPeriod,
                    userName: bankCardRes.realName, // 用户名
                    userCardId: bankCardRes.userCardId, // 身份证号
                }
                this.needMsgCode ? this.reChangeNextNeedSMS(params) : this.reChangeNextNOSMS(params)
            }
        // })
    }
    /**需要验证码的回调 【如果有需要验证，并且类似金城特殊的情况需要重写此方法，需要自己配置】*/
    reChangeNextNeedSMS = (params) => {
        this.Store.Hash.history.push(`/dealSendCode?params=${JSON.stringify(params)}`)
    }
    /**不需要验证码的回调 */
    reChangeNextNOSMS = (params) => {
        TradeRequestMethod.apiBuyFn(params)
    }
    // 点击充值完成之后的按钮的事件
    rechargeBtn = (obj, bankCardInfo?) => {
        runInAction(() => {this.selectedCardInd = null})
        if (obj.orderStatus == 0) { // 成功
            window.clearInterval(this.timer)
            runInAction(() => {
                this.modalType = null
            })
            this.checkTheBalance()
        } else if (obj.orderStatus == 20000) { // 充值申请提交成功
            runInAction(() => {
                this.modalType = null
            })
            this.checkTheBalance()
            // this.Store.Hash.history.push(`/bankDetail`)
        } else if (obj.innerCode == 100011) { // 未签约，去签约
            this.Store.Hash.history.push(`/signing?defaultCard=${JSON.stringify(bankCardInfo)}&source=buy`)
        } else {
            runInAction(() => {
                this.modalType = 1
            })
        }
    }
    // 选择银行卡
    curHandle = (index) => {
        try{
            this.apiBank.apiTradeCheck({ tradeType: 10 })
            runInAction(() => {
                this.selectedCardInd = index
                this.modalType = 2 // 2 表示充值
                this.seconds = 60
            })
        } catch(err) {

        }
    }
    // 查看协议
    goAgreement = (item) => {
        if (item.agreeAttr == '0') {
            this.Store.Hash.history.push(`/analysisText?itemAgreement=${JSON.stringify(item)}`)
        } else {
            let bankElecAccountNum = this.bankCardInfo.bankElecAccountNum
            this.Store.Hash.history.push(`/agreement?url=${item.agreementUrl}&money=${this.money}&bankElecAccountNum=${bankElecAccountNum}`)
        }
    }
    timer = null
    // 实现验证码
    countDown = (time, isNoteCode = true) => {
        this.timer = setInterval(() => {
            time--
            if (time <= 0) {
                window.clearInterval(this.timer)
            }
            runInAction(() => {
                if (isNoteCode) { // 表示为短信验证码的倒计时
                    this.seconds = time
                } else { // 应该去立即存入
                    this.btnTextTime = time
                    if (time == 1) {
                        runInAction(() => {
                            this.modalType = null
                        })
                        this.checkTheBalance()
                        // this.confirmBuy() // 调取立即购买接口
                        window.clearInterval(this.timer)
                    }
                }
            })
        }, 1000)
    }

    // 格式化发送验证码和停止定时器
    @action.bound
    formatTimer() {
        window.clearInterval(this.timer)
        runInAction(() => {
            this.seconds = 60
            this.btnTextTime = 3
        })
    }
    // 获取点击完成的失去焦点
    @action.bound
    completeHandle = async (val?, childFn?) => {
        if (this.whetherNeedMsg) {
            if (!val) return Toast.info('请输入短信验证码')
        }
        let { codeInfo, bankCardInfo, rechargeMoney, selectedCardInd, rechargeAdditionalParameters } = this
        let bankCardRes: any = bankCardInfo
        let curBankInfo: any = bankCardRes.cardList[selectedCardInd]
        let codeRes: any = codeInfo
        let params: any = {
            bankCardNum: curBankInfo.bankCardNum,
            bankName: curBankInfo.bankName,
            // bankElecAccountNum: bankCardRes.twoCardNo,
            amount: help.clearComma(rechargeMoney) * 1,
            validateCode: val || '',
            bizType: BIZ_TYPE.recharge,
            validateCodeSerialNum: codeRes.validateCodeSerialNum || codeRes.validateCodeSerialNum || '',
            phoneNum: this.useBankCardPhone ? (bankCardRes.cardList[(selectedCardInd == null ? 0 : selectedCardInd)].bankCardPhone) : bankCardRes.bankCardPhone,
            bankSerialNum: session.get('orderNumber') || '', // 针对营口的侧业务订单号
            bankCode:curBankInfo.bankNo, //一类户行号(只针对新疆汇合)
            preBankAccountNo: session.get('preBankAccountNo') || '',// 争对振兴行的是否签约字段
            ...rechargeAdditionalParameters
        }
        try {
            const res = await this.apiBank.apiRecharge(params, 'hide', 'hide')
            runInAction(() => {
                this.rechargeInfo = res
                this.modalType = 4
            })
            this.whetherNeedMsg ? childFn.initCodeNum() : null // 是为了清楚自己高仿input框内的值
            this.formatTimer()
            if (res.orderStatus == 0) { // 表示充值成功，实现倒计时了
                this.countDown(this.btnTextTime, false) // 实现倒计时 立即存入
            }
        } catch (err) {
            let data: any = err
            runInAction(() => {
                this.rechargeInfo = data
                this.modalType = 4
            })
            this.whetherNeedMsg ? childFn.initCodeNum() : null // 是为了清楚自己高仿input框内的值
            this.formatTimer() // 停止验证码的定时器
        }
    }
    // 关闭弹窗
    onClose = () => {
        runInAction(() => {
            this.modalType = null
            this.selectedCardInd = null
        })
        this.formatTimer()
    }
    // 重新获取验证码
    retrieve = () => {
        if (this.seconds <= 0) {
            runInAction(() => {
                this.seconds = 60
            })
            this.getSendCode()
        }
    }


    // 抽离调用充值验证码接口入口方法【方便特殊情况重写】
    getVerificationCodeFun = async (params) => {
        let { apiSendPhoneCodeFn } = this.Public
        await apiSendPhoneCodeFn(params).then(res => {
            runInAction(() => {
                this.modalType = 3
                this.codeInfo = res
            })
            // 针对营口的侧业务订单号
            if (res.orderNumber) {
                session.set('orderNumber', res.orderNumber)
            }
            // 争对振兴行的是否签约字段
            if (res.preBankAccountNo) {
                session.set('preBankAccountNo', res.preBankAccountNo)
            }
            this.countDown(60)
        })
    }


    // 获取验证码接口
    getSendCode = () => {
        let { bankCardInfo, rechargeMoney, selectedCardInd, getVerificationCodeFun }: any = this
        let bankCardRes: any = bankCardInfo
        let params: any = {
            bizType: BIZ_TYPE.recharge,
            amount: help.clearComma(rechargeMoney) * 1,
            bankCardPhone: this.useBankCardPhone ? (bankCardRes.cardList[(selectedCardInd == null ? 0 : selectedCardInd)].bankCardPhone) : bankCardRes.bankCardPhone,
            status: this.status,
            bankCardNum: (bankCardRes.cardList[(selectedCardInd == null ? 0 : selectedCardInd)].bankCardNum) // 振兴行特殊字段，验证码需传递银行卡账号
        }
        getVerificationCodeFun(params)
    }

    // 确认充值
    confirmRecharge = () => {
        try {
            logBuyRechargeBtn() // 打点
        } catch (err) { }
        if (this.whetherNeedMsg) {
            this.getSendCode()
        } else {
            this.completeHandle()
        }
    }
    // 是否同意协议
    tabIsRead = (flag) => {
        runInAction(() => {
            this.isRead = flag
        })
    }

    //更新产品内容
    getProInfo = (res?) => {
        console.log(res, '=====getProInfo')
        runInAction(() => {
            if (res) {
                if (res.amount > 0) {
                    this.proInfo = session.get('proInfo')
                    this.changeMoney(help.clearComma(res.amount), true)
                    // this.money = help.formatNum(res.amount.toString()) || ''
                } else {
                    this.proInfo = session.get('proInfo')
                }
            } else {
                // this.proInfo = session.get('proInfo')
            }
        })
    }
    //更新产品协议信息
    getAgreementList = (res) => {
        /**
         * selectFlag
         * 【中台返回是否默认选中协议 1：是 0：否】
         * 根据中关村需求衍生而来，中关村购买第一次购买默认展示协议（默认不勾选协议）【0】，以后购买不展示协议（默认勾选协议）【1】
         */
        if (res.selectFlag != 0) {
            runInAction(() => {
                this.agreementList = res.agreementList
                this.isRead = this.defaultIsRead
                // this.proInfo = session.get('proInfo')
                this.selectFlag = res.selectFlag
            })
        } else {
            runInAction(() => {
                this.agreementList = res.agreementList
                // this.proInfo = session.get('proInfo')
            })
        }
    }
}

export default new PgBuy()
