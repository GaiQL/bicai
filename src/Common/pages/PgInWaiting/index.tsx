/**
 * @author  Mr.ma
 * @use     四大交易的处理中的页面
 * @date    2019-05-31
 * @params  status (2：充值，3：提现，1：存入，5：支取)(必要条件)
 *          param 跳转到某一页面的需要携带的参数
 */

import React from 'react'
import './style.scss'
import { Native } from "Common/utils/appBridge"
import { session } from "Common/utils/store";
import { Headers, BcButton, BcBankMark } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import { commonStore } from 'Common/pages/store'
import BottomColumn from 'Common/publicCommon/BottomColumn'


const rules = new Map([
    [1, ['存入结果', '/holdProductList']],
    [2, ['充值结果', '/bankDetail']],
    [3, ['提现结果', '/bankDetail']],
    [5, ['支取结果', '/holdProductList']]
])

class Waiting extends React.Component<any, any>{
    complate() {
        let res: any = commonStore.query()
        let flag = this.props.status == 1 || this.props.status === 5 ? true : false
        let str = ''
        if (flag) {
            if (this.props.status == 1) {
                // 判断是否为组合购买进入【平衡购买】
                let flags: boolean = session.get('comBuyParams') ? (session.get('comBuyParams').groupPrdFlag == '1' ? false : true) : true
                if (!flags) {
                    Native.closeWebView()
                    return
                }
            }
            str = `?depositTypeId=${res.depositTypeId}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&toCancelPageType=500`
        }
        this.props.history.replace(flag ? `${rules.get(this.props.status)[1] + str}` : `${rules.get(this.props.status)[1]}`)
        
    }
    render() {
        let res: any = commonStore.query()
        let title = rules.get(this.props.status)[0]
        return (
            <div className="buy-results">
                <Headers type="empty">{title}</Headers>
                <section>
                    <img src={Images.wait} alt="" width="60" height="60" />
                    <div className="status">{res.orderMsgTitle}</div>
                    <div className="result" dangerouslySetInnerHTML={{ __html: res.orderMsgContent }}></div>
                </section>
                <BcButton onClick={this.complate.bind(this)}>完成</BcButton>
                {/* <BcBankMark logo={res.bankIcon} name={res.bankName}></BcBankMark> */}
                <BottomColumn type='long'/>
            </div>
        )
    }
}
export default Waiting