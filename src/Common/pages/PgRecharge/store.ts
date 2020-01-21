import { observable, action, runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends'
import help from 'Common/utils/Tool'
import { commonStore } from "Common/pages/store"
import { TradeRequestMethod } from 'Common/pages/store'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { Toast } from 'antd-mobile';
import { paymentAccountBtn, rechargePageBtn } from 'Common/Plugins/recordLogInfo'

export class PgRecharge extends StoreExtends {
    /** 是否需要发送验证码 */
    @observable needMsgCode = true
    @observable isShowSelectCard = false // 是否显示收银台
    @observable defaultCard = {} // 默认银行
    @observable money = null // 交易金额
    @observable bankInfo = {} // 总信息
    @observable showErrType = 0 // 实时展示的错误信息的type
    @observable selectedIndex = 0 // 默认选中的第一张卡
    @observable isShowMonthDesc = true // 是否显示月限额
    @observable isShowHandleBtn = true // 是否显示添加/更换银行卡

    @observable showRechargeOnoff = false // 是否有充值协议；
    @observable isRead = true // 协议是否已阅读；
    @observable agreementList = [] // 协议列表

    @observable selectCardTitle = "选择银行卡";

    // @observable isFirstGetApiBandCard = true // 协议列表

    @observable adapterBankCardData = {
        balance: '',
        balanceDesc: '',
        orgName: '',
        bankElecAccountNum: '',
        orgLogo: '',
        custServiceHotLine: '',
        bindMutiCardsFlag: '',
        orgBgUrl: '',
        realName: '',
        userCardId: '',
        bankCardPhone: '',
        hasRiskAssess: '',
        riskAssessTolerance: '',
        cardList: [
            {
                bankCardNum: '',
                bankCardType: '',
                bankCardName: '',
                realName: '',
                userCardId: '',
                bankCardPhone: '',
                bankName: '',
                bankSubName: '',
                openBankDesc: '',
                openBankPinyin: '',
                bankNo: '',
                city: '',
                province: '',
                bankLogoUrl: '',
                supportFlag: '',
                singleDedct: '',
                dayDedct: ''
            }
        ]
    } //

    Store = commonStore


    verificationCodeOnoff = true;  // 是否发送验证码

    // @observable showErrType = 0 // 实时展示的错误信息的type

    // 格式化当前页面的内容
    initStatus = () => {
        runInAction(() => {
            this.money = null
            // this.selectedIndex = 0
            this.showErrType = 0
            this.isShowSelectCard = false
        })
    }
    // 子组件调用的方法
    changeMoney = (val) => {
        let { defaultCard: { bankCardQuotaDescDto }, bankInfo }: any = this
        let bankRes: any = bankInfo
        runInAction(() => {
            this.money = val
        })

        // 验证提示
        if (val) {
            // 判断体现卡列表为空
            if ( JSON.stringify(this.defaultCard) == '{}') {
                runInAction(() => {
                    this.showErrType = 3;
                })
                return;
            }

            if( bankCardQuotaDescDto.singleDedct == 0 ){
                runInAction(() => {
                    this.showErrType = 0
                })
                return;
            }
            if (val - 0 > bankCardQuotaDescDto.singleDedct - 0 && bankCardQuotaDescDto.singleDedct != '-1') {
                runInAction(() => {
                    this.showErrType = 1
                })
            } else if ( val < bankRes.chargeMinLimitAmt * 1 ) {
                runInAction(() => {
                    this.showErrType = 2;
                })
            } else {
                runInAction(() => {
                    this.showErrType = 0
                })
            }
        } else {
            runInAction(() => {
                this.showErrType = 0
            })
        }
    }
    // 公共接口，获取银行卡信息
    apiBandCardFn = async () => {
        let params = {
            bizType: BIZ_TYPE.recharge,
            queryType: '0', //查询类型 0-全部;1-卡列表;2-二类户;3-默认卡
            transAmt: this.money  == null ? '' : this.money
        }
        let res: any = await this.apiBank.apiBandCard(params)
        runInAction(() => {
            this.bankInfo = res
            if ( res.cardList.length ) {
                this.defaultCard = res.cardList.length > 0 ? res.cardList[this.selectedIndex] : {};
            }
        })
    }
    // 处理收银台的显示隐藏
    modalHandle = (flag) => {
        // 点位： 付款账户点击
        try {
            paymentAccountBtn()
        } catch(err) {}

        runInAction(() => {
            if (flag) {
                this.apiBandCardFn()
            }
            this.isShowSelectCard = flag
        })
    }
    // 切换卡
    switchBankCard = (index, selectedBank) => {
        runInAction(() => {
            this.selectedIndex = index
            this.defaultCard = selectedBank
            this.isShowSelectCard = false
            this.showErrType = 0
        })
    }
    // 点击充值的下一步操作(不需发送验证码直接重写此方法)
    nextStep = () => {
        try {
            rechargePageBtn()
        } catch(err) {}

        const { changeAlertTitle } = commonStore
        changeAlertTitle('充值失败')
        if( !this.isRead ){ Toast.info( `请先同意${this.agreementList[0].agreementTitle}` ,1 );return; }
        let { money, defaultCard, bankInfo }: any = this
        let params = {
            bizType: BIZ_TYPE.recharge,
            amount: money * 1,
            bankCardNum: defaultCard.bankCardNum,
            bankName: defaultCard.bankName,
            bankCardPhone: defaultCard.bankCardPhone,
            phoneNum: bankInfo.bankCardPhone,
            twoCardNo: bankInfo.bankElecAccountNum,
            bankCode: defaultCard.bankNo || '' //一类户行号(只针对新疆汇合)
        }
        this.needMsgCode ? this.reChangeNextNeedSMS(params) : this.reChangeNextNOSMS(params)
    }
    /**需要验证码的回调 【如果有需要验证，并且类似金城特殊的情况需要重写此方法，需要自己配置】*/
    reChangeNextNeedSMS = (params) => {
        this.Store.Hash.history.push(`/dealSendCode?params=${JSON.stringify(params)}&defaultCard=${JSON.stringify(this.defaultCard)}`)
    }
    /**不需要验证码的回调 */
    reChangeNextNOSMS = (params) => {
        let additionalParameters = {}
        TradeRequestMethod.apiRechargeFn(params, additionalParameters, '', '', this.defaultCard)
    }
    apiRechargeFn = async (data) => {
        return await this.apiBank.apiRecharge(data)
    }
    // 是否允许更换绑定银行卡
    changeBankCardFlagFn = async () => {
        return await this.apiBank.changeBankCardFlag()
    }

    tabIsRead = () => {
        runInAction(() => {
            this.isRead = !this.isRead;
        })
    }

    getChargeAgreement = async () => {
        let data = await this.apiBank.getChargeAgreement();
        console.log( data );
        runInAction(() => {
            this.agreementList = data.agreementList
        })
    }
}
export default new PgRecharge()
