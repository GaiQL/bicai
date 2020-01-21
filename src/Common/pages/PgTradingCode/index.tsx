import React from 'react'
import './style.scss'
import {observer} from 'mobx-react'
import {Headers, BcButton, BottomColumn} from 'Common/publicCommon/index'
import {session} from 'Common/utils/store'
import help from 'Common/utils/Tool'
import { tradingStatus} from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
import {commonStore} from "Common/pages/store"
import {apiFactory, apiVersion} from 'Common/api/bank'
import Store from './store'
import {TradeRequestMethod} from 'Common/pages/store'
import {BcYzmInput} from 'bc-bank-design'
// const { BcYzmInput } = require('bc-bank-design')
import { rechargeVerificationCodeBtn, buyVerificationCodeBtn } from 'Common/Plugins/recordLogInfo'

let {apiRechargeFn, apiBuyFn, apiCashFn, apiRedemptionFn, errHandle, apiCancelFn} = TradeRequestMethod
import {BIZ_TYPE} from 'Common/config/params.enum'
import {Toast} from 'antd-mobile';
import {runInAction} from "mobx";

@observer
class TradingCode extends React.Component<any, any> {
    /*=========控制api版本 start page里建议不要进行apiBank请求数据，统一到store里 ========*/
    apiVersion: apiVersion = this.props.apiVersion || 'v2'
    apiBank: any = apiFactory(this.apiVersion)
    /*=========控制api版本 end========*/
    private = {}
    Config: any = {
        useBankCardPhone: false,
        status: 0,
    }
    
    // 是否有额外验证码请求参数【比如遇到特殊充值接口【金城，哈密】银行特殊】
    isAdditionalVerificationCode = false

    state = {
        sendCodeFlag: false,
        phone: '', // 确定当前的手机号(二类户还是银行卡)
        query: {}, // 携带过来的参数
        code: "", // 验证码
        validateCodeSerialNum: "",// 验证码流水号
        errHero: false, // 对于验证码发生错误重置验证码
        timer: 60,  // 验证码时间
        SpecialIdentification: 1, // 针对特殊产品文案设定
    }
    Store = Store

    UNSAFE_componentWillMount() {
        let {useBankCardPhone} = this.Config // 这个来确定使用那个手机号来发送短信验证码
        let data: any = commonStore.query()
        let params = JSON.parse(data.params)
        this.setState({
            query: params,
            SpecialIdentification: params.SpecialIdentification || 1,
            phone: useBankCardPhone ? params.bankCardPhone : params.phoneNum
        })
    }

    componentDidMount() {
        let {query, phone}: any = this.state
        if (query.bizType == BIZ_TYPE.jch) {
            this.apiRechargejcFn(query.bankCardNum, query.bankName, query.amount)
        } else {
            if( query.validateCodeSerialNum ){
                this.setState({ sendCodeFlag: true });
            }else{
                this.apiSendPhoneCodeFn(phone, query.bizType, query.amount);
            }
        }
    }

    // 抽离充值，方便特殊情况重写
    RechargeExternalFun = (query, code, phone) => {
        let { defaultCard }: any = commonStore.query()
        // 额外参数【如需添加其他参数，直接写到该对象中，到那边直接合并】
        let additionalParameters = { }
        // 如遇到充值接口需要私有重写，不掉用公共方法，注意传参顺序
        this.Config.apiRechargeFn ? this.Config.apiRechargeFn(query, code, phone, defaultCard ? JSON.parse(defaultCard) : null) : apiRechargeFn(query, additionalParameters, code, phone, defaultCard ? JSON.parse(defaultCard) : null)
    }

    confirm(type) {
        let {query, code, phone, SpecialIdentification} = this.state;
        if (type == BIZ_TYPE.recharge) { // 充值
            try {
                rechargeVerificationCodeBtn()
            } catch(err) {}
            this.RechargeExternalFun(query, code, phone);
            return;
        } 
        if (type == BIZ_TYPE.withdraw) { // 提现
            this.Config.apiCashFn ? this.Config.apiCashFn(query, code, phone) : apiCashFn(query, code, phone)
            return;
        } 
        if (type == BIZ_TYPE.redeem) { // 支取
            this.Config.apiRedemptionFn ? this.Config.apiRedemptionFn(query, code, phone) : apiRedemptionFn(query, code, phone)
            return;
        } 
        if (type == BIZ_TYPE.buy) { // 购买
            try {
                buyVerificationCodeBtn()
            } catch(err) {}
            
            let SpecialExpression = BIZ_TYPE.buy * SpecialIdentification
            this.Config.apiBuyFn ? this.Config.apiBuyFn(query, code, phone, SpecialExpression) : apiBuyFn(query, code, phone, SpecialExpression)
            return;
        } 
        if (type == BIZ_TYPE.jch) {
            // 只针对金城充值
            let {code}: any = this.state
            this.apiRechargeConfirmFn(session.get('reqSerial'), code, session.get('validateCodeSerialNum'))
            return;
        }
        
    }

    // 验证码初始化errHero
    ininState = () => {
        this.setState({
            errHero: false
        })
    }

    //在一次发送验证码
    againGetYzm = (callback?) => {
        //判断接口验证码标识发送成功执行
        if (this.state.sendCodeFlag) {
            callback();
        }
        let {query, phone} = this.state
        let res: any = query
        this.apiSendPhoneCodeFn(phone, res.bizType, res.amount)
    }
    //验证码内部倒计时为0的时候重置父组件传入的验证码倒计时状态
    resetFlag = (flag) => {
        runInAction(() => {
            this.state.sendCodeFlag = false
        })
    }

    render() {
        let {sendCodeFlag, query, code, phone, errHero, timer, SpecialIdentification} = this.state
        let res: any = query
        console.log(tradingStatus)
        let title = `输入${tradingStatus.get(res.bizType * SpecialIdentification)[0]}验证码`
        return (
            <div className='securityCode'>
                <Headers>{title}</Headers>
                <div className='securityCode-info'>
                    <p>我们已发送<span>验证码</span>短信到您的手机</p>
                    <p>{help.fromatMobileFilter(phone)}</p>
                </div>
                <BcYzmInput
                    resetFlag={this.resetFlag}
                    countDownFlag={sendCodeFlag}
                    timer={timer}
                    click={(fn) => {
                        this.againGetYzm(fn)
                    }}
                    change={(e) => {
                        this.setState({code: e})
                    }}>
                </BcYzmInput>
                <BcButton
                    isDisabled={code == "" || code.length != 6}
                    className='securityCode-confirm'
                    onClick={() => this.confirm(res.bizType)}>确定</BcButton>
                <BottomColumn type='long'/>
            </div>
        )
    }

    beforeSendPhoneAop = (bizType) => {
        console.log(bizType);
        //  发送验证码之前可以对类型进行校验，做不同的处理
    }

    // 额外验证码请求参数【比如遇到特殊充值接口【金城，哈密】银行特殊】
    additionalVerificationCode = (bizType?, amount?) => {}

    // 发送验证码
    apiSendPhoneCodeFn = async (phoneNum, bizType, amount) => {
        this.beforeSendPhoneAop( bizType)
        let {bankCardNum}: any = this.state.query
        try {
            //金城比较特殊得单独调用接口
            if (bizType == BIZ_TYPE.jch) {
                let {query}: any = this.state
                await this.apiRechargejcFn(query.bankCardNum, query.bankName, amount)
                return
            }
            if (this.isAdditionalVerificationCode) {
                await this.additionalVerificationCode(bizType, amount)
                return
            }
            let {query}: any = this.state
            let {status = 0} = this.Config // 0：银行发 1：比财发（3.0）
            let params: any = {
                bankCardPhone: phoneNum,
                status: status,
                bizType, // 1:绑定手机号短信验证码 2:绑卡短信验证 3:充值短信验证 4：提现短信验证码 6：存入 7:支取
                amount,
                bankCardNum,
                userName: query.userName ? query.userName : '', // 华兴银行获取验证码需要用户名
                userCardId: query.userCardId ? query.userCardId : '', // 华兴银行获取验证码需要身份证号
            }
            if (bizType == 6 || bizType == 7) {
                params.prdIndexId = query.prdIndexId
            }
            ;
            // todo page 页面中不要请求接口。抽离到store里
            let data: any = await this.apiBank.apiSendPhoneCode(params)
            // 添加到本地存储，防止validateCodeSerialNum参数丢失报错
            // if (data.validateCodeSerialNum || data.validateCodeSerialNum) {
            //     session.set('validateCodeSerialNum', data.validateCodeSerialNum || data.validateCodeSerialNum)
            // 添加到本地存储，防止validateCodeSerialNum参数丢失报错   此处if else 是为了兼容中台字段返回的变化。
            if (data.validateCodeSerialNum) {
                session.set('validateCodeSerialNum', data.validateCodeSerialNum)
            }
            // 针对营口的侧业务订单号
            if (data.orderNumber) {
                session.set('orderNumber', data.orderNumber)
            }
            // 针对振兴行的是否签约字段
            if (data.preBankAccountNo) {
                session.set('preBankAccountNo', data.preBankAccountNo)
            }
            this.setState({
                sendCodeFlag: true,
            })
        } catch (e) {
            this.setState({
                sendCodeFlag: false
            })
        }
    }
    // 金城接口请求验证码
    apiRechargejcFn = async (bankCardNum, bankName, amount) => {
        let params = {
            bankCardNum,
            bankName,
            amount
        }
        // todo page 页面中不要请求接口。抽离到store里
        let data: any = {}
        try {
            data = await this.apiBank.apiRechargejc(params)
            // 添加到本地存储，防止validateCodeSerialNum参数丢失报错\
            this.setState({
                sendCodeFlag: true
            })
            if (data.validateCodeSerialNum) {
                session.set('validateCodeSerialNum', data.validateCodeSerialNum)
            }
            if (data.reqSerial) {
                session.set('reqSerial', data.reqSerial)
            }
            return Promise.resolve(data)
        } catch (err) {
            // console.log(err, 'sss')
            this.setState({
                sendCodeFlag: false
            })
            return Promise.reject()
        }

    }
    // 金城接口充值确认
    apiRechargeConfirmFn = (reqSerial, validateCode, validateCodeSerialNum) => {
        let params = {
            reqSerial,
            validateCode,
            validateCodeSerialNum
        }
        // todo page 页面中不要请求接口。抽离到store里
        this.apiBank.apiRechargeConfirm(params).then((res: any) => {
            if (res.orderStatus == 20000) {
                this.props.history.replace(
                    `/rechargeWaiting?orderMsgTitle=${res.orderMsgTitle}&orderMsgContent=${res.orderMsgContent}&bankIcon=${res.bankIcon}&bankName=${res.bankName}`
                )
            } else if (res.orderStatus == 0) {
                this.props.history.replace(
                    `/rechargeSuccess?amountDesc=${res.amountDesc}&reqSerial=${res.reqSerial}&optionDate=${res.optionDate}&bankIcon=${res.bankIcon}&bankName=${res.bankName}&bankElecAccountNum=${res.bankElecAccountNum}`
                )
            }
        }).catch(e => {
            errHandle(e)
            this.setState({
                errHero: true,
                timer: 60
            })
        })
    }
}

export default TradingCode
