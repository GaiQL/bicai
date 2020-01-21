import React from 'react'
import {observer} from 'mobx-react'
import {session,StoreKey} from 'Common/utils/store'
import {Toast} from 'antd-mobile';
import BcTransition from 'Common/publicCommon/BcTransition'
import { Native } from "Common/utils/appBridge"

//ui组件
export const Base64 = require('js-base64').Base64;
const orgName = require('../../../web.config').orgName
import {BanksH5URL} from "Common/config/index";

export interface Props {
    [porpsName: string]: any
}

@observer
export default class extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }
    Config = {
        orgName: orgName,
        londingTime: 0
    }
    state = {
        orgName: '',
        logoUrl: ''
    }
    orgId = null
    componentDidMount() {
        // 重写用于获取公共参数
    }

    /**
     * ==============================银行相关对接参数 start==================================
     */
    /**
     * 1.去购买
     * @param params
     */
    goBuy(params) {
        // alert(JSON.parse( params.h5BuyData ))
        // console.log( '-----',JSON.parse( params.h5BuyData ) );
        if (!params.proInfo) return Toast.info('proInfo不能为空')
        //ios传递过来的是对象所以得判断
        let {
            amount,
            teamId, teamID,
            investId, investID,
            activityId, activityID,
            couponId, couponID,
            couponDetailId, couponDetailID,
        } = params.buyParams
        // 拼团过来的，有改参数需要在购买完成后跳转改成功页面，2.0静态页，我们会把参数携带传过去。
        let h5BuyData: any = {}
        try {
            if (typeof (params.h5BuyData) == 'string') {
                h5BuyData = JSON.parse(params.h5BuyData) || {}
                h5BuyData.ACTIVITY_BUY_SUCCESS_LINK ? session.set('JUMP_LINK', h5BuyData.ACTIVITY_BUY_SUCCESS_LINK) : ''
            } else {
                h5BuyData = params.h5BuyData || {}
                h5BuyData.ACTIVITY_BUY_SUCCESS_LINK ? session.set('JUMP_LINK', h5BuyData.ACTIVITY_BUY_SUCCESS_LINK) : ''
            }
        } catch (e) {
            console.log(e);
        }
        let buyParams = {
            // 讲一些
            amount,
            teamId: teamId || teamID,
            investId: investId || investID,
            activityId: activityId || activityID,
            couponId: couponId || couponID,
            couponDetailId: couponDetailId || couponDetailID,
            BUY_PARAM_KEY: h5BuyData ? (h5BuyData.BUY_PARAM_KEY || '') : '',
        }
        session.set('buyParams', buyParams);
        if (typeof (params.proInfo) == 'string') {
            session.set('proInfo', JSON.parse(params.proInfo))//
            let buyUrl = '/buy?proId=' + (JSON.parse(params.proInfo).ID || JSON.parse(params.proInfo).proId)
            this.setTimeRepalce(buyUrl)
        } else {
            session.set('proInfo', params.proInfo)
            let buyUrl = '/buy?proId=' + (params.proInfo.ID || params.proInfo.proId)
            this.setTimeRepalce(buyUrl)
        }

        if (params.isAddBuy == '1') {
            session.set('isAddBuy', '1')
        }
        // 判断是否为组合购买进入【平衡购买】
        if (params.comBuyParams) {
            session.set('comBuyParams', params.comBuyParams)
        }

        // let { toPage, proId } = session.get('query')
        // session.set('buyParams', params.buyParams);
        // this.props.history.replace('/buy?proId=' + params.proInfo.ID)
    }

    /**
     * 2.去开户页
     * @param params
     */
    goOpen(params) {
        this.setTimeRepalce('/openFlow')
    }

    /**
     * 3.去银行详情页
     * @param params
     */
    goDetail(params) {
        this.setTimeRepalce('/bankDetail')
    }

    /**
     * 4.去支取页
     * @param params
     */
    goRedeem(params) {
        // this.props.history.replace(`/redeem?prdIndexId=${prdIndexId}&reqSerial=${reqSerial}&amount=${amount}&minRedmptAmt=${minRedmptAmt}&minRedmptAmtMsg=${minRedeemAmountMsg}`)
    }

    /**
     * 5.去更新身份证
     * @param params
     */
    goUpdateIDCard(params?) {
        this.setTimeRepalce('/updateIdCard?fromApp=1')
    }

    /**
     * 6.去更新身份证引导页
     * @param params
     */
    upDateIdCardGuidePage(params?) {
        this.setTimeRepalce('/upDateIdCardGuidePage')
    }

    /**
     * 7.去风险评测页
     * @param params
     */
    goRiskAppraisal(params) {
        this.setTimeRepalce('/riskAppraisal')
    }

    /**
     * 7.去设置密码
     * @param params
     */
    goSetBankPassword(params) {
        //
    }
    /**
     * 7.新增去绑卡页面
     * @param params
     */
    goChangBank(params) {
        let {flag} = params
        // flag == 'comBuying'
        // alert(flag)
        session.set(StoreKey.changeBankOriginPage,flag)
        this.setTimeRepalce('/changeBank?page='+flag)
    }

    /**
     * 7.新增去绑卡页面
     * @param params
     */
    goOpenPerfection(params) {
        this.setTimeRepalce('/openPerfection')
    }

    /**
     * 去签约
     * @param params
     */
    goBankSigning(params) {
        let { defaultCard, source } = params
        this.setTimeRepalce(`/signing?defaultCard=${defaultCard}&source=${source}`)
    }
    /**
     * ==============================银行相关对接参数 end ==================================
     */


    /**
     * =============================比财页面对接 start ==================================
     */
    /**
     * 1 去比财的实名认证页面 针对站内的！跳转外链
     * @param params
     */
    goBcRealName(params) {
        this.goRealName()
    }

    /**
     * 2 去比财的更新身份证页面 针对站内的！跳转外链 -3项目要重写
     * @param params
     */
    goBcUpdateIDCard(params) {
        this.windowRepalce(BanksH5URL.bcUpdateIDCardUrl)
    }

    /**
     * 3 去比财的活体页面。针对站内的！跳转外链 -3项目要重写
     * @param params
     */
    goBcFaceDiscern(params) {
        console.log(params);//
        let {userName, identNo} = params
        this.windowRepalce(BanksH5URL.bcFaceDiscern + `?userName=${userName}&identNo=${identNo}`)
    }

    /**
     * ==============================比财页面 end ==================================
     */
    //延时跳转
    setTimeRepalce(path, time = this.Config.londingTime) {
        setTimeout(() => {
            this.props.history.replace(path)
        }, time)
    }

    //延时跳转
    windowRepalce(path, time = 2000) {
        setTimeout(() => {
            // window.location.replace(path)
            this.locationReplace(path)

        }, time)
    }
    locationReplace(url){
        // 兼容安卓
        // if(history.replaceState){
        //     history.replaceState(null, document.title, url);
        //     history.go(0);
        // }else{
        location.replace(url);
        // }
    }

    /**
     * 分发前的校验。有的需要进行校验
     */
    beforeDispatch = async (type?, params?) => {
        console.log(type, params);
        return Promise.resolve()
    }
    /**
     * 专门用于页面分发
     * @param type
     * @param params
     */
    pageDispatch = async (type, params) => {
        if(params && params['object']){
            params = params['object']
        }
        if(params && (typeof params == 'string')){
            params = JSON.parse(params)
        }
        await this.beforeDispatch(type, params) // 分发前的校验
        console.log('pageDispatch');
        // 银行相关
        if (type == 'buy') {
            this.goBuy(params)
        }
        if (type == 'open') {
            this.goOpen(params)
        }
        if (type == 'bankAssets' || type == "bankDetail") {
            this.goDetail(params)
        }
        if (type == 'redeem') {
            this.goRedeem(params)
        }
        if (type == 'updataIDCard' || type == 'updateIdCard') {
            this.goUpdateIDCard(params)
        }
        if (type == 'upDateIdCardGuidePage') {
            this.upDateIdCardGuidePage(params)
        }
        if (type == 'riskAppraisal') {
            this.goRiskAppraisal(params)
        }
        // 新增更换银行卡
        if (type == 'changeBank') {
            this.goChangBank(params)
        }
        //
        if (type == 'openPerfection') {
            this.goOpenPerfection(params)
        }
        //
        if (type == 'setBankPassword') {
            this.goSetBankPassword(params)
        }
        // 去签约
        if (type == 'goBankSigning') {
            this.goBankSigning(params)
        }
        // ============比财相关
        if (type == 'bcUpdateIDCard' || type == 'BcUpdateIDCard' || type=='bcUpdateIdCard') {
            this.goBcUpdateIDCard(params)
        }
        if (type == 'bcFaceDiscern') {
            this.goBcFaceDiscern(params)
        }

        // if (type == 'bcLogin') {
        //     this.goBcFaceDiscern(params)
        // }
    }

    /**
     * 初始化参数
     * @param env
     * @param orgId
     * @param orgName
     * @param logoUrl
     */
    initCommon({
                   env,
                   orgId = '', // 机构id
                   orgName = '', // 机构名称
                   logoUrl = '', // 机构logoUrl
               }: {
        env: string,
        orgId: string | number,
        orgName?: string,
        logoUrl?: string,
    }) {
        // if(orgId!=ORG_ID){
        //     Toast.info('orgId不正确')
        // }
        console.log(orgName, logoUrl)
        this.setState({
            orgName: orgName,
            logoUrl: logoUrl,
        })
    }

    /**
     * 对接native原生-初始化head头
     * @param channelId
     * @param deviceId
     * @param userChannel
     * @param appFlag
     * @param systemType
     * @param version
     * @param clientId
     * @param channel
     * @param token
     * @param channelType
     * @param deviceName
     */
    initHead({
                 channelId,
                 deviceId,
                 userChannel,
                 appFlag,
                 systemType,
                 version,
                 clientId,
                 channel,
                 token,
                 channelType,
                 deviceName,
                 orgId,
             }) {
        // if (!token) {
        //     Toast.info('token不能为空')
        //     return Promise.reject()
        // }
        if (channelId) {
            session.set('channelId', channelId)
        }
        if (deviceId) {
            session.set('deviceId', deviceId)
        }
        if (userChannel) {
            session.set('userChannel', userChannel)
        }
        if (appFlag) {
            session.set('appFlag', appFlag)
        }
        if (systemType) {
            session.set('systemType', systemType)
        }
        if (version) {
            session.set('version', version)
        }
        if (clientId) {
            session.set('clientId', clientId)
        }
        if (channel) {
            session.set('channel', channel)
        }
        if (channelType) {
            session.set('channelType', channelType)
        }
        if (deviceName) {
            session.set('deviceName', deviceName)
        }
        if (orgId && (orgId - 0> 0)) {
            session.set('orgId', orgId)
        }
        let _MX_BICAI_TOKEN = session.get('_MX_BICAI_TOKEN')
        if (token || _MX_BICAI_TOKEN) {
            session.set('_MX_BICAI_TOKEN', token || _MX_BICAI_TOKEN)
        }else {
            if(Native.isApp()){

            }else {
                window.location.replace(BanksH5URL.bcLoginUrl)
            }
        }
        return Promise.resolve()
    }

    /**
     * 未实名去实名
     */
    goRealName(targetHref?) {
        if (targetHref) {
            session.set('realName_targetHref', targetHref) // 来源页面
        }
        window.location.href = BanksH5URL.realNameUrl
    }
    queryURL() {
        let url = this.props.location.search
        if (!url) return null
        var arr1 = url.split("?");
        var params = arr1[1].split("&");
        var obj = {};//声明对象
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split("=");
            obj[param[0]] = decodeURIComponent(param[1]);//为对象赋值
        }
        return obj;
    }

    render(): React.ReactNode {
        let bcTrConfig = {
            orgName: this.state.orgName,
            logoUrl: this.state.logoUrl,
            headerText: this.Config.orgName,
        }
        return (
            <BcTransition {...bcTrConfig} />
        )
    }

}

