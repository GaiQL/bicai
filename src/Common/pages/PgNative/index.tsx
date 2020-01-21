import React from 'react'
import TransferPages from '../public/TransferPages'
import { session, } from 'Common/utils/store'
import { Toast } from 'antd-mobile';
import { Native } from "Common/utils/appBridge"
export const Base64 = require('js-base64').Base64;
import {HeaderAppBrige} from './preJs'
declare var window
export interface Props {
    [porpsName: string]: any
}
// const imgUrl = require('Common/assets/images/back@2x.png')
class CheckState extends TransferPages {
    HeaderAppBrige = HeaderAppBrige
    componentWillUnmount(): void {
        if (Native.isApp()) {
            try {
                window.native.setHeaderLeftRes('0', '')  // 空的是原生默认
                Native.apiNavBarStyleClose('back')
            } catch (e) {
                Toast.info(e)
            }
        }
    }
    componentDidMount() {
        // native.js挂载与原生交互的方法
        // 原生跳转改页面，获取原生调取window.sendParam()的参数
        // 尽量使得的sendParam的挂载声明周期考前---》index.html加载时就进行挂载
        // 加延迟，保证参数正常获取。
        if (Native.isApp()) {
            let timer = setInterval(() => {
                let data = window.sessionStorage.getItem('nativeData')
                //console.log(window.sessionStorage.getItem('nativeData'));
                if (data) {
                    this.sendParam(data)
                    clearInterval(timer)
                }
            }, 50)
        }
    }

    /**
     * ==============================重写！银行相关对接参数 start==================================
     */
    /**
     * 1.去购买=》app内方法重写
     * @param params
     */
    /**
     * 去开户页
     * @param params
     */
    // goOpen(params) {
    //     this.props.history.replace('/openFlow')
    // }

    /**
     * 去银行详情页
     * @param params
     */
    // goDetail(params) {
    //     this.props.history.replace('/bankDetail')
    // }

    /**
     * 去支取页
     * @param params
     */
    goRedeem(params) {
        // alert(JSON.stringify(params))
        session.set('appToReed', '1') // app直接跳转支取，需要支取时判断，回到app持仓页
        // if (!params.redeemParams) return Toast.info('redeemParams不能为空')
        // let {prdIndexId, reqSerial, fieldValue, minRedmptAmt, minRedmptAmtMsg} = params.redeemParams
        console.log(params.orderInfo)
        // 从原生取字段
        let { PRD_INDEX_ID,
            ORDER_NUM,
            minRedeemAmount,
            minRedeemAmountMsg,
            DP_DETAIL_INVEST_TOTAL_AMT,
            HOLD_AMOUNT,
            prdDrawMode, // 哈密银行判断支取类型【全部/部分】
        } = params.orderInfo
        let prdIndexId = PRD_INDEX_ID // 产品·id
        let reqSerial = ORDER_NUM // 流水号
        let amount = DP_DETAIL_INVEST_TOTAL_AMT || HOLD_AMOUNT // 持有中金额
        minRedeemAmount = minRedeemAmount
        let minRedmptAmt = minRedeemAmountMsg
        this.props.history.replace(`/redeem?prdIndexId=${prdIndexId}&reqSerial=${reqSerial}&amount=${amount}&minRedmptAmt=${minRedmptAmt}&minRedmptAmtMsg=${minRedeemAmountMsg}&prdDrawMode=${prdDrawMode}`)
    }

    /**
     * 去更新身份证
     * @param params
     */
    // goUpdateIDCard(params) {
    //     this.props.history.replace('/updateIdCard?fromApp=1')
    // }
    /**
     * 去更新身份证引导页
     * @param params
     */
    // upDateIdCardGuidePage(params) {
    //     this.props.history.replace('/upDateIdCardGuidePage')
    // }
    /**
     * ==============================银行相关对接参数 end ==================================
     */
    /**
     * 获取app参数，初始化数据
     * @param val
     */
    async sendParam(val) {
        let res: any = JSON.parse(Base64.decode(val)); //查询登录用户某机构绑定卡信息接口apiBandCard
        let {
            type, // buy 购买 open 开户 bankAssets 银行资产 redeem
            common,
            head,
            params = {}
        }: Props = res
        console.log('res>>>', res);
        // Toast.info(type)
        await this.initCommon(common)
        await this.initHead(head)
        if (!type) return Toast.info('target不能为空')
        if (params && params['object']) {
            params = params['object']
        }
        if (params && (typeof params == 'string')) {
            params = JSON.parse(params)
        }
        this.pageDispatch(type, params)
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
    }) {
        if (!token) {
            Toast.info('token不能为空')
            return Promise.reject()
        }
        if (token) {
            session.set('_MX_BICAI_TOKEN', token)
        }
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
        return Promise.resolve()
    }
}

export default CheckState
