/**
 * @author  Mr.ma
 * @use     购买成功详情页面
 * @date    2019-05-31
 * @param   字符串的形式传递 stepList
 */

import React from 'react'
import './style.scss'
import { observer, inject } from 'mobx-react'
import { Headers } from 'Common/publicCommon/index'
import { BcButton, BcBankMark, BcCopyBuyUrl,BcBanner } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import {commonStore} from "Common/pages/store"
import IconSvg from './IconSvg'
import {buySuccessPage} from 'Common/Plugins/recordLogInfo'
import { session } from 'Common/utils/store';

@observer
class BuySuccess extends React.Component<any, any>{
    Store = Store
    componentDidMount() {
        try {
            buySuccessPage(session.get('proId'))
        } catch(err) {}
    }
    
    render() {
        let {stepList, bankIcon, bankName}:any = commonStore.query();
        let stepListRes: any = JSON.parse(stepList)
        console.log(stepListRes);
        let { lookAssets , complete} = this.Store

        return (
            <div className="buy-success">
                <Headers type="empty">存入结果</Headers>
                <ul className="process-box">
                    <li className="item-step">
                        <div className="line-top buyS-active"></div>
                        <div className="line-bottom"></div>
                        <IconSvg/>
                        <div className="step-detail">
                            <p className="default complate">{stepListRes.amountDesc}</p>
                            <p className="specific-info">{stepListRes.succDateDesc}</p>
                        </div>
                    </li>
                    <li className="item-step">
                        <div className="line-top"></div>
                        <div className="line-bottom"></div>
                        <img src={Images.calculator} width="28" height="28" alt="" />
                        <div className="step-detail">
                            <p className="default not-complate">{stepListRes.revenueDate}</p>
                            <p className="specific-info">{stepListRes.revenueDesc}</p>
                        </div>
                    </li>
                    <li className="item-step">
                        <img src={Images.money} width="28" height="28" alt="" />
                        <div className="step-detail">
                            <p className="default not-complate">{stepListRes.redeemDate}</p>
                            <p className="specific-info">{stepListRes.redeemDateDesc}</p>
                        </div>
                    </li>
                </ul>
                <BcCopyBuyUrl/>
                <BcButton wrapperClassName="buySuccessAssets" className="look-assets" onClick={()=>lookAssets()}>查看我的资产</BcButton>
                <BcButton wrapperClassName="buySuccessComplate" className="btn-complate" onClick={()=>complete()}>完成</BcButton>
                {/* <BcBankMark logo={bankIcon} name={bankName}></BcBankMark> */}
                <BcBanner />
                <BottomColumn type='long'></BottomColumn>
            </div>
        )
    }
}
export default BuySuccess