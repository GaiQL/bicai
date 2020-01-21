/**
 * 从异业项目跳转来，参数获取，初始化参数，校验开户状态，页面重定向
 */

import React from 'react'
import {observer, inject} from 'mobx-react'
import {session} from 'Common/utils/store'
import {Toast} from 'antd-mobile';//ui组件
import {token} from 'Common/utils/user'
import apiBicai from "Common/api/bicai2.0"
import {apiFactory, apiVersion} from 'Common/api/bank'
import BcTransition from 'Common/publicCommon/BcTransition'



@observer
class CheckState extends React.Component<any, any> {
    /*=========控制api版本 start page里建议不要进行apiBank请求数据，统一到store里 ========*/
    apiVersion: apiVersion = this.props.apiVersion || 'v2'
    apiBank: any = apiFactory(this.apiVersion)
    /*=========控制api版本 end========*/
    state = {
        ORG_NAME: '',
        LOGO_URL: ''
    }

    componentDidMount(): void {
        let query:any = this.queryURL()
        if (!query) return Toast.info('query获取失败')
        console.log(query);
        // session.set('query', query)
        session.set('ProAndOrgType', query)
        let {
            TOKEN,
        } = query
        this.initData(query)
        if (TOKEN) {
            token.set(TOKEN)
            this.checkState(query)
        } else {
            Toast.info('TOKEN获取失败')
        }
    }

    /**
     * 校验用户开户状态。同时根据来源页判断去哪里
     * @param toPage
     * @param proId
     */
    async checkState({toPage, proId}:any) {
        console.log('proId', proId);
        try {
            let {hasOpenBank,openAccountStatus,hasOpenAccountText}:any = await this.apiBank.apiQryLoginStatus({})
            if(hasOpenBank == 1){ // 已开户
                this.openSuccess(toPage, proId)
            }else if(hasOpenBank == 2){ // 未开户
                this.props.history.replace('/openFlow')
            }else {
                if(hasOpenAccountText){ // 开户处理中
                    Toast.info(hasOpenAccountText)
                }
                setTimeout(()=>{
                    this.props.history.go(-1)
                },1000)
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     *
     * @param ORG_NAME
     * @param BANK_LOGO_URL
     * @param LOGO_URL
     * @param DEVICE_ID
     * @param APP_FLAG
     * @param CHANNEL_ID
     * @param SYSTEM_TYPE
     * @param OPEN_API_CHANNEL_ID
     * @param OriginHost
     * @param AMOUNT
     * @param COUPON_ID
     * @param COUPON_DETAIL_ID
     * @param TEAM_ID
     * @param INVEST_ID
     */
    initData({
                 ORG_NAME,
                 BANK_LOGO_URL,
                 LOGO_URL,
                 DEVICE_ID,
                 APP_FLAG,
                 CHANNEL_ID,
                 SYSTEM_TYPE,
                 OPEN_API_CHANNEL_ID,
                 OriginHost,
                 AMOUNT, // 投资金额
                 COUPON_ID, // 优惠券ID	非必填  字符型
                 COUPON_DETAIL_ID, // 会员领券记录ID
                 TEAM_ID, // 活动ID
                 INVEST_ID, // 投资ID
                 expandJson // 活动相关参数
             }:any): void {
        this.setState({
            LOGO_URL: BANK_LOGO_URL || LOGO_URL,
            ORG_NAME
        })
        if(SYSTEM_TYPE){
            session.set('systemType', SYSTEM_TYPE)
        }
        if (DEVICE_ID) { // 设备id h5取不到
            session.set('deviceId', DEVICE_ID)
        }
        if (CHANNEL_ID) {
            session.set('channelId', CHANNEL_ID)
        }
        if (OPEN_API_CHANNEL_ID) {
            session.set('userChannel', OPEN_API_CHANNEL_ID)
        }
        if (APP_FLAG) {
            session.set('appFlag', APP_FLAG)
        }
        if (OriginHost) { // 用于回跳
            session.set('OriginHost', OriginHost)
        }
        let buyParams = {
            amount: AMOUNT || '', // 投资金额。amount
            couponId:COUPON_ID || '', // 优惠券ID	非必填。字符型 couponId
            couponDetailId: COUPON_DETAIL_ID || '', // 会员领券记录ID couponDetailId
            teamId: TEAM_ID || '', // 活动ID temId
            investId: INVEST_ID || '', // 投资ID investId
        }
        session.set('buyParams', buyParams);
        session.set('expandJson', expandJson || ''); // 为了以后参数
    }

    /**
     * 判断已经开户成功去哪里
     * @param toPage
     * @param proId
     */
    openSuccess(toPage, proId): void {
        console.log(toPage,proId);
        if (toPage == 'buy') {
            this.goBuy(proId)
        } else if (toPage == 'order') {
            Toast.info('产品已经下架')
        } else if (toPage == 'BankAccount') {

        } else if (toPage == 'bankAssets') {
            this.goBankDetail()
        } else if (toPage == 'updateIdCard') {
            // 身份证过期
            if(proId){
                this.getProInfo(proId)
                this.props.history.replace('/updateIdCard?proId='+ proId)
            }else {
                this.goBankDetail()
            }
        } else if (toPage == 'riskAppraisal') {
            this.getProInfo(proId)
            this.props.history.replace('/riskAppraisal')
        } else {
            this.goBankDetail()
        }
    }

    goBankDetail(): void {
        this.props.history.replace({pathname: '/bankDetail'})
    }
    async getProInfo(proId: any){
        if(session.get('proInfo') && session.get('proInfo').prdIndexId ==  proId){
            return Promise.resolve()
        }else {
            let res = await apiBicai.getPrdInfo({ID: proId})
            session.set('proInfo', res)
            return Promise.resolve()
        }
    }
    async goBuy(proId: any) {
        // 保存产品信息
        // 跳转购买页
        // await this.getProInfo(proId)
        this.props.history.replace('/buy?proId=' + proId)
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
            orgName:this.state.ORG_NAME,
            logoUrl:this.state.LOGO_URL,
            headerText:this.state.ORG_NAME,
        }
        return (
            <BcTransition {...bcTrConfig}/>
        )
    }

}

export default CheckState
