/**
 * 从异业项目跳转来，参数获取，初始化参数，校验开户状态，页面重定向
 */
import React from 'react'
import TransferPages from '../public/TransferPages'
import { session, } from 'Common/utils/store'
import { Toast } from 'antd-mobile';
export const Base64 = require('js-base64').Base64;
export interface Props {
    [porpsName: string]: any
}

class CheckState extends TransferPages {
    h5FormPage = ''
    /**
     * ==============================银行相关对接参数 start==================================
     */
    /**
     * 去购买
     * @param params
     */
    /**
     * 去支取页
     * @param params
     */
    goRedeem(params) {
        // 外链比财h5带来的参数
        console.log(params);
        let {
            TEADE_AMOUNT,
            TRADE_FLOW_NO,
            PRD_INDEX_ID,
            MIN_REDEEM_AMOUNT,
            MIN_REDEEM_AMOUNT_MSG,
            DEPOSIT_TYPE_ID,
            PRD_TYPE_ID
        } = params
        this.props.history.replace(`/redeem?prdIndexId=${PRD_INDEX_ID}&reqSerial=${TRADE_FLOW_NO}&fieldValue=${TEADE_AMOUNT}&minRedmptAmt=${MIN_REDEEM_AMOUNT}&minRedmptAmtMsg=${MIN_REDEEM_AMOUNT_MSG}&prdType=${PRD_TYPE_ID}&depositTypeId=${DEPOSIT_TYPE_ID}`)
    }
    //
    /**
     * ==============================银行相关对接参数 end ==================================
     */

   componentDidMount(): void {
        // let query: Props = this.queryURL()
        // if (!query) return Toast.info('query获取失败')
        // console.log(query, '---------------query');
        // session.set('ProAndOrgType', query)
        // let {
        //     token,
        //     toOpenBankData,
        // } = query
        // if (token || toOpenBankData.token) {
        //     session.set('_MX_BICAI_TOKEN', token || toOpenBankData.token)
        // }
        console.log(session.get('toOpenBankData'))
        if(!session.get('toOpenBankData')) return Toast.info('没有获取到toOpenBankData')
        let toOpenBankData = session.get('toOpenBankData')
        let {common: {logoUrl, orgName,h5FormPage,orgId}, head, params, type} = toOpenBankData
        if(orgId || head.orgId){// 现在规定h5外站传参再common里
            this.orgId = orgId
            session.set('orgId',orgId || head.orgId)
        }
        // console.log(JSON.parse(toOpenBankData));
        this.setState({
            logoUrl: logoUrl,
            orgName: orgName
        })
        this.h5FormPage = h5FormPage || ''
        session.set('h5FormPage',this.h5FormPage)
        this.initHead(head)
        this.pageDispatch(type,params)
    }


}

export default CheckState
