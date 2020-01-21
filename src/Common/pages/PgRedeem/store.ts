import {observable, action, runInAction, toJS} from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import help from 'Common/utils/Tool'
import {commonStore} from "Common/pages/store"
import {TradeRequestMethod} from 'Common/pages/store'
import {BIZ_TYPE} from 'Common/config/params.enum'
import { redeemBtn } from 'Common/Plugins/recordLogInfo'
import { Native } from "Common/utils/appBridge"
import { session, } from 'Common/utils/store'



// const { openAlert } = commonStore
// let {apiRechargeFn, apiBuyFn, apiCashFn, apiRedemptionFn, errHandle} = TradeRequestMethod

export class PgRedeem extends StoreExtends {
    /** 是否需要发送验证码 */
    @observable needMsgCode = true
    /** 是否需要请求该产品的信息 */
    @observable isRequestProInfo = false
    @observable prePageParam = {} // 从持有中带来的数据
    @observable rateInfo = {} // 收益的信息
    @observable money = null // null
    @observable bankInfo = {}
    @observable showErrType = 0  // 提示错误的type值 (表示的错误内容看showErrHtml方法)
    @observable prdIndexId = null // 比财产品索引表ID
    @observable minRedmptAmt = '' // 留存金额
    @observable MIN_MONEY = 1 // 最小金额
    @observable INCRE_AMOUNT = 0.01 // 最小递增
    @observable defaultCard = {}
    @observable proInfo = {} // 产品信息
    @observable tipText = '' // 提示信息的内容

    @observable isRequestRate = true // 是否请求收益接口
    @observable hiddenRateNum = false // 预计收益与利率一栏，隐藏收益
    @observable isTip = false; // 是否显示提示
    @observable isEditInput = true; // 是否可以编辑input
    Store = commonStore
    

    // 增加新疆汇合和晋中增加支取弹窗
    @observable isActivityPopup = false; //是否有活动弹窗接口
    @observable activityTip = false;  // 是否现实活动提示
    @observable moduleFlag = true
    @observable activityData = ''

    onClose = () => {
        runInAction(() => {
            this.moduleFlag = false
        })
    }
    goNextRedeem = () => {
        runInAction(() => {
            this.moduleFlag = false
            this.redeemNext()
         })
    }
    goBack = ()=>{
        runInAction(() => {
            if(Native.isApp()&& session.get('appToReed')=='1' ){
                Native.closeWebView()
            }else{
                this.Store.Hash.history.go(-1);
            }
        })
    }

    // 初始化可能缓存的状态
    initStatus = () => {
        runInAction(() => {
            this.showErrType = 0
            this.money = null
            this.rateInfo = {}
        })
    }
    // 设置传递过来的参数
    setParams = () => {
        runInAction(() => {
            const obj:any = this.Store.query()
            obj.amount = help.clearComma(obj.amount)
            this.prePageParam = obj
            if (!this.isEditInput) {
                this.money = obj.amount;
            }
        })
    }
    // 公共接口，获取银行卡信息
    apiBandCardFn = async () => {
        let {prePageParam}: any = this
        let params = {
            bizType: BIZ_TYPE.redeem, // 排序类型 0-开户;3：充值，4：提现，6：存入，7：支取，8：更多服务
            queryType: "0", //查询类型 0-全部;1-卡列表;2-二类户;3-默认卡
            prdIndexId: prePageParam.prdIndexId
        }
        let res: any = await this.apiBank.apiBandCard(params)
        runInAction(() => {
            this.bankInfo = res
            if (res.cardList.length) {
                this.defaultCard = res.cardList.length > 0 ? res.cardList[0] : {}
            }
        })
    }
    // 产品信息
    apiQueryPrdInfoFn = async () => {
        const obj:any = this.Store.query()
        let res = await this.apiBank.apiQueryPrdInfo({
            prdIndexId: obj.prdIndexId
        })
        runInAction(() => {
            this.proInfo = res
        })
    }
    // 支取
    apiRedemptionFn = async (data) => {
        return await this.apiBank.apiRedemption(data)
    }
     //支取特殊活动弹框接口[晋中，新疆汇合]
     apiSpecialTipFn = async () => {
        const obj:any = this.Store.query()
        let params = {
            amount:this.money,
            prdIndexId:obj.prdIndexId
        }
        let res = await this.apiBank.getSpecialVerificationInterface(params)
      
        if(res&&res.isPopup=='0'){
            runInAction(() => {
                this.activityTip=true;
                this.moduleFlag = true;
                this.activityData=res.data;
            })
        }else{
            runInAction(() => {
                this.activityTip=false;
                this.redeemNext();
            })
        }
    }
    // 收益预算
    apiInterestCalculationFn = async () => {
        let {prePageParam, money}: any = this
        if (!this.isEditInput) {
            money = prePageParam.amount;
        }
        if (money == '') return
        try {
            let data = {
                amount: money.toString() , // '10000',  // money,   // 支取金额
                prdIndexId: prePageParam.prdIndexId, // '1000000229',   // prePageParam.prdIndexId, // 比财产品唯一标识
                reqSerial: prePageParam.reqSerial || '' // '2019062018212791426033'   // prePageParam.reqSerial // 订单号
            }
            let res = await this.apiBank.apiInterestCalculation(data)
            runInAction(() => {
                this.rateInfo = res
            })
        }catch {
            runInAction(() => {
                this.rateInfo = {}
            })
        }
    }
    timer = null
    // 节流时间在一定时间执行一次
    throttle() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            if (!this.showErrType) {
                let { money } = this
                this.apiInterestCalculationFn()// 调用获取利息
            }
        }, 1000);
    }

    // 针对最小递增的校验
    minMoneyRule = (val) => {
        let {MIN_MONEY, INCRE_AMOUNT} = this
        if (val * 1 < MIN_MONEY) {
            runInAction(() => {
                this.showErrType = 1 // 支取金额需大于${MIN_MONEY}元
                this.rateInfo = {}
            })
            return false
        }
        if (INCRE_AMOUNT >= 1) {
            if ((val * 1) % INCRE_AMOUNT != 0) {
                runInAction(() => {
                    this.showErrType = 2 // 请输入递增金额的整数倍
                    this.rateInfo = {}
                })
            }
            return false
        }
        return true
    }
    // 针对支取的最大金额的校验
    ruleRedeemMoney = (val) => {
        let {prePageParam}: any = this
        if (val - 0 > prePageParam.amount - 0) {
            runInAction(() => {
                this.showErrType = 3 // 支取金额大于存款本金，请调整支取金额
                this.rateInfo = {}
            })
            return false
        } else {
            runInAction(() => {
                this.showErrType = 0 // 支取金额大于存款本金，请调整支取金额
            })
        }
        return true
    }
    // 子组件调用的方法
    changeMoney = (val, showStatus) => {
        if (/^0\w$/.test(val)) return runInAction(() => {
            this.money = '0'
        })
        runInAction(() => {
            this.money = val
        })
        if (!val) {
            runInAction(() => {
                this.rateInfo = {}
                this.showErrType = 0;
            })
            return
        }
        let {prePageParam, proInfo}: any = this
        let nextFlag = showStatus == 1 ? (this.minMoneyRule(val) && this.ruleRedeemMoney(val)) : this.ruleRedeemMoney(val)
        if (nextFlag) {
            let redeemMoney: any = (prePageParam.amount - 0) - (val - 0);
            if (prePageParam.amount - 0 != val - 0) {
                if (redeemMoney < proInfo.redeemRetainedAmt - 0) {
                    runInAction(() => {
                        this.showErrType = 4
                        this.rateInfo = {}
                    })
                    return
                }
            }
            runInAction(() => {
                this.showErrType = 0
            })
            if (this.isRequestRate) {
                this.throttle();
            }
        }
    }
    // 获取所有金额
    getAllMoney = (showStatus) => {
        let {prePageParam}: any = this
        let money = prePageParam.amount
        let nextFlag = showStatus == 1 ? (this.minMoneyRule(money) && this.ruleRedeemMoney(money)) : this.ruleRedeemMoney(money)
        if (nextFlag) {
            runInAction(() => {
                this.money = money
                this.showErrType = 0
            })
            { this.isRequestRate ? this.apiInterestCalculationFn() : null } // 调用获取利息
        }
    }

    redeemNext= () => {
        let data: any = commonStore.query();
        let page: any = data && data.type || ''
        let { money, prePageParam, bankInfo, defaultCard, rateInfo }: any = this
        let params = {
            bizType: BIZ_TYPE.redeem,
            amount:money - 0,
            prdIndexId: prePageParam.prdIndexId,
            reqSerial: prePageParam.reqSerial,
            bankSerialNum:  prePageParam.bankSerialNum || '',
            bankElecAccountNum:  bankInfo.bankElecAccountNum,
            bankCardPhone: defaultCard.bankCardPhone ? defaultCard.bankCardPhone : bankInfo.bankCardPhone, // 银行卡的手机号
            phoneNum: bankInfo.bankCardPhone, // 二类户的手机号
            page: page,
            rate: rateInfo.rate ? rateInfo.rate : ''
        }
        this.needMsgCode ? this.reChangeNextNeedSMS(params) : this.reChangeNextNOSMS(params)
    }

    // 支取的下一步操作按钮（不需要验证码 重写此方法）
    nextStep = () => {
        try {
            redeemBtn()
        } catch (err) {}

        //支取特殊活动弹框接口[晋中，新疆汇合]
         this.isActivityPopup ? this.apiSpecialTipFn():  this.redeemNext();
     
        // this.Store.Hash.history.push(`/dealSendCode?params=${JSON.stringify(params)}`)
    }
    /**需要验证码的回调 【如果有需要验证，并且类似金城特殊的情况需要重写此方法，需要自己配置】*/
    reChangeNextNeedSMS = (params) => {
        this.Store.Hash.history.replace(`/dealSendCode?params=${JSON.stringify(params)}`)
    }
    /**不需要验证码的回调 */
    reChangeNextNOSMS = (params) => {
        TradeRequestMethod.apiRedemptionFn(params)
    }


    
}

export default new PgRedeem()