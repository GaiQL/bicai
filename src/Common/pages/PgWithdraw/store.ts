/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 16:12:20
 * @LastEditTime: 2019-08-27 14:22:30
 * @LastEditors: Please set LastEditors
 */

import { observable, runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import help from 'Common/utils/Tool'
import { commonStore,publicStore } from "Common/pages/store"
import {TradeRequestMethod} from 'Common/pages/store'
import {BIZ_TYPE} from 'Common/config/params.enum'
import { withdrawalBtn } from 'Common/Plugins/recordLogInfo'

export class PgWithdraw extends StoreExtends{
    /** 是否需要发送验证码 */
    @observable needMsgCode = true
    /** 是否需要请求余额接口 */
    @observable getBalanceOnoff = false
    @observable balanceData:any = {};

    /** 提现是否显示银行卡的信息 */
    @observable isShowDesc = false
    @observable isShowMonthDesc = false
    @observable isShowArrow = false
    @observable isShowTip = true
    @observable isShowSelectCard = false
    /** 页面中必要的参数 */
    @observable money = null
    @observable bankInfo = {}
    @observable defaultCard = {}
    @observable eithdrawAll = 0
    @observable showErrType = 0 // 错误的type值
    @observable tipShow = "预计2小时内到账，实际到账时间以银行最终处理时间为准"

    @observable tipShow1 = ""//不同银行提示
    @observable selectedIndex = 0
    @observable accRestDoc = '可提现金额';

    @observable selectCardTitle = "选择银行卡";

    Store = commonStore

    initializeDidMount = async () => {
        let { apiQryEleAccountFn } = publicStore;
        this.apiBandCardFn();
        if( this.getBalanceOnoff ){
            let balanceData = await apiQryEleAccountFn();
            runInAction(()=>{ this.balanceData = balanceData })
        }
    }
    // 清除可能缓存的状态
    initStatus = () => {
        runInAction(() => {
            this.money = ''
            this.showErrType= 0
            this.isShowSelectCard=false
        })
    }
    apiCashFn = async (data)=> {
        return await this.apiBank.apiCash(data)
    }
    // 公共接口，获取银行卡信息
    apiBandCardFn = async() => {
        let params = {
            bizType: BIZ_TYPE.withdraw,
            queryType:'0'   //查询类型 0-全部;1-卡列表;2-二类户;3-默认卡
        }
        let res:any = await this.apiBank.apiBandCard(params)
        runInAction(() => {
            this.bankInfo = res
            if (res.cardList.length) {
                this.defaultCard = res.cardList.length > 0 ? res.cardList[this.selectedIndex] : {}
            }
        })
    }
    // 实时拿取input框内的值
    changeMoney = (val) => {
        let { bankInfo }:any = this
        runInAction(() => {
            this.money = val
        })
        // 判断体现卡列表为空
        if (val) {
            if ( JSON.stringify(this.defaultCard) == '{}') {
                runInAction(() => {
                    this.showErrType = 4;
                })
                return;
            }
        }else{
            runInAction(() => {
                this.showErrType = 0
            })
        }

        if (val - 0 > bankInfo.balance - 0) { // 验证
            runInAction(() => {
                this.showErrType = 1
            })
        } else if (val && val < bankInfo.withdrawMinLimitAmt * 1) {
            runInAction(() => {
                this.showErrType = 2
            })
        }  else if (bankInfo.withdrawMaxLimitAmt - 0 && val > bankInfo.withdrawMaxLimitAmt - 0) {
            runInAction(() => {
                this.showErrType = 3
            })
        } else {
            runInAction(() => {
                this.showErrType = 0
            })
        }
    }
    // 获取全部金额
    getAllMoney = () => {
        if ( JSON.stringify(this.defaultCard) == '{}') {
            runInAction(() => {
                this.showErrType = 4;
            })
            return;
        }
        let { bankInfo,getBalanceOnoff,balanceData }:any = this
        let allMoney = getBalanceOnoff?balanceData.withdrawalAmount:bankInfo.balance
        this.changeMoney(allMoney)
    }
    // 处理收银台的显示隐藏
    modalHandle = (flag) => {
        runInAction(() => {
            this.isShowSelectCard = flag
        })
    }

     // 切换卡
    switchBankCard = (index, selectedBank) => {
        runInAction(() => {
            this.selectedIndex = index
            this.defaultCard = selectedBank
            this.isShowSelectCard = false
        })
    }

    // 提现按钮的下一步操作(如不发送验证码  需重写此方法)
    nextStep = () => {
        try {
            withdrawalBtn()
        } catch(err) {}
        let data: any = commonStore.query();
        let page: any = data && data.type || ''
        console.log(page, '=========')
        let { money, bankInfo, defaultCard }:any = this
        let withDrawType = (bankInfo.balance * 1 > money * 1) ? 0 : 1 // 0：部分提取 1：全部提取
        let params = {
            amount: money * 1,
            withDrawType,
            bizType: BIZ_TYPE.withdraw,
            bankElecAccountNum: bankInfo.userCardId, // II类户
            bankName: defaultCard.bankName,
            bankCardNum: defaultCard.bankCardNum,  // I类户
            phoneNum: bankInfo.bankCardPhone,
            bankCardPhone: defaultCard.bankCardPhone,
            bankCode:defaultCard.bankNo || '', // //一类户行号(只针对新疆汇合)
            page: page
        }
        this.needMsgCode ? this.reChangeNextNeedSMS(params) : this.reChangeNextNOSMS(params)
    }

    /**需要验证码的回调 【如果有需要验证，并且类似金城特殊的情况需要重写此方法，需要自己配置】*/
    reChangeNextNeedSMS = (params) => {
        this.Store.Hash.history.replace(`/dealSendCode?params=${JSON.stringify(params)}`)
    }
    /**不需要验证码的回调 */
    reChangeNextNOSMS = (params) => {
        TradeRequestMethod.apiCashFn(params)
    }
}
export default new PgWithdraw()
